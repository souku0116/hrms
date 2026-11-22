import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { PageHeader } from "@/components/superadmin";

export default function AuditLogs() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    supabase.from("audit_events").select("id,action,entity_type,entity_id,details,created_at,profiles(first_name,last_name,email),organizations(name)").order("created_at", { ascending: false }).limit(100)
      .then(({ data, error: queryError }) => { setEvents(data || []); setError(queryError?.message || ""); setLoading(false); });
  }, []);
  return <div><PageHeader title="Audit logs" subtitle="Recent organization, membership, and requisition changes." /><main className="mx-auto max-w-7xl p-6 md:p-8">
    {error && <p className="mb-4 text-sm text-error" role="alert">{error}</p>}
    <div className="overflow-x-auto rounded-xl border border-border bg-background"><table className="w-full text-left text-sm"><thead className="bg-surface"><tr><th className="p-4">When</th><th className="p-4">Actor</th><th className="p-4">Organization</th><th className="p-4">Action</th><th className="p-4">Record</th><th className="p-4">Details</th></tr></thead><tbody className="divide-y divide-border">{loading ? <tr><td className="p-5" colSpan="6">Loading audit events…</td></tr> : events.length === 0 ? <tr><td className="p-5 text-textSecondary" colSpan="6">No audit events recorded yet.</td></tr> : events.map((event) => <tr key={event.id}><td className="whitespace-nowrap p-4">{new Date(event.created_at).toLocaleString()}</td><td className="p-4">{[event.profiles?.first_name, event.profiles?.last_name].filter(Boolean).join(" ") || event.profiles?.email || "System"}</td><td className="p-4">{event.organizations?.name || "Platform"}</td><td className="p-4 capitalize">{event.action} · {event.entity_type}</td><td className="max-w-48 truncate p-4 font-mono text-xs">{event.entity_id}</td><td className="p-4 text-textSecondary">{event.details?.old_status ? `${event.details.old_status} → ${event.details.new_status}` : event.details?.new_status || "—"}</td></tr>)}</tbody></table></div>
  </main></div>;
}
