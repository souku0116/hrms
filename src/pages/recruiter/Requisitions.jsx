import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/routes/routeConstants";
import Button from "@/components/ui/Button";
import { listRequisitions } from "@/services/requisitionService";

export default function Requisitions() {
  const { profile, role } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isAdmin = role === "admin";
  const load = useCallback(async () => {
    if (!profile?.organization_id) { setLoading(false); return; }
    setLoading(true);
    const { data, error: queryError } = await listRequisitions(profile.organization_id);
    setRows(data || []); setError(queryError?.message || ""); setLoading(false);
  }, [profile?.organization_id]);
  useEffect(() => { load(); }, [load]);

  return <main className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-bold text-textPrimary">Requisitions</h1><p className="mt-1 text-textSecondary">Create and track open hiring requests.</p></div><Button href={ROUTES.REQUISITION_NEW}>New requisition</Button></div>
    {isAdmin && <section className="rounded-xl border border-border bg-surface p-5"><h2 className="font-semibold">Approval queue</h2><p className="mt-1 text-sm text-textSecondary">Pending requests appear below. Open one to approve or reject it.</p></section>}
    {error && <p role="alert" className="rounded-md bg-error/10 p-3 text-sm text-error">{error}</p>}
    <section className="overflow-x-auto rounded-xl border border-border bg-background">
      <table className="w-full text-left text-sm"><thead className="bg-surface text-textSecondary"><tr><th className="p-4">ID</th><th className="p-4">Position</th><th className="p-4">Department</th><th className="p-4">Location</th><th className="p-4">Openings</th><th className="p-4">Status</th></tr></thead>
        <tbody className="divide-y divide-border">{loading ? <tr><td colSpan="6" className="p-6" role="status">Loading requisitions…</td></tr> : rows.length === 0 ? <tr><td colSpan="6" className="p-6 text-textSecondary">No requisitions yet. Create a requisition to start a hiring request.</td></tr> : rows.map((row) => <tr key={row.id}><td className="p-4 font-mono text-xs">{row.requisition_code}</td><td className="p-4"><Link className="font-medium text-primary hover:underline" to={ROUTES.REQUISITION_DETAIL.replace(":id", row.id)}>{row.title}</Link></td><td className="p-4">{row.departments?.name || "—"}</td><td className="p-4">{row.locations?.name || "—"}</td><td className="p-4">{row.openings}</td><td className="p-4"><span className="rounded-full bg-surface px-2 py-1 capitalize">{row.status.replaceAll("_", " ")}</span></td></tr>)}</tbody>
      </table>
    </section>
    <button className="text-sm text-primary hover:underline" onClick={load}>Refresh list</button>
  </main>;
}
