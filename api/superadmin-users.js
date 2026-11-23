import { createClient } from "@supabase/supabase-js";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MEMBERSHIP_ROLES = ["admin", "recruiter", "hiring_manager", "interviewer", "employee"];
const ACCOUNT_STATUSES = ["active", "suspended", "inactive"];

function clients() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const publicKey = process.env.SUPABASE_PUBLISHABLE_KEY
    || process.env.SUPABASE_ANON_KEY
    || process.env.VITE_SUPABASE_PUBLISHABLE_KEY
    || process.env.VITE_SUPABASE_ANON_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) return { error: "Missing SUPABASE_URL or VITE_SUPABASE_URL in the server environment." };
  if (!publicKey) return { error: "Missing a Supabase publishable/anon key in the server environment." };
  if (!secretKey) return { error: "Missing server-only SUPABASE_SECRET_KEY (or legacy SUPABASE_SERVICE_ROLE_KEY). Add it to .env.local and restart Vite." };

  return {
    authClient: createClient(url, publicKey, { auth: { persistSession: false, autoRefreshToken: false } }),
    adminClient: createClient(url, secretKey, { auth: { persistSession: false, autoRefreshToken: false } }),
  };
}

async function authorizeSuperadmin(request) {
  const configuredClients = clients();
  if (configuredClients.error) return { error: configuredClients.error, status: 500 };

  const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return { error: "Sign in is required.", status: 401 };

  const { authClient, adminClient } = configuredClients;
  const { data: authData, error: authError } = await authClient.auth.getUser(token);
  if (authError || !authData.user) return { error: "Your session is invalid or expired.", status: 401 };

  const { data: actorProfile, error: profileError } = await adminClient
    .from("profiles")
    .select("role,status")
    .eq("id", authData.user.id)
    .maybeSingle();
  if (profileError || actorProfile?.role !== "superadmin" || String(actorProfile.status).toLowerCase() !== "active") {
    return { error: "Only an active platform superadmin can manage users.", status: 403 };
  }

  return { actor: authData.user, adminClient };
}

function sendError(response, status, message) {
  return response.status(status).json({ error: message });
}

async function listAllAuthUsers(adminClient) {
  const users = [];
  const perPage = 1000;
  for (let page = 1; page <= 100; page += 1) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    users.push(...(data.users || []));
    if ((data.users || []).length < perPage) return users;
  }
  throw new Error("The user directory is too large to load in one request.");
}

async function readAllRows(queryFactory) {
  const rows = [];
  const pageSize = 1000;
  for (let offset = 0; offset < 100000; offset += pageSize) {
    const { data, error } = await queryFactory().range(offset, offset + pageSize - 1);
    if (error) throw error;
    rows.push(...(data || []));
    if ((data || []).length < pageSize) return rows;
  }
  throw new Error("The directory contains too many records to load in one request.");
}

async function getDirectory(adminClient) {
  const [authUsers, profilesResult, membershipsResult, organizationsResult] = await Promise.all([
    listAllAuthUsers(adminClient),
    readAllRows(() => adminClient.from("profiles").select("id,organization_id,first_name,last_name,email,phone,role,status,avatar_url,created_at,updated_at")),
    readAllRows(() => adminClient.from("organization_memberships").select("id,user_id,organization_id,role,status,created_by,created_at,updated_at")),
    readAllRows(() => adminClient.from("organizations").select("id,name,slug,status,created_at")),
  ]);

  const profiles = new Map(profilesResult.map((profile) => [profile.id, profile]));
  const organizations = new Map(organizationsResult.map((organization) => [organization.id, organization]));
  const memberships = new Map();
  for (const membership of membershipsResult) {
    const current = memberships.get(membership.user_id) || [];
    current.push({ ...membership, organization: organizations.get(membership.organization_id) || null });
    memberships.set(membership.user_id, current);
  }

  return {
    users: authUsers.map((authUser) => {
      const profile = profiles.get(authUser.id) || null;
      const userMemberships = memberships.get(authUser.id) || [];
      return {
        id: authUser.id,
        email: authUser.email || profile?.email || "",
        phone: profile?.phone || authUser.phone || "",
        emailConfirmedAt: authUser.email_confirmed_at || null,
        createdAt: authUser.created_at,
        lastSignInAt: authUser.last_sign_in_at || null,
        firstName: profile?.first_name || authUser.user_metadata?.first_name || "",
        lastName: profile?.last_name || authUser.user_metadata?.last_name || "",
        profileRole: profile?.role || "user",
        status: profile?.status || "active",
        organizationId: profile?.organization_id || userMemberships[0]?.organization_id || null,
        memberships: userMemberships,
        avatarUrl: profile?.avatar_url || null,
        profileCreatedAt: profile?.created_at || null,
        profileUpdatedAt: profile?.updated_at || null,
      };
    }).sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()),
    organizations: organizationsResult,
  };
}

async function updateUser(request, response, authorization) {
  const { adminClient, actor } = authorization;
  const body = typeof request.body === "string" ? JSON.parse(request.body) : request.body || {};
  const {
    userId,
    firstName = "",
    lastName = "",
    phone = "",
    email = "",
    platformRole = "user",
    organizationId = null,
    membershipRole = null,
    status = "active",
  } = body;

  if (!UUID_PATTERN.test(userId || "")) return sendError(response, 400, "A valid user ID is required.");
  if (!String(firstName).trim() || !String(lastName).trim()) return sendError(response, 400, "First and last name are required.");
  if (!EMAIL_PATTERN.test(String(email).trim())) return sendError(response, 400, "Enter a valid email address.");
  if (String(phone).trim().length > 40) return sendError(response, 400, "Phone number must be 40 characters or fewer.");
  if (!ACCOUNT_STATUSES.includes(status)) return sendError(response, 400, "Choose a valid account status.");
  if (!["user", "superadmin"].includes(platformRole)) return sendError(response, 400, "Choose a valid platform role.");
  if (organizationId && !UUID_PATTERN.test(organizationId)) return sendError(response, 400, "Choose a valid organization.");
  if (platformRole === "superadmin" && organizationId) {
    return sendError(response, 400, "Platform superadmins cannot be assigned to an organization.");
  }
  if (actor.id === userId && (platformRole !== "superadmin" || status !== "active")) {
    return sendError(response, 400, "You cannot remove or disable your own active superadmin access.");
  }
  if (organizationId && !MEMBERSHIP_ROLES.includes(membershipRole)) {
    return sendError(response, 400, "Choose a valid organization role.");
  }

  const { data: existingProfile, error: profileError } = await adminClient
    .from("profiles")
    .select("id,email,role,status,first_name,last_name")
    .eq("id", userId)
    .maybeSingle();
  if (profileError) return sendError(response, 500, profileError.message);
  if (!existingProfile) return sendError(response, 404, "User profile not found.");

  const { data: authResult, error: authLookupError } = await adminClient.auth.admin.getUserById(userId);
  if (authLookupError || !authResult.user) return sendError(response, 404, "Authentication user not found.");

  const authUser = authResult.user;
  const normalizedEmail = String(email).trim().toLowerCase();
  const emailChanged = normalizedEmail !== String(authUser.email || "").toLowerCase();
  const metadataChanged = String(firstName).trim() !== String(authUser.user_metadata?.first_name || "")
    || String(lastName).trim() !== String(authUser.user_metadata?.last_name || "");
  let authUpdated = false;

  if (emailChanged || metadataChanged) {
    const attributes = {
      user_metadata: {
        ...(authUser.user_metadata || {}),
        first_name: String(firstName).trim(),
        last_name: String(lastName).trim(),
      },
    };
    if (emailChanged) {
      attributes.email = normalizedEmail;
      attributes.email_confirm = true;
    }
    const { error: authUpdateError } = await adminClient.auth.admin.updateUserById(userId, attributes);
    if (authUpdateError) return sendError(response, 400, authUpdateError.message);
    authUpdated = true;
  }

  const { error: databaseError } = await adminClient.rpc("superadmin_update_user", {
    _actor_id: actor.id,
    _user_id: userId,
    _first_name: String(firstName).trim(),
    _last_name: String(lastName).trim(),
    _phone: String(phone).trim(),
    _email: normalizedEmail,
    _platform_role: platformRole,
    _organization_id: organizationId || null,
    _membership_role: organizationId ? membershipRole : null,
    _status: status,
  });

  if (databaseError) {
    if (authUpdated) {
      await adminClient.auth.admin.updateUserById(userId, {
        email: authUser.email,
        email_confirm: Boolean(authUser.email_confirmed_at),
        user_metadata: authUser.user_metadata || {},
      });
    }
    const statusCode = databaseError.code === "42501" ? 403 : databaseError.code === "P0002" ? 404 : 400;
    return sendError(response, statusCode, databaseError.message);
  }

  return response.status(200).json({ message: "User details updated." });
}

export default async function handler(request, response) {
  if (!(["GET", "PATCH"].includes(request.method))) {
    response.setHeader("Allow", "GET, PATCH");
    return sendError(response, 405, "Method not allowed.");
  }

  const authorization = await authorizeSuperadmin(request);
  if (authorization.error) return sendError(response, authorization.status, authorization.error);

  try {
    if (request.method === "GET") {
      return response.status(200).json(await getDirectory(authorization.adminClient));
    }
    return await updateUser(request, response, authorization);
  } catch (error) {
    return sendError(response, 500, error.message || "Could not manage the user directory.");
  }
}
