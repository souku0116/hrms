import { useCallback, useEffect, useMemo, useState } from "react";
import { Building2, Mail, RefreshCw, Search, ShieldCheck, UserRound, Users as UsersIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

const emptyForm = {
  userId: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  platformRole: "user",
  organizationId: "",
  membershipRole: "employee",
  status: "active",
};

function fullName(user) {
  return [user.firstName, user.lastName].filter(Boolean).join(" ") || "Name not provided";
}

function dateLabel(value) {
  return value ? new Date(value).toLocaleDateString() : "Never";
}

async function readApiResponse(response) {
  const body = await response.text();
  try {
    return JSON.parse(body);
  } catch {
    throw new Error("The user management API did not return JSON. Restart the local dev server or redeploy the Vercel app so its API function is active.");
  }
}

function effectiveRole(user) {
  if (user.profileRole === "superadmin") return "Superadmin";
  const membership = user.memberships.find((row) => row.organization_id === user.organizationId) || user.memberships[0];
  if (membership?.role === "employee") return "Employee";
  return membership?.role?.replaceAll("_", " ") || "Employee";
}

export default function Users() {
  const { session, user: signedInUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const loadUsers = useCallback(async (silent = false) => {
    if (!session?.access_token) return;
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const result = await fetch("/api/superadmin-users", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const payload = await readApiResponse(result);
      if (!result.ok) throw new Error(payload.error || "Failed to load the user directory.");
      setUsers(payload.users || []);
      setOrganizations(payload.organizations || []);
    } catch (loadError) {
      setError(loadError.message || "Failed to load the user directory.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session?.access_token]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((record) => {
      if (statusFilter !== "all" && record.status !== statusFilter) return false;
      const role = effectiveRole(record).toLowerCase();
      if (roleFilter !== "all" && role !== roleFilter) return false;
      if (!query) return true;
      const organizationNames = record.memberships.map((item) => item.organization?.name || "").join(" ");
      return [fullName(record), record.email, record.phone, organizationNames, role].join(" ").toLowerCase().includes(query);
    });
  }, [users, search, roleFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((record) => record.status === "active").length,
    unconfirmed: users.filter((record) => !record.emailConfirmedAt).length,
    organizations: organizations.length,
  }), [users, organizations]);

  function openEditor(record) {
    const selectedOrganizationId = record.organizationId || "";
    const selectedMembership = record.memberships.find((item) => item.organization_id === selectedOrganizationId) || record.memberships[0];
    setForm({
      userId: record.id,
      firstName: record.firstName || "",
      lastName: record.lastName || "",
      phone: record.phone || "",
      email: record.email || "",
      platformRole: record.profileRole === "superadmin" ? "superadmin" : "user",
      organizationId: record.profileRole === "superadmin" ? "" : selectedOrganizationId,
      membershipRole: selectedMembership?.role || "employee",
      status: record.status || "active",
    });
    setError("");
    setNotice("");
    setIsOpen(true);
  }

  async function saveUser(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const result = await fetch("/api/superadmin-users", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session?.access_token || ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          organizationId: form.platformRole === "superadmin" ? null : form.organizationId || null,
        }),
      });
      const payload = await readApiResponse(result);
      if (!result.ok) throw new Error(payload.error || "Failed to update user details.");
      setIsOpen(false);
      setNotice(payload.message || "User details updated.");
      await loadUsers(true);
    } catch (saveError) {
      setError(saveError.message || "Failed to update user details.");
    } finally {
      setSaving(false);
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="space-y-7 p-6 md:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">WorkSync Platform / Users</p>
          <h1 className="text-3xl font-bold tracking-tight text-textPrimary">User Directory</h1>
          <p className="mt-1 text-sm text-textSecondary">View account details and manage platform roles, organization access, and status.</p>
        </div>
        <Button onClick={() => loadUsers(true)} disabled={refreshing} variant="outline">
          <span className="inline-flex items-center gap-2"><RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />Refresh</span>
        </Button>
      </header>

      {notice && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
      {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="User statistics">
        {[
          { label: "All accounts", value: stats.total, Icon: UsersIcon },
          { label: "Active accounts", value: stats.active, Icon: UserRound },
          { label: "Email confirmation needed", value: stats.unconfirmed, Icon: Mail },
          { label: "Organizations", value: stats.organizations, Icon: Building2 },
        ].map(({ label, value, Icon }) => (
          <article key={label} className="rounded-xl border border-border bg-background p-5">
            <div className="flex items-center justify-between text-sm text-textSecondary"><span>{label}</span><Icon className="h-4 w-4" /></div>
            <p className="mt-3 text-2xl font-bold text-textPrimary">{value}</p>
          </article>
        ))}
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-textSecondary" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, phone, or organization" className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm" />
        </div>
        <select aria-label="Filter by role" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
          <option value="all">All roles</option><option value="superadmin">Superadmin</option><option value="admin">Admin</option><option value="recruiter">Recruiter</option><option value="employee">Employee</option><option value="hiring manager">Hiring manager</option><option value="interviewer">Interviewer</option>
        </select>
        <select aria-label="Filter by account status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
          <option value="all">All statuses</option><option value="active">Active</option><option value="suspended">Suspended</option><option value="inactive">Inactive</option>
        </select>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="border-b border-border bg-surface text-xs font-semibold uppercase text-textSecondary">
              <tr><th className="p-4">User</th><th className="p-4">Contact</th><th className="p-4">Organization</th><th className="p-4">Role</th><th className="p-4">Status / Email</th><th className="p-4">Created</th><th className="p-4">Last sign in</th><th className="p-4 text-right">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? <tr><td colSpan="8" className="p-10 text-center text-textSecondary">Loading users…</td></tr>
                : filteredUsers.length === 0 ? <tr><td colSpan="8" className="p-10 text-center text-textSecondary">No users match these filters.</td></tr>
                  : filteredUsers.map((record) => {
                    const organizationLabels = record.profileRole === "superadmin"
                      ? "Platform"
                      : record.memberships.map((item) => `${item.organization?.name || "Unknown organization"} (${item.role.replaceAll("_", " ")}, ${item.status})`).join(" · ") || "Unassigned";
                    return <tr key={record.id} className="align-top hover:bg-surface/40">
                      <td className="p-4"><p className="font-semibold text-textPrimary">{fullName(record)}</p><p className="mt-1 font-mono text-[11px] text-textSecondary">{record.id}</p></td>
                      <td className="p-4"><p className="text-textPrimary">{record.email || "—"}</p><p className="mt-1 text-xs text-textSecondary">{record.phone || "No phone on account"}</p></td>
                      <td className="max-w-xs p-4 text-textSecondary">{organizationLabels}</td>
                      <td className="p-4"><span className="inline-flex items-center gap-1.5 capitalize"><ShieldCheck className="h-3.5 w-3.5 text-primary" />{effectiveRole(record)}</span></td>
                      <td className="p-4"><span className={`rounded-full px-2 py-1 text-xs capitalize ${record.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{record.status}</span><p className={`mt-2 text-xs ${record.emailConfirmedAt ? "text-emerald-700" : "text-rose-700"}`}>{record.emailConfirmedAt ? `Confirmed ${dateLabel(record.emailConfirmedAt)}` : "Email unconfirmed"}</p></td>
                      <td className="p-4 text-textSecondary">{dateLabel(record.createdAt)}</td>
                      <td className="p-4 text-textSecondary">{dateLabel(record.lastSignInAt)}</td>
                      <td className="p-4 text-right"><Button size="sm" variant="outline" onClick={() => openEditor(record)}>Edit user</Button></td>
                    </tr>;
                  })}
            </tbody>
          </table>
        </div>
        {!loading && <p className="border-t border-border px-4 py-3 text-xs text-textSecondary">Showing {filteredUsers.length} of {users.length} accounts.</p>}
      </section>

      <Modal isOpen={isOpen} onClose={() => !saving && setIsOpen(false)} title="Edit user account" className="max-w-2xl">
        <form onSubmit={saveUser} className="max-h-[75vh] space-y-5 overflow-y-auto pr-1">
          <section className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-textPrimary">First name<input required maxLength="100" value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2" /></label>
            <label className="text-sm font-medium text-textPrimary">Last name<input required maxLength="100" value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2" /></label>
            <label className="text-sm font-medium text-textPrimary">Phone<input type="tel" maxLength="40" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2" /></label>
            <label className="text-sm font-medium text-textPrimary">Email<input required type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2" /><span className="mt-1 block text-xs font-normal text-textSecondary">Changing the email takes effect immediately and confirms the new address.</span></label>
          </section>

          <section className="grid gap-4 rounded-lg bg-surface p-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-textPrimary">Platform access<select value={form.platformRole} onChange={(event) => setForm((current) => ({ ...current, platformRole: event.target.value, organizationId: event.target.value === "superadmin" ? "" : current.organizationId, membershipRole: event.target.value === "superadmin" ? "employee" : current.membershipRole }))} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"><option value="user">Organization user</option><option value="superadmin">Platform superadmin</option></select></label>
            <label className="text-sm font-medium text-textPrimary">Account status<select value={form.status} onChange={(event) => updateField("status", event.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"><option value="active">Active</option><option value="suspended">Suspended</option><option value="inactive">Inactive</option></select></label>
            <label className="text-sm font-medium text-textPrimary">Organization<select disabled={form.platformRole === "superadmin"} value={form.platformRole === "superadmin" ? "" : form.organizationId} onChange={(event) => updateField("organizationId", event.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 disabled:opacity-50"><option value="">No organization</option>{organizations.map((organization) => <option key={organization.id} value={organization.id}>{organization.name}</option>)}</select></label>
            <label className="text-sm font-medium text-textPrimary">Organization role<select disabled={!form.organizationId || form.platformRole === "superadmin"} value={form.membershipRole} onChange={(event) => updateField("membershipRole", event.target.value)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 disabled:opacity-50"><option value="employee">Employee</option><option value="recruiter">Recruiter</option><option value="admin">Admin</option><option value="hiring_manager">Hiring manager</option><option value="interviewer">Interviewer</option></select></label>
          </section>

          {form.platformRole === "superadmin" && <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">This account will have platform-wide access and will be removed from all organization memberships.</p>}
          {form.platformRole !== "superadmin" && <p className="text-xs text-textSecondary">Saving assigns this user to the selected organization and removes their memberships in other organizations.</p>}
          {error && isOpen && <p role="alert" className="text-sm text-rose-700">{error}</p>}
          <div className="flex flex-wrap gap-3"><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save user"}</Button><Button type="button" variant="outline" disabled={saving} onClick={() => setIsOpen(false)}>Cancel</Button></div>
        </form>
      </Modal>
      <span className="sr-only">Signed in as {signedInUser?.email || "superadmin"}</span>
    </div>
  );
}
