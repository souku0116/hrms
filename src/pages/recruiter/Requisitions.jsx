import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Clock,
  MapPin,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/routes/routeConstants";
import { listRequisitions } from "@/services/requisitionService";

const STATUS_COLORS = {
  approved: { bg: "#10b98115", text: "#059669", border: "#10b98130" },
  pending_approval: { bg: "#f59e0b15", text: "#d97706", border: "#f59e0b30" },
  draft: { bg: "#3b82f615", text: "#2563eb", border: "#3b82f630" },
  rejected: { bg: "#ef444415", text: "#dc2626", border: "#ef444430" },
  closed: { bg: "#64748b15", text: "#475569", border: "#64748b30" },
  filled: { bg: "#8b5cf615", text: "#7c3aed", border: "#8b5cf630" },
};

export default function Requisitions() {
  const { profile, role } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const isAdmin = role === "admin";

  const load = useCallback(
    async (isSilent = false) => {
      if (!profile?.organization_id) {
        setLoading(false);
        return;
      }
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const { data, error: queryError } = await listRequisitions(profile.organization_id);
      setRows(data || []);
      setError(queryError?.message || "");
      setLoading(false);
      setRefreshing(false);
    },
    [profile?.organization_id]
  );

  useEffect(() => {
    load();
  }, [load]);

  // Unique departments for filter dropdown
  const departments = useMemo(() => {
    const set = new Set();
    rows.forEach((r) => {
      if (r.departments?.name) set.add(r.departments.name);
    });
    return Array.from(set).sort();
  }, [rows]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = rows.length;
    const approved = rows.filter((r) => ["approved", "open"].includes(r.status));
    const pending = rows.filter((r) => r.status === "pending_approval");
    const drafts = rows.filter((r) => r.status === "draft");
    const totalOpenings = approved.reduce((sum, r) => sum + (Number(r.openings) || 0), 0);

    return { total, approved: approved.length, pending: pending.length, drafts: drafts.length, totalOpenings };
  }, [rows]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (statusTab !== "all" && row.status !== statusTab) return false;
      if (departmentFilter !== "all" && (row.departments?.name || "Unassigned") !== departmentFilter) {
        return false;
      }
      if (!q) return true;
      const searchable = [
        row.title,
        row.requisition_code,
        row.departments?.name,
        row.locations?.name,
      ].filter(Boolean).join(" ").toLowerCase();
      return searchable.includes(q);
    });
  }, [rows, search, statusTab, departmentFilter]);

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link
              to={isAdmin ? ROUTES.ADMIN : ROUTES.RECRUITER}
              className="text-xs font-medium text-textSecondary hover:text-primary transition-colors"
            >
              ← Overview
            </Link>
            <span className="text-xs text-textSecondary">/</span>
            <span className="text-xs font-semibold text-primary">Requisitions</span>
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-textPrimary">
            Requisitions Directory
          </h1>
          <p className="mt-1 text-sm text-textSecondary">
            Create, manage, and track hiring requisitions across your organization.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium text-textPrimary shadow-xs hover:bg-surface transition-all disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-primary" : "text-textSecondary"}`} />
            <span>Refresh</span>
          </button>

          <Button href={ROUTES.REQUISITION_NEW} className="flex items-center gap-1.5 text-xs font-semibold">
            <Plus className="h-4 w-4" />
            <span>New Requisition</span>
          </Button>
        </div>
      </div>

      {/* Admin Approval Notice Banner */}
      {isAdmin && metrics.pending > 0 && (
        <section className="flex items-center justify-between rounded-xl border border-amber-300 bg-amber-50/80 p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-950">
                {metrics.pending} Requisition(s) Pending Approval
              </h2>
              <p className="text-xs text-amber-800">
                Review and approve or reject requisitions in the queue to authorize hiring.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusTab("pending_approval")}
            className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 transition-colors"
          >
            Filter Pending
          </button>
        </section>
      )}

      {/* Top Metrics Row */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        <div className="rounded-xl border border-border bg-background p-4 shadow-xs">
          <p className="text-xs font-medium text-textSecondary">Total Requisitions</p>
          <p className="mt-2 text-2xl font-bold text-textPrimary">{metrics.total}</p>
        </div>

        <div className="rounded-xl border border-border bg-background p-4 shadow-xs">
          <p className="text-xs font-medium text-emerald-600">Approved / Open</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700">{metrics.approved}</p>
        </div>

        <div className="rounded-xl border border-border bg-background p-4 shadow-xs">
          <p className="text-xs font-medium text-amber-600">Pending Review</p>
          <p className="mt-2 text-2xl font-bold text-amber-700">{metrics.pending}</p>
        </div>

        <div className="rounded-xl border border-border bg-background p-4 shadow-xs">
          <p className="text-xs font-medium text-blue-600">Drafts</p>
          <p className="mt-2 text-2xl font-bold text-blue-700">{metrics.drafts}</p>
        </div>

        <div className="col-span-2 rounded-xl border border-border bg-background p-4 shadow-xs sm:col-span-4 lg:col-span-1">
          <p className="text-xs font-medium text-textSecondary">Total Openings</p>
          <p className="mt-2 text-2xl font-bold text-textPrimary">{metrics.totalOpenings}</p>
        </div>
      </section>

      {/* Error Notice */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800" role="alert">
          {error}
        </div>
      )}

      {/* Controls: Search, Department Filter, and Status Tabs */}
      <section className="space-y-3 rounded-2xl border border-border bg-background p-4 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-textSecondary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, requisition code, or location…"
              className="w-full rounded-xl border border-border bg-surface/40 py-2 pl-9 pr-3 text-xs text-textPrimary placeholder:text-textSecondary focus:border-primary focus:outline-none"
            />
          </div>

          {departments.length > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor="dept-filter" className="text-xs font-medium text-textSecondary whitespace-nowrap">
                Department:
              </label>
              <select
                id="dept-filter"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-textPrimary focus:border-primary focus:outline-none"
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
          {[
            { id: "all", label: "All" },
            { id: "approved", label: "Approved" },
            { id: "pending_approval", label: "Pending Approval" },
            { id: "draft", label: "Draft" },
            { id: "rejected", label: "Rejected" },
            { id: "closed", label: "Closed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusTab(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                statusTab === tab.id
                  ? "bg-primary text-white shadow-xs"
                  : "text-textSecondary hover:bg-surface hover:text-textPrimary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Table */}
      <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-surface text-textSecondary font-semibold">
              <tr>
                <th className="p-4">Code</th>
                <th className="p-4">Position</th>
                <th className="p-4">Department</th>
                <th className="p-4">Location</th>
                <th className="p-4 text-center">Openings</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-textSecondary" role="status">
                    Loading requisitions…
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-12 text-center text-textSecondary">
                    <Briefcase className="mx-auto h-8 w-8 text-textSecondary/40" />
                    <p className="mt-2 text-sm font-semibold text-textPrimary">No requisitions found</p>
                    <p className="mt-1 text-xs text-textSecondary">
                      {search || statusTab !== "all" || departmentFilter !== "all"
                        ? "Try adjusting your filters or search query."
                        : "Create a requisition to start hiring for a new role."}
                    </p>
                    <div className="mt-4">
                      <Button href={ROUTES.REQUISITION_NEW} size="sm">
                        Create Requisition
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => {
                  const style = STATUS_COLORS[row.status] || {
                    bg: "#f1f5f9",
                    text: "#475569",
                    border: "#cbd5e1",
                  };

                  return (
                    <tr key={row.id} className="hover:bg-surface/50 transition-colors">
                      <td className="p-4 font-mono text-xs font-semibold text-textSecondary">
                        {row.requisition_code}
                      </td>
                      <td className="p-4">
                        <Link
                          className="font-semibold text-textPrimary hover:text-primary hover:underline line-clamp-1"
                          to={ROUTES.REQUISITION_DETAIL.replace(":id", row.id)}
                        >
                          {row.title}
                        </Link>
                      </td>
                      <td className="p-4 text-textSecondary">
                        {row.departments?.name ? (
                          <span className="rounded-md bg-surface px-2 py-0.5 text-textPrimary font-medium">
                            {row.departments.name}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="p-4 text-textSecondary">
                        {row.locations?.name ? (
                          <span className="inline-flex items-center gap-1 text-textSecondary">
                            <MapPin className="h-3 w-3 text-textSecondary/60" />
                            {row.locations.name}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-surface px-2 text-xs font-bold text-textPrimary">
                          {row.openings}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize border"
                          style={{
                            backgroundColor: style.bg,
                            color: style.text,
                            borderColor: style.border,
                          }}
                        >
                          {row.status.replaceAll("_", " ")}
                        </span>
                      </td>
                      <td className="p-4 text-textSecondary">
                        {row.created_at ? new Date(row.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            className="font-medium text-primary hover:underline"
                            to={ROUTES.REQUISITION_DETAIL.replace(":id", row.id)}
                          >
                            View
                          </Link>
                          {["draft", "rejected"].includes(row.status) && (
                            <Link
                              className="text-textSecondary hover:text-textPrimary hover:underline"
                              to={ROUTES.REQUISITION_EDIT.replace(":id", row.id)}
                            >
                              Edit
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
