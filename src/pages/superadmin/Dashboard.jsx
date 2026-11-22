import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/supabaseClient";
import { ROUTES } from "@/routes/routeConstants";

export default function SuperadminDashboard() {
  const { user, profile, signOut } = useAuth();
  const [stats, setStats] = useState({ organizations: 0, members: 0, requisitions: 0 });
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([
      supabase.from("organizations").select("id", { count: "exact", head: true }),
      supabase.from("organization_memberships").select("id", { count: "exact", head: true }),
    supabase.from("audit_events").select("id", { count: "exact", head: true }),
    ]).then(([orgs, members, reqs]) => {
    setStats({ organizations: orgs.count || 0, members: members.count || 0, auditEvents: reqs.count || 0 });
      setError(orgs.error?.message || members.error?.message || reqs.error?.message || "");
    });
  }, []);
  const cards = [
    { label: "Organizations", value: stats.organizations, to: ROUTES.SUPERADMIN_ORGANIZATIONS },
    { label: "Organization members", value: stats.members, to: ROUTES.SUPERADMIN_USERS },
    { label: "Audit events", value: stats.auditEvents, to: ROUTES.SUPERADMIN_AUDIT_LOGS },
  ];
  return <main className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold text-primary">WorkSync platform</p><h1 className="mt-2 text-3xl font-bold">Superadmin overview</h1><p className="mt-1 text-textSecondary">Signed in as {profile?.email || user?.email}</p></div><button className="rounded-md border border-border px-4 py-2 text-sm hover:bg-surface" onClick={signOut}>Sign out</button></div>
    {error && <p role="alert" className="text-sm text-error">{error}</p>}
    <div className="grid gap-4 md:grid-cols-3">{cards.map((card) => <Link className="rounded-xl border border-border bg-background p-6 hover:border-primary" key={card.label} to={card.to}><p className="text-sm text-textSecondary">{card.label}</p><p className="mt-3 text-3xl font-bold">{card.value}</p><p className="mt-3 text-sm text-primary">Open section →</p></Link>)}</div>
    <section className="rounded-xl border border-border bg-surface p-6"><h2 className="text-lg font-semibold">Platform setup</h2><p className="mt-2 text-sm text-textSecondary">Create an organization and invite its administrator to start onboarding a hiring team.</p><Link className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-background" to={ROUTES.SUPERADMIN_ORGANIZATIONS}>Manage organizations</Link></section>
  </main>;
}
