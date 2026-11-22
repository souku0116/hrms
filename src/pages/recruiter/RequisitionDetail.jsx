import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ROUTES } from "@/routes/routeConstants";
import { getRequisition, reviewRequisition, submitRequisition } from "@/services/requisitionService";
import supabase from "@/lib/supabaseClient";

export default function RequisitionDetail() {
  const { id } = useParams();
  const { profile, role } = useAuth();
  const [requisition, setRequisition] = useState(null);
  const [history, setHistory] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isAdmin = role === "admin";

  const load = useCallback(async () => {
    if (!profile?.organization_id) return;
    setLoading(true);
    const [reqResult, historyResult] = await Promise.all([
      getRequisition(id, profile.organization_id),
      supabase.from("requisition_status_history").select("id,from_status,to_status,comment,created_at").eq("requisition_id", id).eq("organization_id", profile.organization_id).order("created_at", { ascending: false }),
    ]);
    setRequisition(reqResult.data || null);
    setHistory(historyResult.data || []);
    setError(reqResult.error?.message || historyResult.error?.message || "");
    setLoading(false);
  }, [id, profile?.organization_id]);
  useEffect(() => { load(); }, [load]);

  async function runAction(action, ...args) {
    setBusy(true); setError("");
    const { error: actionError } = await action(id, ...args);
    if (actionError) setError(actionError.message); else { setComment(""); await load(); }
    setBusy(false);
  }

  if (loading) return <main className="p-8" role="status">Loading requisition…</main>;
  if (!requisition) return <main className="mx-auto max-w-4xl p-8"><p role="alert">{error || "Requisition not found."}</p><Link className="text-primary hover:underline" to={ROUTES.REQUISITIONS}>Return to requisitions</Link></main>;

  return <main className="mx-auto max-w-5xl space-y-6 p-6 md:p-8">
    <Link className="text-sm text-primary hover:underline" to={ROUTES.REQUISITIONS}>← Requisitions</Link>
    <section className="rounded-xl border border-border bg-background p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-mono text-xs text-textSecondary">{requisition.requisition_code}</p><h1 className="mt-2 text-3xl font-bold">{requisition.title}</h1><p className="mt-2 text-textSecondary">{requisition.departments?.name || "No department"} · {requisition.locations?.name || "No location"}</p></div><span className="rounded-full bg-surface px-3 py-1 text-sm capitalize">{requisition.status.replaceAll("_", " ")}</span></div>
      <dl className="mt-7 grid gap-4 sm:grid-cols-3"><div><dt className="text-sm text-textSecondary">Openings</dt><dd>{requisition.openings}</dd></div><div><dt className="text-sm text-textSecondary">Employment</dt><dd className="capitalize">{requisition.employment_type.replaceAll("_", " ")}</dd></div><div><dt className="text-sm text-textSecondary">Work mode</dt><dd className="capitalize">{requisition.work_mode}</dd></div><div><dt className="text-sm text-textSecondary">Salary range</dt><dd>{requisition.salary_min ?? "—"} – {requisition.salary_max ?? "—"} {requisition.currency}</dd></div></dl>
      {[ ["Description", requisition.description], ["Responsibilities", requisition.responsibilities], ["Qualifications", requisition.qualifications], ["Hiring justification", requisition.justification] ].filter(([, value]) => value).map(([label, value]) => <section className="mt-6" key={label}><h2 className="font-semibold">{label}</h2><p className="mt-2 whitespace-pre-wrap text-textSecondary">{value}</p></section>)}
    </section>
    {error && <p className="rounded-md bg-error/10 p-3 text-sm text-error" role="alert">{error}</p>}
    {requisition.status === "pending_approval" && isAdmin && <section className="space-y-4 rounded-xl border border-border bg-background p-6"><h2 className="text-xl font-semibold">Review this requisition</h2><Input label="Decision comment" value={comment} onChange={(e) => setComment(e.target.value)} /><div className="flex gap-3"><Button disabled={busy} onClick={() => runAction(reviewRequisition, "approved", comment)}>{busy ? "Saving…" : "Approve"}</Button><Button disabled={busy || !comment.trim()} onClick={() => runAction(reviewRequisition, "rejected", comment)} variant="outline">Reject</Button></div></section>}
    {(["draft", "rejected"].includes(requisition.status) && ["admin", "recruiter"].includes(role)) && <Link className="mr-4 inline-flex rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-surface" to={ROUTES.REQUISITION_EDIT.replace(":id", id)}>Edit requisition</Link>}
    {(["draft", "rejected"].includes(requisition.status) && ["admin", "recruiter"].includes(role)) && <Button disabled={busy} onClick={() => runAction(submitRequisition)}>{busy ? "Submitting…" : "Submit for approval"}</Button>}
    <section className="rounded-xl border border-border bg-background p-6"><h2 className="font-semibold">Status history</h2>{history.length === 0 ? <p className="mt-3 text-sm text-textSecondary">No status changes yet.</p> : <ol className="mt-4 space-y-3">{history.map((event) => <li className="border-l-2 border-border pl-4" key={event.id}><p className="text-sm font-medium"><span className="capitalize">{event.from_status?.replaceAll("_", " ") || "Created"}</span> → <span className="capitalize">{event.to_status.replaceAll("_", " ")}</span></p>{event.comment && <p className="mt-1 text-sm text-textSecondary">{event.comment}</p>}<time className="text-xs text-textSecondary">{new Date(event.created_at).toLocaleString()}</time></li>)}</ol>}</section>
  </main>;
}
