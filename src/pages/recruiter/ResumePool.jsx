import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/supabaseClient";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

const emptyForm = {
  first_name: "", last_name: "", email: "", phone: "", location: "",
  current_title: "", current_company: "", years_experience: "", skills: "",
  source: "manual", notes: "", resume_drive_url: "",
};

function isGoogleDriveUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ["drive.google.com", "docs.google.com"].includes(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export default function ResumePool() {
  const { profile, user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [form, setForm] = useState(emptyForm);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadCandidates = useCallback(async () => {
    if (!profile?.organization_id) { setLoading(false); return; }
    setLoading(true);
    const { data, error: queryError } = await supabase.from("candidates")
      .select("id,first_name,last_name,email,phone,location,current_title,current_company,years_experience,skills,source,notes,resume_drive_url,status,created_at")
      .eq("organization_id", profile.organization_id)
      .order("created_at", { ascending: false })
      .limit(500);
    setCandidates(data || []);
    setError(queryError?.message || "");
    setLoading(false);
  }, [profile?.organization_id]);

  useEffect(() => { loadCandidates(); }, [loadCandidates]);

  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();
    return candidates.filter((candidate) => {
      if (statusFilter !== "all" && candidate.status !== statusFilter) return false;
      if (!query) return true;
      const searchable = [candidate.first_name, candidate.last_name, candidate.email, candidate.phone,
        candidate.location, candidate.current_title, candidate.current_company, candidate.source,
        ...(candidate.skills || [])].filter(Boolean).join(" ").toLowerCase();
      return searchable.includes(query);
    });
  }, [candidates, search, statusFilter]);

  async function saveCandidate(event) {
    event.preventDefault();
    setError(""); setNotice("");
    if (!isGoogleDriveUrl(form.resume_drive_url.trim())) {
      setError("Enter a secure Google Drive or Google Docs resume link.");
      return;
    }
    setSaving(true);
    const payload = {
      organization_id: profile.organization_id,
      created_by: user.id,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      location: form.location.trim() || null,
      current_title: form.current_title.trim() || null,
      current_company: form.current_company.trim() || null,
      years_experience: form.years_experience ? Number(form.years_experience) : null,
      skills: form.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
      source: form.source,
      notes: form.notes.trim() || null,
      resume_drive_url: form.resume_drive_url.trim(),
    };
    const { error: insertError } = await supabase.from("candidates").insert(payload);
    if (insertError) setError(insertError.code === "23505" ? "A candidate with this email already exists in your organization." : insertError.message);
    else {
      setNotice("Candidate added to the Resume Pool.");
      setForm(emptyForm);
      setIsOpen(false);
      await loadCandidates();
    }
    setSaving(false);
  }

  async function toggleStatus(candidate) {
    const status = candidate.status === "active" ? "archived" : "active";
    const { error: updateError } = await supabase.from("candidates").update({ status }).eq("id", candidate.id);
    if (updateError) setError(updateError.message);
    else await loadCandidates();
  }

  return <main className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-sm font-semibold uppercase tracking-wide text-primary">Recruiting</p><h1 className="mt-1 text-3xl font-bold text-textPrimary">Resume Pool</h1><p className="mt-1 text-textSecondary">Candidate profiles and their Google Drive resumes.</p></div>
      <Button onClick={() => { setError(""); setIsOpen(true); }}>Add candidate</Button>
    </div>
    {notice && <p role="status" className="rounded-md bg-success/10 p-3 text-sm text-success">{notice}</p>}
    {error && !isOpen && <p role="alert" className="rounded-md bg-error/10 p-3 text-sm text-error">{error}</p>}
    <div className="flex flex-col gap-3 sm:flex-row">
      <Input aria-label="Search candidates" placeholder="Search name, email, skills, title…" value={search} onChange={(e) => setSearch(e.target.value)} />
      <label className="flex items-center gap-2 text-sm text-textSecondary">Show
        <select className="rounded-md border border-border bg-background px-3 py-2 text-textPrimary" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="active">Active</option><option value="archived">Archived</option><option value="all">All candidates</option></select>
      </label>
      <Button onClick={loadCandidates} variant="outline">Refresh</Button>
    </div>
    {loading ? <p className="py-10 text-center text-textSecondary" role="status">Loading candidates…</p>
      : filteredCandidates.length === 0 ? <section className="rounded-xl border border-dashed border-border bg-background p-10 text-center"><h2 className="font-semibold">{search ? "No matching candidates" : "Your Resume Pool is empty"}</h2><p className="mt-2 text-sm text-textSecondary">Add a candidate and their Google Drive resume link to get started.</p></section>
        : <section aria-label="Candidates" className="grid gap-4 lg:grid-cols-2">{filteredCandidates.map((candidate) => <article className="flex flex-col rounded-xl border border-border bg-background p-5" key={candidate.id}>
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-semibold text-textPrimary">{candidate.first_name} {candidate.last_name}</h2><p className="mt-1 text-sm text-textSecondary">{candidate.current_title || "Title not provided"}{candidate.current_company ? ` · ${candidate.current_company}` : ""}</p></div><span className="rounded-full bg-surface px-3 py-1 text-xs capitalize text-textSecondary">{candidate.status}</span></div>
          <dl className="mt-5 grid gap-x-5 gap-y-3 text-sm sm:grid-cols-2">
            <div><dt className="text-xs uppercase text-textSecondary">Email</dt><dd className="mt-1 break-all">{candidate.email || "—"}</dd></div>
            <div><dt className="text-xs uppercase text-textSecondary">Phone</dt><dd className="mt-1">{candidate.phone || "—"}</dd></div>
            <div><dt className="text-xs uppercase text-textSecondary">Location</dt><dd className="mt-1">{candidate.location || "—"}</dd></div>
            <div><dt className="text-xs uppercase text-textSecondary">Experience</dt><dd className="mt-1">{candidate.years_experience == null ? "—" : `${candidate.years_experience} years`}</dd></div>
            <div><dt className="text-xs uppercase text-textSecondary">Source</dt><dd className="mt-1 capitalize">{candidate.source.replaceAll("_", " ")}</dd></div>
            <div><dt className="text-xs uppercase text-textSecondary">Added</dt><dd className="mt-1">{new Date(candidate.created_at).toLocaleDateString()}</dd></div>
          </dl>
          <div className="mt-4"><h3 className="text-xs font-semibold uppercase text-textSecondary">Skills</h3><div className="mt-2 flex flex-wrap gap-2">{candidate.skills?.length ? candidate.skills.map((skill) => <span className="rounded-full bg-surface px-2.5 py-1 text-xs" key={skill}>{skill}</span>) : <span className="text-sm text-textSecondary">Not provided</span>}</div></div>
          {candidate.notes && <div className="mt-4"><h3 className="text-xs font-semibold uppercase text-textSecondary">Notes</h3><p className="mt-1 whitespace-pre-wrap text-sm text-textSecondary">{candidate.notes}</p></div>}
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4 mt-5"><a className="font-medium text-primary hover:underline" href={candidate.resume_drive_url} rel="noopener noreferrer" target="_blank">Open resume in Google Drive ↗</a><button className="text-sm text-textSecondary hover:text-textPrimary" onClick={() => toggleStatus(candidate)}>{candidate.status === "active" ? "Archive" : "Restore"}</button></div>
        </article>)}</section>}
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add candidate to Resume Pool">
      <form className="grid max-h-[75vh] gap-4 overflow-y-auto pr-1 sm:grid-cols-2" onSubmit={saveCandidate}>
        <Input label="First name" required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
        <Input label="Last name" required value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <Input label="Current job title" value={form.current_title} onChange={(e) => setForm({ ...form, current_title: e.target.value })} />
        <Input label="Current company" value={form.current_company} onChange={(e) => setForm({ ...form, current_company: e.target.value })} />
        <Input label="Years of experience" type="number" min="0" max="99" step="0.5" value={form.years_experience} onChange={(e) => setForm({ ...form, years_experience: e.target.value })} />
        <label className="block text-sm font-medium">Source<select className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}><option value="manual">Manual</option><option value="linkedin">LinkedIn</option><option value="referral">Referral</option><option value="career_site">Career site</option><option value="agency">Agency</option><option value="other">Other</option></select></label>
        <Input className="sm:col-span-2" label="Skills" description="Separate skills with commas." value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        <Input className="sm:col-span-2" label="Google Drive resume link" description="Use a drive.google.com or docs.google.com URL. Recruiters must have access to the file in Drive." type="url" required value={form.resume_drive_url} onChange={(e) => setForm({ ...form, resume_drive_url: e.target.value })} />
        <label className="block text-sm font-medium sm:col-span-2">Recruiter notes<textarea className="mt-1 min-h-24 w-full rounded-md border border-border bg-background p-3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
        {error && <p role="alert" className="text-sm text-error sm:col-span-2">{error}</p>}
        <div className="flex gap-3 sm:col-span-2"><Button disabled={saving} type="submit">{saving ? "Saving…" : "Add candidate"}</Button><Button onClick={() => setIsOpen(false)} variant="outline">Cancel</Button></div>
      </form>
    </Modal>
  </main>;
}
