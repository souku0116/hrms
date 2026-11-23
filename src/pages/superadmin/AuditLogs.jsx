import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Building2,
  Clock,
  Download,
  FileText,
  RefreshCw,
  Search,
  Shield,
  User,
} from "lucide-react";
import supabase from "@/lib/supabaseClient";

export default function AuditLogs() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");

  const loadAuditEvents = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError("");

    try {
      const { data, error: queryError } = await supabase
        .from("audit_events")
        .select(
          "id,action,entity_type,entity_id,details,created_at,profiles(first_name,last_name,email),organizations(name)"
        )
        .order("created_at", { ascending: false })
        .limit(150);

      if (queryError) throw queryError;
      setEvents(data || []);
    } catch (err) {
      setError(err.message || "Failed to load audit events.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAuditEvents();
  }, [loadAuditEvents]);

  // Derived metrics
  const stats = useMemo(() => {
    const total = events.length;
    const reqEvents = events.filter((e) => e.entity_type === "requisition").length;
    const memberEvents = events.filter((e) =>
      ["membership", "user", "member"].includes(e.entity_type)
    ).length;
    const orgEvents = events.filter((e) => e.entity_type === "organization").length;

    return { total, reqEvents, memberEvents, orgEvents };
  }, [events]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter((event) => {
      if (entityFilter !== "all" && event.entity_type !== entityFilter) return false;
      if (!q) return true;

      const actorName = [event.profiles?.first_name, event.profiles?.last_name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const email = event.profiles?.email?.toLowerCase() || "";
      const org = event.organizations?.name?.toLowerCase() || "";
      const action = event.action?.toLowerCase() || "";
      const entityId = event.entity_id?.toLowerCase() || "";

      return (
        actorName.includes(q) ||
        email.includes(q) ||
        org.includes(q) ||
        action.includes(q) ||
        entityId.includes(q)
      );
    });
  }, [events, search, entityFilter]);

  function exportCSV() {
    if (filteredEvents.length === 0) return;
    const headers = ["Timestamp", "Actor", "Actor Email", "Organization", "Action", "Entity Type", "Entity ID", "Details"];
    const rows = filteredEvents.map((e) => [
      new Date(e.created_at).toISOString(),
      [e.profiles?.first_name, e.profiles?.last_name].filter(Boolean).join(" ") || "System",
      e.profiles?.email || "",
      e.organizations?.name || "Platform",
      e.action,
      e.entity_type,
      e.entity_id,
      JSON.stringify(e.details || {}),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `worksync_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-textSecondary mb-1">
            <span>WorkSync Platform</span>
            <span>/</span>
            <span className="font-semibold text-primary">Audit Logs</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-textPrimary">
            Platform Audit Logs
          </h1>
          <p className="mt-1 text-sm text-textSecondary">
            Tamper-evident chronological audit trail of state changes, approvals, and security events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadAuditEvents(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium text-textPrimary shadow-xs hover:bg-surface transition-all disabled:opacity-50"
            title="Refresh logs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                refreshing ? "animate-spin text-primary" : "text-textSecondary"
              }`}
            />
            <span>Refresh</span>
          </button>

          <button
            onClick={exportCSV}
            disabled={filteredEvents.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-textPrimary shadow-xs hover:bg-surface transition-all disabled:opacity-50"
          >
            <Download className="h-4 w-4 text-primary" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError("")}
            className="text-xs text-rose-600 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-textSecondary">Total Events</p>
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-textPrimary">{stats.total}</p>
          <p className="mt-1 text-xs text-textSecondary">Recent activity window</p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-emerald-600">Requisitions</p>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-emerald-700">{stats.reqEvents}</p>
          <p className="mt-1 text-xs text-textSecondary">Creation & review decisions</p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-purple-600">Memberships</p>
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
              <User className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-purple-700">{stats.memberEvents}</p>
          <p className="mt-1 text-xs text-textSecondary">Role & access changes</p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-amber-600">Organizations</p>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-amber-700">{stats.orgEvents}</p>
          <p className="mt-1 text-xs text-textSecondary">Tenant lifecycle events</p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-background p-4 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-textSecondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by actor, action, organization, or record ID…"
            className="w-full rounded-xl border border-border bg-surface/40 py-2 pl-9 pr-3 text-xs text-textPrimary placeholder:text-textSecondary focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {[
            { id: "all", label: "All Entities" },
            { id: "requisition", label: "Requisitions" },
            { id: "membership", label: "Memberships" },
            { id: "organization", label: "Organizations" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setEntityFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                entityFilter === tab.id
                  ? "bg-primary text-white shadow-xs"
                  : "text-textSecondary hover:bg-surface hover:text-textPrimary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Audit Logs Table */}
      <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-surface text-textSecondary font-semibold">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Organization</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entity ID</th>
                <th className="p-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-textSecondary">
                    Loading audit events…
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-textSecondary">
                    <Shield className="mx-auto h-8 w-8 text-textSecondary/40" />
                    <p className="mt-2 text-sm font-semibold text-textPrimary">
                      No audit events found
                    </p>
                    <p className="mt-1 text-xs text-textSecondary">
                      {search || entityFilter !== "all"
                        ? "Try clearing your filters or search term."
                        : "Security and workflow actions will be logged automatically."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => {
                  const actorName = [event.profiles?.first_name, event.profiles?.last_name]
                    .filter(Boolean)
                    .join(" ");
                  const initial =
                    actorName?.[0]?.toUpperCase() ||
                    event.profiles?.email?.[0]?.toUpperCase() ||
                    "S";

                  const details = event.details || {};
                  const isTransition = details.old_status && details.new_status;

                  return (
                    <tr key={event.id} className="hover:bg-surface/50 transition-colors">
                      <td className="p-4 whitespace-nowrap text-textSecondary font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-textSecondary/60" />
                          <span>{new Date(event.created_at).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                            {initial}
                          </div>
                          <div>
                            <p className="font-semibold text-textPrimary text-xs">
                              {actorName || event.profiles?.email || "System"}
                            </p>
                            {actorName && event.profiles?.email && (
                              <p className="text-[10px] text-textSecondary">
                                {event.profiles.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="rounded-md bg-surface px-2 py-1 text-[11px] font-medium text-textPrimary">
                          {event.organizations?.name || "Platform"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary capitalize">
                          <span>{event.action}</span>
                          <span className="text-primary/60">·</span>
                          <span className="font-normal text-textSecondary">
                            {event.entity_type}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-textSecondary">
                        {event.entity_id ? (
                          <span
                            className="rounded bg-surface px-1.5 py-0.5"
                            title={event.entity_id}
                          >
                            {event.entity_id.length > 12
                              ? `${event.entity_id.slice(0, 10)}…`
                              : event.entity_id}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="p-4 text-textSecondary">
                        {isTransition ? (
                          <div className="flex items-center gap-1.5 text-xs font-medium">
                            <span className="rounded-md bg-amber-50 px-2 py-0.5 text-amber-700 capitalize border border-amber-200">
                              {details.old_status.replaceAll("_", " ")}
                            </span>
                            <ArrowRight className="h-3 w-3 text-textSecondary" />
                            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-700 capitalize border border-emerald-200">
                              {details.new_status.replaceAll("_", " ")}
                            </span>
                          </div>
                        ) : details.comment ? (
                          <p className="text-xs italic line-clamp-1">
                            &ldquo;{details.comment}&rdquo;
                          </p>
                        ) : details.new_status ? (
                          <span className="rounded-md bg-surface px-2 py-0.5 text-xs capitalize text-textPrimary">
                            Status: {details.new_status.replaceAll("_", " ")}
                          </span>
                        ) : (
                          <span className="text-xs text-textSecondary/60">
                            No additional details
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
