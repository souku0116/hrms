import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "@/lib/supabaseClient";
import { PageHeader } from "@/components/superadmin";
import { ROUTES } from "@/routes/routeConstants";

export default function Users() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    supabase.from("organization_memberships").select("id,organization_id,role,status,created_at,profiles(first_name,last_name,email),organizations(name)").order("created_at", { ascending: false })
      .then(({ data, error: queryError }) => { setMembers(data || []); setError(queryError?.message || ""); setLoading(false); });
  }, []);
  async function toggle(member) {
    const { error: updateError } = await supabase.from("organization_memberships").update({ status: member.status === "active" ? "suspended" : "active" }).eq("id", member.id);
    if (updateError) setError(updateError.message);
    else setMembers((current) => current.map((row) => row.id === member.id ? { ...row, status: member.status === "active" ? "suspended" : "active" } : row));
  }
  return <div><PageHeader title="Organization users" subtitle="Memberships and roles across WorkSync organizations." actions={<Link className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-background" to={ROUTES.SUPERADMIN_ORGANIZATIONS}>Manage organizations</Link>} />
    <main className="mx-auto max-w-7xl space-y-4 p-6 md:p-8">{error && <p role="alert" className="text-sm text-error">{error}</p>}<div className="overflow-x-auto rounded-xl border border-border bg-background"><table className="w-full text-left text-sm"><thead className="bg-surface"><tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Organization</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead><tbody className="divide-y divide-border">{loading ? <tr><td className="p-5" colSpan="6">Loading users…</td></tr> : members.length === 0 ? <tr><td className="p-5 text-textSecondary" colSpan="6">No organization memberships found.</td></tr> : members.map((member) => <tr key={member.id}><td className="p-4">{[member.profiles?.first_name, member.profiles?.last_name].filter(Boolean).join(" ") || "—"}</td><td className="p-4">{member.profiles?.email || "—"}</td><td className="p-4"><Link className="text-primary hover:underline" to={ROUTES.SUPERADMIN_ORGANIZATION_DETAIL.replace(":id", member.organization_id)}>{member.organizations?.name || "Organization"}</Link></td><td className="p-4 capitalize">{member.role.replaceAll("_", " ")}</td><td className="p-4 capitalize">{member.status}</td><td className="p-4"><button className="text-primary hover:underline" onClick={() => toggle(member)}>{member.status === "active" ? "Suspend" : "Activate"}</button></td></tr>)}</tbody></table></div></main>
  </div>;
}
