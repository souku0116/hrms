import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/supabaseClient";
import { ROUTES } from "@/routes/routeConstants";

const emptyForm = { name: "", adminEmail: "", firstName: "", lastName: "" };

export default function Organizations() {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [memberCount, setMemberCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadOrganizations = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError("");

    try {
      const [orgsRes, membersRes] = await Promise.all([
        supabase
          .from("organizations")
          .select("id,name,slug,status,created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("organization_memberships")
          .select("id", { count: "exact", head: true }),
      ]);

      if (orgsRes.error) throw orgsRes.error;
      setOrganizations(orgsRes.data || []);
      setMemberCount(membersRes.count || 0);
    } catch (err) {
      setError(err.message || "Failed to load organizations.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  async function createOrganization(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    const slug = form.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const { data: organization, error: insertError } = await supabase
      .from("organizations")
      .insert({ name: form.name.trim(), slug })
      .select("id")
      .single();

    if (insertError) {
      setError(insertError.message);
      setBusy(false);
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    try {
      const inviteResponse = await fetch("/api/invite-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData.session?.access_token || ""}`,
        },
        body: JSON.stringify({
          organizationId: organization.id,
          email: form.adminEmail.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          role: "admin",
        }),
      });

      const isJson = inviteResponse.headers.get("content-type")?.includes("application/json");
      const inviteResult = isJson ? await inviteResponse.json() : {};

      if (!inviteResponse.ok || !isJson) {
        setError(
          `Organization created. Admin invitation was not confirmed: ${
            inviteResult.error || "Ensure the Vercel API function is running."
          }`
        );
      } else {
        setNotice(
          `Organization created. ${inviteResult.message || "Administrator invitation sent."}`
        );
      }
    } catch {
      setError(
        "Organization created, but the admin invitation service could not be reached. Retry from the organization detail page."
      );
    }

    setBusy(false);
    setIsOpen(false);
    setForm(emptyForm);
    await loadOrganizations(true);
  }

  async function toggleStatus(org) {
    const nextStatus = org.status === "active" ? "suspended" : "active";
    const { error: updateError } = await supabase
      .from("organizations")
      .update({ status: nextStatus })
      .eq("id", org.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      await loadOrganizations(true);
    }
  }

  // Derived metrics
  const stats = useMemo(() => {
    const total = organizations.length;
    const active = organizations.filter((o) => o.status === "active").length;
    const suspended = organizations.filter((o) => o.status === "suspended").length;
    return { total, active, suspended, memberCount };
  }, [organizations, memberCount]);

  // Filtered organizations
  const filteredOrgs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return organizations.filter((org) => {
      if (statusFilter !== "all" && org.status !== statusFilter) return false;
      if (!q) return true;
      return (
        org.name?.toLowerCase().includes(q) ||
        org.slug?.toLowerCase().includes(q)
      );
    });
  }, [organizations, search, statusFilter]);

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-textSecondary mb-1">
            <span>WorkSync Platform</span>
            <span>/</span>
            <span className="font-semibold text-primary">Organizations</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-textPrimary">
            Organizations
          </h1>
          <p className="mt-1 text-sm text-textSecondary">
            Manage customer workspaces, administer tenant accounts, and oversee status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadOrganizations(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium text-textPrimary shadow-xs hover:bg-surface transition-all disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                refreshing ? "animate-spin text-primary" : "text-textSecondary"
              }`}
            />
            <span>Refresh</span>
          </button>

          <Button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold"
          >
            <Plus className="h-4 w-4" />
            <span>Add Organization</span>
          </Button>
        </div>
      </div>

      {/* Alert / Notice Messages */}
      {notice && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{notice}</span>
          </div>
          <button
            onClick={() => setNotice("")}
            className="text-xs text-emerald-600 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

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

      {/* KPI Cards Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-textSecondary">Total Organizations</p>
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-textPrimary">{stats.total}</p>
          <p className="mt-1 text-xs text-textSecondary">Customer workspaces</p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-emerald-600">Active Workspaces</p>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-emerald-700">{stats.active}</p>
          <p className="mt-1 text-xs text-textSecondary">Operating normally</p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-amber-600">Suspended</p>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-amber-700">{stats.suspended}</p>
          <p className="mt-1 text-xs text-textSecondary">Access paused</p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-purple-600">Total Members</p>
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-purple-700">{stats.memberCount}</p>
          <p className="mt-1 text-xs text-textSecondary">Across all workspaces</p>
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
            placeholder="Search organizations by name or slug…"
            className="w-full rounded-xl border border-border bg-surface/40 py-2 pl-9 pr-3 text-xs text-textPrimary placeholder:text-textSecondary focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {[
            { id: "all", label: "All" },
            { id: "active", label: "Active" },
            { id: "suspended", label: "Suspended" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === tab.id
                  ? "bg-primary text-white shadow-xs"
                  : "text-textSecondary hover:bg-surface hover:text-textPrimary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Organizations Table */}
      <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-surface text-textSecondary font-semibold">
              <tr>
                <th className="p-4">Organization</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-textSecondary">
                    Loading organizations…
                  </td>
                </tr>
              ) : filteredOrgs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-textSecondary">
                    <Building2 className="mx-auto h-8 w-8 text-textSecondary/40" />
                    <p className="mt-2 text-sm font-semibold text-textPrimary">
                      No organizations found
                    </p>
                    <p className="mt-1 text-xs text-textSecondary">
                      {search || statusFilter !== "all"
                        ? "Try adjusting your search query or filter."
                        : "Create the first customer organization to onboard a new team."}
                    </p>
                    <div className="mt-4">
                      <Button onClick={() => setIsOpen(true)} size="sm">
                        Add Organization
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrgs.map((org) => {
                  const initial = org.name?.[0]?.toUpperCase() || "O";
                  const isActive = org.status === "active";

                  return (
                    <tr key={org.id} className="hover:bg-surface/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                            {initial}
                          </div>
                          <div>
                            <Link
                              to={ROUTES.SUPERADMIN_ORGANIZATION_DETAIL.replace(":id", org.id)}
                              className="font-semibold text-textPrimary hover:text-primary hover:underline text-sm"
                            >
                              {org.name}
                            </Link>
                            <p className="text-[11px] text-textSecondary font-mono mt-0.5">
                              ID: {org.id.slice(0, 8)}…
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="rounded-md bg-surface px-2 py-1 font-mono text-[11px] text-textSecondary">
                          {org.slug}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize border ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          {org.status}
                        </span>
                      </td>
                      <td className="p-4 text-textSecondary">
                        {new Date(org.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={ROUTES.SUPERADMIN_ORGANIZATION_DETAIL.replace(":id", org.id)}
                            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                          >
                            <span>Manage</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                          <span className="text-border">|</span>
                          <button
                            onClick={() => toggleStatus(org)}
                            className={`font-medium hover:underline text-xs ${
                              isActive
                                ? "text-amber-600 hover:text-amber-700"
                                : "text-emerald-600 hover:text-emerald-700"
                            }`}
                          >
                            {isActive ? "Suspend" : "Activate"}
                          </button>
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

      {/* Add Organization Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title="Add Customer Organization"
      >
        <form className="space-y-4 text-xs" onSubmit={createOrganization}>
          <Input
            label="Organization Name"
            placeholder="e.g. Acme Corporation"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Initial Administrator Email"
            type="email"
            placeholder="admin@company.com"
            required
            value={form.adminEmail}
            onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Admin First Name"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            <Input
              label="Admin Last Name"
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>
          <div className="rounded-xl border border-border bg-surface/50 p-3 text-textSecondary">
            <p className="font-semibold text-textPrimary text-[11px]">Invitation Notice</p>
            <p className="mt-0.5 text-[11px]">
              The initial administrator will receive a secure Supabase invitation email to complete their password setup.
            </p>
          </div>
          <div className="flex gap-2.5 pt-2">
            <Button type="submit" disabled={busy || !user}>
              {busy ? "Creating Workspace…" : "Create & Send Invitation"}
            </Button>
            <Button onClick={handleCloseModal} variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
