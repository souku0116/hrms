import { createClient } from "@supabase/supabase-js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return response.status(500).json({ error: "Invitation service is not configured." });
  }

  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return response.status(401).json({ error: "Sign in is required." });

  const authClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: authData, error: authError } = await authClient.auth.getUser(token);
  if (authError || !authData.user) return response.status(401).json({ error: "Your session is invalid or expired." });

  const { organizationId, email, firstName = "", lastName = "", role = "recruiter" } = request.body || {};
  if (!organizationId || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "")) {
    return response.status(400).json({ error: "Organization and valid email are required." });
  }
  if (!["admin", "recruiter"].includes(role)) return response.status(400).json({ error: "Unsupported invitation role." });

  const { data: actorProfile, error: profileError } = await adminClient
    .from("profiles").select("role,status").eq("id", authData.user.id).single();
  if (profileError) return response.status(403).json({ error: "Could not verify your platform access." });
  const isSuperadmin = actorProfile.role === "superadmin" && String(actorProfile.status).toLowerCase() === "active";
  const { data: actorMembership } = await adminClient
    .from("organization_memberships").select("role,status")
    .eq("organization_id", organizationId).eq("user_id", authData.user.id).maybeSingle();
  const isOrgAdmin = String(actorProfile.status).toLowerCase() === "active" && actorMembership?.role === "admin" && actorMembership.status === "active";
  if (!isSuperadmin && !(isOrgAdmin && role === "recruiter")) {
    return response.status(403).json({ error: "Only platform superadmins can invite organization admins. Organization admins can invite recruiters." });
  }

  const { data: organization, error: organizationError } = await adminClient
    .from("organizations").select("id").eq("id", organizationId).maybeSingle();
  if (organizationError || !organization) return response.status(404).json({ error: "Organization not found." });

  const { data: invitation, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email.trim(), {
    data: { first_name: firstName.trim(), last_name: lastName.trim() },
  });
  let invitedUser = invitation?.user;
  let alreadyHadAccount = false;
  if (inviteError) {
    const { data: existingProfile } = await adminClient.from("profiles").select("id").ilike("email", email.trim()).maybeSingle();
    if (!existingProfile) return response.status(400).json({ error: inviteError.message });
    invitedUser = { id: existingProfile.id };
    alreadyHadAccount = true;
  }
  if (!invitedUser) return response.status(400).json({ error: "The invitation could not be created." });

  const { data: existingMembership } = await adminClient.from("organization_memberships")
    .select("role").eq("organization_id", organizationId).eq("user_id", invitedUser.id).maybeSingle();
  if (!isSuperadmin && existingMembership?.role === "admin" && role === "recruiter") {
    return response.status(409).json({ error: "An organization admin cannot be changed to recruiter through an invitation." });
  }

  const { error: membershipError } = await adminClient.from("organization_memberships").upsert({
    organization_id: organizationId,
    user_id: invitedUser.id,
    role,
    status: "active",
    created_by: authData.user.id,
  }, { onConflict: "organization_id,user_id" });
  if (membershipError) {
    return response.status(500).json({ error: "The invitation was sent, but organization access could not be recorded. Contact support before resending." });
  }

  return response.status(200).json({ message: alreadyHadAccount ? "Existing account added to the organization." : "Invitation sent." });
}
