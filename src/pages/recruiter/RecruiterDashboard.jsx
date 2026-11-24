import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { openCandidateResume, uploadCandidateResume, validateResumeFile } from "@/lib/candidateResumes";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/supabaseClient";
import { ROUTES } from "@/routes/routeConstants";
import { submitRequisition } from "@/services/requisitionService";

const STATUS_COLORS = {
  approved: "#10b981",
  pending_approval: "#f59e0b",
  draft: "#3b82f6",
  rejected: "#ef4444",
  closed: "#64748b",
  filled: "#8b5cf6",
};

const STATUS_LABELS = {
  approved: "Approved / Open",
  pending_approval: "Pending Approval",
  draft: "Draft",
  rejected: "Rejected",
  closed: "Closed",
  filled: "Filled",
};

const emptyCandidateForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  location: "",
  current_title: "",
  current_company: "",
  years_experience: "",
  skills: "",
  source: "manual",
  notes: "",
  resume_file: null,
};

export default function RecruiterDashboard() {
  const { user, profile } = useAuth();
  const [requisitions, setRequisitions] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [candidateTotal, setCandidateTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Filters for recent requisitions table
  const [reqSearch, setReqSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal for quick candidate entry
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [candidateForm, setCandidateForm] = useState(emptyCandidateForm);
  const [savingCandidate, setSavingCandidate] = useState(false);
  const [candidateModalError, setCandidateModalError] = useState("");

  // Submitting a draft directly
  const [submittingId, setSubmittingId] = useState(null);

  const recruiterName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Recruiter";
  const rawOrg = profile?.organization?.name || "";
  const cleanedOrg = rawOrg
    .replace(/(?:^|\s*[-–(]?)\s*demo\s*[)-]?/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const orgName =
    cleanedOrg.toLowerCase() === "worksynchr" || cleanedOrg.toLowerCase() === "worksync hr"
      ? "WorkSync HR"
      : cleanedOrg || "WorkSync HR";

  const handleCloseCandidateModal = useCallback(() => {
    setCandidateModalOpen(false);
  }, []);

  const loadDashboardData = useCallback(async (isSilent = false) => {
    if (!profile?.organization_id) {
      setLoading(false);
      return;
    }
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError("");

    try {
      const orgId = profile.organization_id;

      const [reqsRes, candidatesRes, countRes] = await Promise.all([
        supabase
          .from("requisitions")
          .select("id,requisition_code,title,status,openings,employment_type,work_mode,salary_min,salary_max,currency,created_at,justification,departments(id,name),locations(id,name)")
          .eq("organization_id", orgId)
          .order("created_at", { ascending: false }),
        supabase
          .from("candidates")
          .select("id,first_name,last_name,email,phone,location,current_title,current_company,years_experience,skills,source,status,resume_drive_url,resume_storage_path,created_at")
          .eq("organization_id", orgId)
          .order("created_at", { ascending: false })
          .limit(6),
        supabase
          .from("candidates")
          .select("id", { count: "exact", head: true })
          .eq("organization_id", orgId),
      ]);

      if (reqsRes.error) throw reqsRes.error;
      if (candidatesRes.error) throw candidatesRes.error;

      setRequisitions(reqsRes.data || []);
      setCandidates(candidatesRes.data || []);
      setCandidateTotal(countRes.count || 0);
    } catch (err) {
      setError(err.message || "Failed to load recruiter data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [profile?.organization_id]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Derived KPI metrics
  const stats = useMemo(() => {
    const total = requisitions.length;
    const approved = requisitions.filter((r) => ["approved", "open"].includes(r.status));
    const pending = requisitions.filter((r) => r.status === "pending_approval");
    const drafts = requisitions.filter((r) => r.status === "draft");
    const rejected = requisitions.filter((r) => r.status === "rejected");
    const totalOpenings = approved.reduce((sum, r) => sum + (Number(r.openings) || 0), 0);

    return {
      total,
      approvedCount: approved.length,
      pendingCount: pending.length,
      draftCount: drafts.length,
      rejectedCount: rejected.length,
      totalOpenings,
      candidateTotal,
    };
  }, [requisitions, candidateTotal]);

  // Status breakdown data for Pie Chart
  const statusChartData = useMemo(() => {
    const counts = {};
    requisitions.forEach((r) => {
      const s = r.status || "draft";
      counts[s] = (counts[s] || 0) + 1;
    });

    return Object.entries(counts).map(([status, value]) => ({
      name: STATUS_LABELS[status] || status,
      value,
      color: STATUS_COLORS[status] || "#94a3b8",
      key: status,
    }));
  }, [requisitions]);

  // Department breakdown data for Bar Chart
  const departmentChartData = useMemo(() => {
    const map = {};
    requisitions.forEach((r) => {
      const deptName = r.departments?.name || "General / Unassigned";
      if (!map[deptName]) {
        map[deptName] = { department: deptName, requisitions: 0, openings: 0 };
      }
      map[deptName].requisitions += 1;
      map[deptName].openings += Number(r.openings) || 0;
    });
    return Object.values(map).slice(0, 5);
  }, [requisitions]);

  // Work mode stats
  const workModeStats = useMemo(() => {
    const modes = { remote: 0, hybrid: 0, onsite: 0 };
    requisitions.forEach((r) => {
      if (modes[r.work_mode] !== undefined) modes[r.work_mode] += 1;
    });
    return modes;
  }, [requisitions]);

  // Action items: drafts or rejected requisitions needing attention
  const attentionItems = useMemo(() => {
    return requisitions.filter((r) => ["draft", "rejected"].includes(r.status));
  }, [requisitions]);

  // Filtered recent requisitions
  const filteredRequisitions = useMemo(() => {
    const q = reqSearch.trim().toLowerCase();
    return requisitions.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      const searchable = [
        r.title,
        r.requisition_code,
        r.departments?.name,
        r.locations?.name,
        r.work_mode,
      ].filter(Boolean).join(" ").toLowerCase();
      return searchable.includes(q);
    });
  }, [requisitions, reqSearch, statusFilter]);

  // Quick submit draft for approval
  async function handleQuickSubmit(id) {
    setSubmittingId(id);
    setActionSuccess("");
    setError("");
    const { error: submitErr } = await submitRequisition(id);
    if (submitErr) {
      setError(submitErr.message);
    } else {
      setActionSuccess("Requisition submitted for approval.");
      await loadDashboardData(true);
    }
    setSubmittingId(null);
  }

  // Quick save candidate from dashboard modal
  async function handleQuickSaveCandidate(e) {
    e.preventDefault();
    setCandidateModalError("");

    const fileError = validateResumeFile(candidateForm.resume_file);
    if (fileError) {
      setCandidateModalError(fileError);
      return;
    }

    setSavingCandidate(true);
    let resumePath;
    let savedCandidate = false;
    try {
    resumePath = await uploadCandidateResume(candidateForm.resume_file, profile.organization_id, user.id);
    const payload = {
      organization_id: profile.organization_id,
      created_by: user.id,
      first_name: candidateForm.first_name.trim(),
      last_name: candidateForm.last_name.trim(),
      email: candidateForm.email.trim() || null,
      phone: candidateForm.phone.trim() || null,
      location: candidateForm.location.trim() || null,
      current_title: candidateForm.current_title.trim() || null,
      current_company: candidateForm.current_company.trim() || null,
      years_experience: candidateForm.years_experience ? Number(candidateForm.years_experience) : null,
      skills: candidateForm.skills.split(",").map((s) => s.trim()).filter(Boolean),
      source: candidateForm.source,
      notes: candidateForm.notes.trim() || null,
      resume_drive_url: null,
      resume_storage_path: resumePath,
    };

    const { error: insertErr } = await supabase.from("candidates").insert(payload);
    if (insertErr) throw insertErr;
    savedCandidate = true;
      setActionSuccess("Candidate added to Resume Pool!");
      setCandidateForm(emptyCandidateForm);
      setCandidateModalOpen(false);
      await loadDashboardData(true);
    } catch (saveError) {
      if (resumePath && !savedCandidate) await supabase.storage.from("candidate-resumes").remove([resumePath]);
      setCandidateModalError(saveError.code === "23505" ? "A candidate with this email already exists." : saveError.message);
    } finally {
      setSavingCandidate(false);
    }
  }

  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-6 md:p-8">
      {/* Top Banner / Hero Header */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-surface via-background to-surface p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Recruiter Hub
              </span>
              <span className="text-xs text-textSecondary">{orgName}</span>
              <span className="text-xs text-textSecondary">·</span>
              <span className="text-xs text-textSecondary">{currentDate}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-textPrimary md:text-4xl">
              Welcome back, {recruiterName}
            </h1>
            <p className="text-sm text-textSecondary md:text-base">
              Monitor active requisitions, manage open vacancies, and grow your talent pipeline.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => loadDashboardData(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-medium text-textPrimary shadow-sm hover:bg-surface hover:border-textSecondary/30 transition-all disabled:opacity-50"
              title="Refresh dashboard metrics"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin text-primary" : "text-textSecondary"}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={() => {
                setCandidateModalError("");
                setCandidateModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-textPrimary shadow-sm hover:bg-surface hover:border-primary/50 transition-all"
            >
              <Users className="h-4 w-4 text-primary" />
              <span>Add Candidate</span>
            </button>

            <Link
              to={ROUTES.REQUISITION_NEW}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>New Requisition</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Notifications / Alerts */}
      {actionSuccess && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button
            onClick={() => setActionSuccess("")}
            className="text-xs text-emerald-600 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
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

      {/* KPI Stat Cards Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Requisitions */}
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-textSecondary">Active Requisitions</p>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-textPrimary">{stats.approvedCount}</span>
            <span className="text-xs text-textSecondary">of {stats.total} total</span>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/60 text-xs">
            <span className="text-emerald-600 font-medium">Currently recruiting</span>
            <Link to={ROUTES.REQUISITIONS} className="text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Total Openings */}
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-textSecondary">Open Vacancies</p>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-textPrimary">{stats.totalOpenings}</span>
            <span className="text-xs text-textSecondary">positions to fill</span>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/60 text-xs text-textSecondary">
            <span>Across approved roles</span>
            <span className="font-medium text-textPrimary">
              {stats.approvedCount > 0 ? (stats.totalOpenings / stats.approvedCount).toFixed(1) : 0} avg/role
            </span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className={`group relative overflow-hidden rounded-2xl border bg-background p-6 shadow-sm transition-all hover:shadow-md ${stats.pendingCount > 0 ? "border-amber-300/80 bg-amber-50/20" : "border-border"}`}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-textSecondary">Pending Approval</p>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-textPrimary">{stats.pendingCount}</span>
            <span className="text-xs text-textSecondary">awaiting admin review</span>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/60 text-xs">
            {stats.pendingCount > 0 ? (
              <span className="text-amber-600 font-medium flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Action pending
              </span>
            ) : (
              <span className="text-textSecondary">Queue is clear</span>
            )}
            <Link to={ROUTES.REQUISITIONS} className="text-primary hover:underline">
              Inspect →
            </Link>
          </div>
        </div>

        {/* Resume Pool */}
        <div className="group relative overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-textSecondary">Resume Pool</p>
            <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-textPrimary">{stats.candidateTotal}</span>
            <span className="text-xs text-textSecondary">candidate profiles</span>
          </div>
          <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/60 text-xs">
            <span className="text-purple-600 font-medium">Resume pool available</span>
            <Link to={ROUTES.RESUME_POOL} className="text-primary hover:underline flex items-center gap-1">
              Browse pool <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Action Needed Banner / Queue (Drafts & Rejections) */}
      {attentionItems.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white shadow-sm">
                <AlertTriangle className="h-4 w-4" />
              </span>
              <h2 className="text-base font-bold text-amber-950">
                Action Items ({attentionItems.length})
              </h2>
            </div>
            <span className="text-xs font-medium text-amber-800">
              Drafts & Revisions needing attention
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {attentionItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-amber-200/80 bg-background p-4 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-textSecondary">
                      {item.requisition_code}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                        item.status === "rejected"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-semibold text-textPrimary line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-textSecondary">
                    {item.departments?.name || "No department"} · {item.openings} opening(s)
                  </p>
                  {item.justification && (
                    <p className="mt-2 text-xs italic text-textSecondary line-clamp-1">
                      &ldquo;{item.justification}&rdquo;
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
                  <Link
                    to={ROUTES.REQUISITION_EDIT.replace(":id", item.id)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Edit details
                  </Link>

                  <button
                    onClick={() => handleQuickSubmit(item.id)}
                    disabled={submittingId === item.id}
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1 text-xs font-medium text-white hover:bg-amber-700 disabled:opacity-50 transition-colors"
                  >
                    {submittingId === item.id ? "Submitting…" : "Submit for Approval"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Visual Analytics Grid */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Status Pipeline Donut Chart */}
        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-textPrimary">Requisition Pipeline</h2>
              <p className="text-xs text-textSecondary">Distribution by approval status</p>
            </div>
            <span className="rounded-md bg-surface px-2.5 py-1 text-xs font-medium text-textSecondary">
              {stats.total} total
            </span>
          </div>

          <div className="mt-4 h-64 w-full">
            {requisitions.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-textSecondary">
                No requisitions yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [`${val} requisitions`, name]}
                    contentStyle={{
                      backgroundColor: "var(--color-background, #fff)",
                      borderColor: "var(--color-border, #e2e8f0)",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Hiring Demand by Department Bar Chart */}
        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-textPrimary">Hiring by Department</h2>
              <p className="text-xs text-textSecondary">Requisitions and open positions per department</p>
            </div>
            <Link
              to={ROUTES.REQUISITIONS}
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              All requisitions <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 h-64 w-full">
            {departmentChartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-xs text-textSecondary">
                No departmental requisition data yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <XAxis
                    dataKey="department"
                    tick={{ fontSize: 11 }}
                    interval={0}
                    tickFormatter={(val) => (val.length > 14 ? `${val.slice(0, 12)}…` : val)}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-background, #fff)",
                      borderColor: "var(--color-border, #e2e8f0)",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
                  />
                  <Bar dataKey="openings" name="Openings" fill="#173a8c" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="requisitions" name="Requisitions" fill="#5b5bd6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      {/* Work Mode Quick Glance Bar */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-surface/50 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-textSecondary uppercase font-medium">On-site Roles</p>
            <p className="text-xl font-bold text-textPrimary">{workModeStats.onsite}</p>
            <p className="text-xs text-textSecondary">In-office positions</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-border bg-surface/50 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-textSecondary uppercase font-medium">Hybrid Roles</p>
            <p className="text-xl font-bold text-textPrimary">{workModeStats.hybrid}</p>
            <p className="text-xs text-textSecondary">Flexible arrangements</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-border bg-surface/50 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-textSecondary uppercase font-medium">Remote Roles</p>
            <p className="text-xl font-bold text-textPrimary">{workModeStats.remote}</p>
            <p className="text-xs text-textSecondary">Anywhere within region</p>
          </div>
        </div>
      </section>

      {/* Main Content Grid: Recent Requisitions & Talent Pool */}
      <section className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Requisitions Table (2 Cols) */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-textPrimary">Recent Requisitions</h2>
              <p className="text-xs text-textSecondary">
                Manage positions, check review status, and initiate hiring.
              </p>
            </div>
            <Link
              to={ROUTES.REQUISITIONS}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View directory <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-background p-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-textSecondary" />
              <input
                type="text"
                value={reqSearch}
                onChange={(e) => setReqSearch(e.target.value)}
                placeholder="Search position title, code, department…"
                className="w-full rounded-lg border border-border bg-surface/40 py-2 pl-9 pr-3 text-xs text-textPrimary placeholder:text-textSecondary focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All" },
                { id: "approved", label: "Approved" },
                { id: "pending_approval", label: "Pending" },
                { id: "draft", label: "Drafts" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    statusFilter === tab.id
                      ? "bg-primary text-white"
                      : "text-textSecondary hover:bg-surface hover:text-textPrimary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Requisitions Table */}
          <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-surface text-textSecondary font-semibold">
                  <tr>
                    <th className="p-3.5">Code</th>
                    <th className="p-3.5">Position</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5 text-center">Openings</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-textSecondary">
                        Loading requisitions…
                      </td>
                    </tr>
                  ) : filteredRequisitions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-textSecondary">
                        No matching requisitions found.
                      </td>
                    </tr>
                  ) : (
                    filteredRequisitions.slice(0, 7).map((row) => (
                      <tr key={row.id} className="hover:bg-surface/50 transition-colors">
                        <td className="p-3.5 font-mono text-xs font-semibold text-textSecondary">
                          {row.requisition_code}
                        </td>
                        <td className="p-3.5">
                          <Link
                            to={ROUTES.REQUISITION_DETAIL.replace(":id", row.id)}
                            className="font-medium text-textPrimary hover:text-primary hover:underline line-clamp-1"
                          >
                            {row.title}
                          </Link>
                          <div className="mt-0.5 text-[11px] text-textSecondary capitalize">
                            {row.work_mode} · {row.employment_type?.replaceAll("_", " ")}
                          </div>
                        </td>
                        <td className="p-3.5 text-textSecondary">
                          {row.departments?.name ? (
                            <span className="rounded-md bg-surface px-2 py-0.5 text-textPrimary">
                              {row.departments.name}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="p-3.5 text-textSecondary">
                          {row.locations?.name || "—"}
                        </td>
                        <td className="p-3.5 text-center font-bold text-textPrimary">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-surface text-xs">
                            {row.openings}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize"
                            style={{
                              backgroundColor: `${STATUS_COLORS[row.status] || "#94a3b8"}18`,
                              color: STATUS_COLORS[row.status] || "#475569",
                            }}
                          >
                            {row.status.replaceAll("_", " ")}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <Link
                            to={ROUTES.REQUISITION_DETAIL.replace(":id", row.id)}
                            className="font-medium text-primary hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {filteredRequisitions.length > 7 && (
              <div className="border-t border-border bg-surface/30 p-3 text-center">
                <Link
                  to={ROUTES.REQUISITIONS}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View all {filteredRequisitions.length} requisitions →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Resume Pool Highlights */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-textPrimary">Talent Highlights</h2>
              <p className="text-xs text-textSecondary">Recent candidates added</p>
            </div>
            <Link
              to={ROUTES.RESUME_POOL}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Resume Pool <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {candidates.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-background p-8 text-center">
                <Users className="mx-auto h-8 w-8 text-textSecondary/50" />
                <h3 className="mt-2 text-sm font-semibold text-textPrimary">
                  Resume Pool is empty
                </h3>
                <p className="mt-1 text-xs text-textSecondary">
                  Upload resumes and add candidates to the pool.
                </p>
                <button
                  onClick={() => setCandidateModalOpen(true)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" /> Add candidate
                </button>
              </div>
            ) : (
              candidates.map((c) => {
                const initials = [c.first_name?.[0], c.last_name?.[0]]
                  .filter(Boolean)
                  .join("")
                  .toUpperCase() || "C";

                return (
                  <article
                    key={c.id}
                    className="flex flex-col rounded-xl border border-border bg-background p-4 shadow-xs hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-semibold text-textPrimary text-sm truncate">
                            {c.first_name} {c.last_name}
                          </h4>
                          <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] capitalize text-textSecondary">
                            {c.source?.replaceAll("_", " ")}
                          </span>
                        </div>
                        <p className="text-xs text-textSecondary truncate">
                          {c.current_title || "Candidate"}
                          {c.current_company ? ` · ${c.current_company}` : ""}
                        </p>
                      </div>
                    </div>

                    {c.skills?.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {c.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md bg-surface px-1.5 py-0.5 text-[10px] text-textSecondary"
                          >
                            {skill}
                          </span>
                        ))}
                        {c.skills.length > 3 && (
                          <span className="text-[10px] text-textSecondary">
                            +{c.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-xs">
                      <span className="text-textSecondary">
                        {c.years_experience != null
                          ? `${c.years_experience} yrs exp`
                          : c.location || "Active"}
                      </span>
                      {(c.resume_storage_path || c.resume_drive_url) && (
                        <a
                          href={c.resume_drive_url || undefined}
                          onClick={c.resume_storage_path ? async (event) => { event.preventDefault(); try { await openCandidateResume(c.resume_storage_path); } catch (openError) { setError(openError.message); } } : undefined}
                          target={c.resume_drive_url ? "_blank" : undefined}
                          rel={c.resume_drive_url ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                        >
                          Resume <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </article>
                );
              })
            )}

            {candidates.length > 0 && (
              <div className="pt-1 text-center">
                <button
                  onClick={() => setCandidateModalOpen(true)}
                  className="w-full rounded-xl border border-dashed border-border py-2 text-xs font-medium text-textSecondary hover:border-primary hover:text-primary transition-colors"
                >
                  + Add another candidate
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Add Candidate Modal */}
      <Modal
        isOpen={candidateModalOpen}
        onClose={handleCloseCandidateModal}
        title="Add Candidate to Resume Pool"
      >
        <form
          className="grid max-h-[75vh] gap-4 overflow-y-auto pr-1 sm:grid-cols-2 text-xs"
          onSubmit={handleQuickSaveCandidate}
        >
          <Input
            label="First name"
            required
            value={candidateForm.first_name}
            onChange={(e) =>
              setCandidateForm({ ...candidateForm, first_name: e.target.value })
            }
          />
          <Input
            label="Last name"
            required
            value={candidateForm.last_name}
            onChange={(e) =>
              setCandidateForm({ ...candidateForm, last_name: e.target.value })
            }
          />
          <Input
            label="Email"
            type="email"
            value={candidateForm.email}
            onChange={(e) =>
              setCandidateForm({ ...candidateForm, email: e.target.value })
            }
          />
          <Input
            label="Phone"
            type="tel"
            value={candidateForm.phone}
            onChange={(e) =>
              setCandidateForm({ ...candidateForm, phone: e.target.value })
            }
          />
          <Input
            label="Location"
            value={candidateForm.location}
            onChange={(e) =>
              setCandidateForm({ ...candidateForm, location: e.target.value })
            }
          />
          <Input
            label="Current job title"
            value={candidateForm.current_title}
            onChange={(e) =>
              setCandidateForm({ ...candidateForm, current_title: e.target.value })
            }
          />
          <Input
            label="Current company"
            value={candidateForm.current_company}
            onChange={(e) =>
              setCandidateForm({ ...candidateForm, current_company: e.target.value })
            }
          />
          <Input
            label="Years of experience"
            type="number"
            min="0"
            max="99"
            step="0.5"
            value={candidateForm.years_experience}
            onChange={(e) =>
              setCandidateForm({ ...candidateForm, years_experience: e.target.value })
            }
          />
          <label className="block text-sm font-medium">
            Source
            <select
              className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-textPrimary text-xs"
              value={candidateForm.source}
              onChange={(e) =>
                setCandidateForm({ ...candidateForm, source: e.target.value })
              }
            >
              <option value="manual">Manual</option>
              <option value="linkedin">LinkedIn</option>
              <option value="referral">Referral</option>
              <option value="career_site">Career site</option>
              <option value="agency">Agency</option>
              <option value="other">Other</option>
            </select>
          </label>
          <Input
            className="sm:col-span-2"
            label="Skills"
            description="Separate skills with commas (e.g. React, TypeScript, Node.js)."
            value={candidateForm.skills}
            onChange={(e) =>
              setCandidateForm({ ...candidateForm, skills: e.target.value })
            }
          />
          <Input
            className="sm:col-span-2"
            label="Resume file"
            description="PDF, DOC, or DOCX; up to 10 MB. Enter candidate details below."
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            required
            onChange={(e) =>
              setCandidateForm({ ...candidateForm, resume_file: e.target.files?.[0] || null })
            }
          />
          <label className="block text-sm font-medium sm:col-span-2">
            Recruiter notes
            <textarea
              className="mt-1 min-h-20 w-full rounded-md border border-border bg-background p-2.5 text-xs text-textPrimary"
              value={candidateForm.notes}
              onChange={(e) =>
                setCandidateForm({ ...candidateForm, notes: e.target.value })
              }
            />
          </label>

          {candidateModalError && (
            <p role="alert" className="text-sm text-error sm:col-span-2">
              {candidateModalError}
            </p>
          )}

          <div className="flex gap-3 sm:col-span-2 pt-2">
            <Button disabled={savingCandidate} type="submit">
              {savingCandidate ? "Saving…" : "Save candidate"}
            </Button>
            <Button onClick={() => setCandidateModalOpen(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
