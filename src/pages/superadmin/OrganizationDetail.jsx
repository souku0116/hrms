import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/supabaseClient";
import { ROUTES } from "@/routes/routeConstants";

export default function OrganizationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [organization, setOrganization] = useState(null);
  const [members, setMembers] = useState([]);
  const [counts, setCounts] = useState({ departments: 0, locations: 0, requisitions: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Member search & role filter
  const [memberSearch, setMemberSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Invite form state
  const [invite, setInvite] = useState({ email: "", firstName: "", lastName: "", role: "admin" });
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviting, setInviting] = useState(false);

  const load = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError("");

    try {
      const [orgRes, teamRes, deptsRes, locsRes, reqsRes] = await Promise.all([
        supabase.from("organizations").select("*").eq("id", id).single(),
        supabase
          .from("organization_memberships")
          .select("id,role,status,created_at,profiles(first_name,last_name,email)")
          .eq("organization_id", id)
          .order("created_at", { ascending: false }),
        supabase.from("departments").select("id", { count: "exact", head: true }).eq("organization_id", id),
        supabase.from("locations").select("id", { count: "exact", head: true }).eq("organization_id", id),
        supabase.from("requisitions").select("id", { count: "exact", head: true }).eq("organization_id", id),
      ]);

      if (orgRes.error) throw orgRes.error;
      setOrganization(orgRes.data);
      setMembers(teamRes.data || []);
      setCounts({
        departments: deptsRes.count || 0,
        locations: locsRes.count || 0,
        requisitions: reqsRes.count || 0,
      });
    } catch (err) {
      setError(err.message || "Failed to load organization details.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleStatus() {
    if (!organization) return;
    const nextStatus = organization.status === "active" ? "suspended" : "active";
    const { error: updateError } = await supabase
      .from("organizations")
      .update({ status: nextStatus })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
    } else {
      await load(true);
    }
  }

  async function toggleMemberStatus(member) {
    const nextStatus = member.status === "active" ? "suspended" : "active";
    const { error: updateError } = await supabase
      .from("organization_memberships")
      .update({ status: nextStatus })
      .eq("id", member.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      await load(true);
    }
  }

  async function inviteMember(event) {
    event.preventDefault();
    setInviting(true);
    setError("");
    setInviteMessage("");

    const { data: sessionData } = await supabase.auth.getSession();
    try {
      const result = await fetch("/api/invite-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData.session?.access_token || ""}`,
        },
        body: JSON.stringify({ organizationId: id, ...invite }),
      });

      const isJson = result.headers.get("content-type")?.includes("application/json");
      const payload = isJson ? await result.json() : {};

      if (!result.ok || !isJson) {
        setError(payload.error || "Invitation failed. Verify API endpoint is reachable.");
      } else {
        setInviteMessage(payload.message || `Invitation sent to ${invite.email}.`);
        setInvite({ email: "", firstName: "", lastName: "", role: "admin" });
        await load(true);
      }
    } catch {
      setError("Invitation service could not be reached. Ensure the server is running.");
    }
    setInviting(false);
  }

  // Filtered team members
  const filteredMembers = useMemo(() => {
    const q = memberSearch.trim().toLowerCase();
    return members.filter((member) => {
      if (roleFilter !== "all" && member.role !== roleFilter) return false;
      if (!q) return true;
      const fullName = [member.profiles?.first_name, member.profiles?.last_name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const email = member.profiles?.email?.toLowerCase() || "";
      return fullName.includes(q) || email.includes(q);
    });
  }, [members, memberSearch, roleFilter]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-textSecondary">
        Loading organization details…
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="mx-auto max-w-4xl p-8 space-y-4">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {error || "Organization not found."}
        </div>
        <Link to={ROUTES.SUPERADMIN_ORGANIZATIONS} className="text-sm font-semibold text-primary hover:underline">
          ← Return to organizations
        </Link>
      </div>
    );
  }

  const isActive = organization.status === "active";

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-textSecondary">
          <Link to={ROUTES.SUPERADMIN_ORGANIZATIONS} className="hover:text-primary transition-colors">
            Organizations
          </Link>
          <span>/</span>
          <span className="font-semibold text-primary">{organization.name}</span>
        </div>

        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-textSecondary hover:bg-surface transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-primary" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Organization Header Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-surface/50 p-6 shadow-xs md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-black text-white shadow-sm">
              {organization.name?.[0]?.toUpperCase() || "O"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-textPrimary">
                  {organization.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border ${
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
                  {organization.status}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-textSecondary font-mono">
                <span>slug: {organization.slug}</span>
                <span>·</span>
                <span>id: {organization.id}</span>
                <span>·</span>
                <span>
                  Created: {new Date(organization.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={toggleStatus}
              variant="outline"
              className={
                isActive
                  ? "border-amber-300 text-amber-700 hover:bg-amber-50"
                  : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              }
            >
              {isActive ? (
                <>
                  <ShieldAlert className="h-4 w-4 mr-1.5" />
                  Suspend Workspace
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 mr-1.5" />
                  Activate Workspace
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Notifications */}
      {inviteMessage && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{inviteMessage}</span>
          </div>
          <button
            onClick={() => setInviteMessage("")}
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

      {/* Overview Stat Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-textSecondary">Team Members</p>
            <div className="rounded-xl bg-purple-50 p-2 text-purple-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-textPrimary">{members.length}</p>
          <p className="mt-1 text-xs text-textSecondary">Admins & recruiters</p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-blue-600">Departments</p>
            <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-textPrimary">{counts.departments}</p>
          <p className="mt-1 text-xs text-textSecondary">Organizational units</p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-emerald-600">Locations</p>
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <MapPin className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-textPrimary">{counts.locations}</p>
          <p className="mt-1 text-xs text-textSecondary">Configured offices</p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-amber-600">Requisitions</p>
            <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-textPrimary">{counts.requisitions}</p>
          <p className="mt-1 text-xs text-textSecondary">Job requisitions total</p>
        </div>
      </section>

      {/* Main Grid: Team Members & Invite Section */}
      <section className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Team Members (2 Cols) */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-textPrimary">Organization Team</h2>
              <p className="text-xs text-textSecondary">
                Manage members with administrative or recruiter privileges.
              </p>
            </div>
            <span className="rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-textSecondary">
              {members.length} members
            </span>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-background p-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-textSecondary" />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search member by name or email…"
                className="w-full rounded-lg border border-border bg-surface/40 py-2 pl-9 pr-3 text-xs text-textPrimary placeholder:text-textSecondary focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {[
                { id: "all", label: "All Roles" },
                { id: "admin", label: "Admins" },
                { id: "recruiter", label: "Recruiters" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setRoleFilter(tab.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    roleFilter === tab.id
                      ? "bg-primary text-white"
                      : "text-textSecondary hover:bg-surface hover:text-textPrimary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Members Table */}
          <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-surface text-textSecondary font-semibold">
                  <tr>
                    <th className="p-3.5">Member</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-textSecondary">
                        No team members found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => {
                      const name = [member.profiles?.first_name, member.profiles?.last_name]
                        .filter(Boolean)
                        .join(" ");
                      const initial = name?.[0]?.toUpperCase() || member.profiles?.email?.[0]?.toUpperCase() || "U";
                      const isMemberActive = member.status === "active";

                      return (
                        <tr key={member.id} className="hover:bg-surface/50 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                {initial}
                              </div>
                              <div>
                                <p className="font-semibold text-textPrimary">
                                  {name || "Name not provided"}
                                </p>
                                <p className="text-[11px] text-textSecondary">
                                  {member.profiles?.email || "—"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize ${
                                member.role === "admin"
                                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}
                            >
                              {member.role}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize border ${
                                isMemberActive
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isMemberActive ? "bg-emerald-500" : "bg-rose-500"
                                }`}
                              />
                              {member.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => toggleMemberStatus(member)}
                              className={`font-medium hover:underline text-xs ${
                                isMemberActive
                                  ? "text-amber-600 hover:text-amber-700"
                                  : "text-emerald-600 hover:text-emerald-700"
                              }`}
                            >
                              {isMemberActive ? "Suspend" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Invite Member Form */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-bold text-textPrimary">Invite Member</h2>
          </div>

          <form
            className="space-y-3.5 rounded-2xl border border-border bg-background p-5 shadow-xs text-xs"
            onSubmit={inviteMember}
          >
            <p className="text-textSecondary">
              Send an email invitation for an Administrator or Recruiter to join this workspace.
            </p>

            <Input
              label="Email Address"
              type="email"
              placeholder="user@example.com"
              required
              value={invite.email}
              onChange={(e) => setInvite({ ...invite, email: e.target.value })}
            />

            <div>
              <label className="block text-xs font-medium text-textPrimary mb-1">
                Workspace Role
              </label>
              <select
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-textPrimary focus:border-primary focus:outline-none"
                value={invite.role}
                onChange={(e) => setInvite({ ...invite, role: e.target.value })}
              >
                <option value="admin">Administrator (Full org management)</option>
                <option value="recruiter">Recruiter (Requisitions & Talent Pool)</option>
              </select>
            </div>

            <Input
              label="First Name"
              required
              value={invite.firstName}
              onChange={(e) => setInvite({ ...invite, firstName: e.target.value })}
            />

            <Input
              label="Last Name"
              required
              value={invite.lastName}
              onChange={(e) => setInvite({ ...invite, lastName: e.target.value })}
            />

            <div className="pt-2">
              <Button
                disabled={inviting || !user}
                type="submit"
                className="w-full flex items-center justify-center gap-2"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>{inviting ? "Sending Invitation…" : "Send Invite"}</span>
              </Button>
            </div>
          </form>

          {/* Quick Guidance Box */}
          <div className="rounded-xl border border-border bg-surface/50 p-4 space-y-2 text-xs text-textSecondary">
            <p className="font-semibold text-textPrimary">Role Guidelines</p>
            <p>
              <strong>Admins</strong> can configure departments, locations, view all requisitions, and approve or reject hiring requests.
            </p>
            <p>
              <strong>Recruiters</strong> can create drafts, submit requisitions, and add candidates to the organization resume pool.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
