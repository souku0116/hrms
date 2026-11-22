import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/supabaseClient";
import { ROUTES } from "@/routes/routeConstants";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ pending: 0, members: 0, requisitions: 0 });
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    if (!profile?.organization_id) return;
    const [pending, members, reqs] = await Promise.all([
      supabase.from("requisitions").select("id", { count: "exact", head: true }).eq("organization_id", profile.organization_id).eq("status", "pending_approval"),
      supabase.from("organization_memberships").select("id", { count: "exact", head: true }).eq("organization_id", profile.organization_id).eq("status", "active"),
      supabase.from("requisitions").select("id", { count: "exact", head: true }).eq("organization_id", profile.organization_id),
    ]);
    setStats({ pending: pending.count || 0, members: members.count || 0, requisitions: reqs.count || 0 });
    setError(pending.error?.message || members.error?.message || reqs.error?.message || "");
  }, [profile?.organization_id]);
  useEffect(() => { load(); }, [load]);
  const cards = [
    { label: "Pending approvals", value: stats.pending, to: ROUTES.REQUISITIONS },
    { label: "Team members", value: stats.members, to: ROUTES.ADMIN_MEMBERS },
    { label: "Requisitions", value: stats.requisitions, to: ROUTES.REQUISITIONS },
  ];
  return <main className="mx-auto max-w-7xl space-y-7 p-6 md:p-8">
    <div><h1 className="text-3xl font-bold">Organization overview</h1><p className="mt-1 text-textSecondary">{profile?.organization?.name || "Manage your hiring workspace."}</p></div>
    {error && <p role="alert" className="text-sm text-error">{error}</p>}
    <div className="grid gap-4 md:grid-cols-3">{cards.map((card) => <Link className="rounded-xl border border-border bg-background p-6 hover:border-primary" key={card.label} to={card.to}><p className="text-sm text-textSecondary">{card.label}</p><p className="mt-3 text-3xl font-bold">{card.value}</p></Link>)}</div>
    <section className="grid gap-4 sm:grid-cols-2"><Link className="rounded-xl bg-primary p-5 font-medium text-background" to={ROUTES.ADMIN_DEPARTMENTS}>Set up departments</Link><Link className="rounded-xl bg-primary p-5 font-medium text-background" to={ROUTES.ADMIN_LOCATIONS}>Set up locations</Link></section>
    <button className="text-sm text-primary hover:underline" onClick={load}>Refresh overview</button>
  </main>;
}
