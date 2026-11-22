import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import supabase from "@/lib/supabaseClient";
import { PageHeader } from "@/components/superadmin";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/routes/routeConstants";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";

export default function OrganizationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [organization, setOrganization] = useState(null);
  const [members, setMembers] = useState([]);
  const [counts, setCounts] = useState({ departments: 0, locations: 0, requisitions: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [invite, setInvite] = useState({ email: "", firstName: "", lastName: "", role: "admin" });
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviting, setInviting] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    const [org, team, depts, locations, reqs] = await Promise.all([
      supabase.from("organizations").select("*").eq("id", id).single(),
      supabase.from("organization_memberships").select("id,role,status,profiles(first_name,last_name,email)").eq("organization_id", id).order("created_at", { ascending: false }),
      supabase.from("departments").select("id", { count: "exact", head: true }).eq("organization_id", id),
      supabase.from("locations").select("id", { count: "exact", head: true }).eq("organization_id", id),
      supabase.from("requisitions").select("id", { count: "exact", head: true }).eq("organization_id", id),
    ]);
    setOrganization(org.data); setMembers(team.data || []);
    setCounts({ departments: depts.count || 0, locations: locations.count || 0, requisitions: reqs.count || 0 });
    setError(org.error?.message || team.error?.message || depts.error?.message || locations.error?.message || reqs.error?.message || "");
    setLoading(false);
  }, [id]);
  useEffect(() => { load(); }, [load]);
  async function toggleStatus() {
    const { error: updateError } = await supabase.from("organizations").update({ status: organization.status === "active" ? "suspended" : "active" }).eq("id", id);
    if (updateError) setError(updateError.message); else await load();
  }
  async function inviteMember(event) {
    event.preventDefault(); setInviting(true); setError(""); setInviteMessage("");
    const { data } = await supabase.auth.getSession();
    try {
      const result = await fetch("/api/invite-member", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token || ""}` }, body: JSON.stringify({ organizationId: id, ...invite }) });
      const isJson = result.headers.get("content-type")?.includes("application/json");
      const payload = isJson ? await result.json() : {};
      if (!result.ok || !isJson) setError(payload.error || "Invitation failed. Use the API-enabled Vercel local server or deployment.");
      else { setInviteMessage(payload.message || "Invitation sent."); setInvite({ email: "", firstName: "", lastName: "", role: "admin" }); await load(); }
    } catch { setError("Invitation service could not be reached. Ensure the Vercel API is configured."); }
    setInviting(false);
  }
  if (loading) return <main className="p-8" role="status">Loading organization…</main>;
  if (!organization) return <main className="p-8"><p role="alert">{error || "Organization not found."}</p><Link to={ROUTES.SUPERADMIN_ORGANIZATIONS}>Return to organizations</Link></main>;
  return <div><PageHeader title={organization.name} subtitle={`Organization · ${organization.slug}`} actions={<Button onClick={toggleStatus} variant="outline">{organization.status === "active" ? "Suspend organization" : "Activate organization"}</Button>} />
    <main className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">{error && <p role="alert" className="text-sm text-error">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-3">{Object.entries(counts).map(([label, value]) => <section className="rounded-xl border border-border bg-background p-5" key={label}><p className="text-sm capitalize text-textSecondary">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></section>)}</div>
      <section className="overflow-x-auto rounded-xl border border-border bg-background"><h2 className="border-b border-border p-4 font-semibold">Organization team</h2><table className="w-full text-left text-sm"><thead className="bg-surface"><tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Status</th></tr></thead><tbody className="divide-y divide-border">{members.length === 0 ? <tr><td className="p-5 text-textSecondary" colSpan="4">No members yet.</td></tr> : members.map((member) => <tr key={member.id}><td className="p-4">{[member.profiles?.first_name, member.profiles?.last_name].filter(Boolean).join(" ") || "—"}</td><td className="p-4">{member.profiles?.email || "—"}</td><td className="p-4 capitalize">{member.role.replaceAll("_", " ")}</td><td className="p-4 capitalize">{member.status}</td></tr>)}</tbody></table></section>
      <form className="grid gap-4 rounded-xl border border-border bg-background p-5 md:grid-cols-2" onSubmit={inviteMember}><div className="md:col-span-2"><h2 className="font-semibold">Invite organization member</h2><p className="mt-1 text-sm text-textSecondary">Invite an administrator or recruiter. Invitations are sent by Supabase Auth.</p></div><Input label="Email" type="email" required value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} /><label className="block text-sm font-medium">Role<select className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2" value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value })}><option value="admin">Admin</option><option value="recruiter">Recruiter</option></select></label><Input label="First name" required value={invite.firstName} onChange={(e) => setInvite({ ...invite, firstName: e.target.value })} /><Input label="Last name" required value={invite.lastName} onChange={(e) => setInvite({ ...invite, lastName: e.target.value })} />{inviteMessage && <p className="text-sm text-success md:col-span-2" role="status">{inviteMessage}</p>}<div className="md:col-span-2"><Button disabled={inviting || !user}>{inviting ? "Sending…" : "Send invitation"}</Button></div></form>
    </main>
  </div>;
}
