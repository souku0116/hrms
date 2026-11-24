import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import supabase from "@/lib/supabaseClient";
import { hashResumeFile, openCandidateResume, uploadCandidateResume, validateResumeFile } from "@/lib/candidateResumes";

const MAX_FILES = 50;
const EMPTY_FIELDS = { first_name: "", last_name: "", email: "", phone: "", location: "", current_title: "", current_company: "", years_experience: "", skills: [], professional_summary: "", additional_details: "" };
const FIELD_LABELS = [["first_name", "First name"], ["last_name", "Last name"], ["email", "Email"], ["phone", "Phone"], ["location", "Location"], ["current_title", "Current title"], ["current_company", "Current company"], ["years_experience", "Years experience"]];

export default function BulkResumeImport({ isOpen, onClose, organizationId, userId, candidates, onImported }) {
  const [rows, setRows] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [notice, setNotice] = useState("");

  function updateRow(id, changes) {
    setRows((current) => current.map((row) => row.id === id ? { ...row, ...changes } : row));
  }

  async function processFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    if (rows.length + files.length > MAX_FILES) {
      setNotice(`Select no more than ${MAX_FILES} resumes per batch.`);
      return;
    }
    setNotice("");
    setActiveIndex(rows.length);
    setProcessing(true);
    const batch = files.map((file, index) => ({
      id: `${Date.now()}-${index}-${crypto.randomUUID()}`,
      file, fields: { ...EMPTY_FIELDS }, extracted: null, state: "queued", message: "Waiting to process", resumePath: null, skipped: false,
    }));
    setRows((current) => [...current, ...batch]);
    const seenHashes = new Set(candidates.map((candidate) => candidate.resume_sha256).filter(Boolean));

    for (const row of batch) {
      updateRow(row.id, { state: "processing", message: "Checking file and uploading resume…" });
      try {
        const fileError = validateResumeFile(row.file);
        if (fileError) throw new Error(fileError);
        const fileSha256 = await hashResumeFile(row.file);
        if (seenHashes.has(fileSha256)) {
          updateRow(row.id, { state: "error", message: "This exact resume file is already in the Resume Pool or this batch." });
          continue;
        }
        seenHashes.add(fileSha256);
        const resumePath = await uploadCandidateResume(row.file, organizationId, userId);
        updateRow(row.id, { resumePath, fileSha256, state: "processing", message: "Extracting resume details…" });
        let fields = { ...EMPTY_FIELDS };
        let parseNote = "";
        let extracted = null;
        let runId = null;
        try {
          const { readResumeText, readResumeImages, extractCandidateFields } = await import("@/lib/resumeParsing");
          const text = await readResumeText(row.file);
          const fallbackFields = extractCandidateFields(text);
          fields = { ...fields, ...fallbackFields, skills: fallbackFields.skills || [] };
          const extension = row.file.name.split(".").pop()?.toLowerCase();
          let images = [];
          if (["jpg", "jpeg", "png"].includes(extension) || (extension === "pdf" && text.trim().length < 250)) {
            try {
              images = await readResumeImages(row.file);
            } catch (imageError) {
              if (!text.trim()) throw imageError;
              parseNote = "Page image processing failed; parsing the selectable resume text instead.";
            }
          }
          if (!text.trim() && !images.length) parseNote = "No readable text or supported page images found. This may be a scanned PDF over three pages; enter details manually.";
          else {
            const { data: { session } } = await supabase.auth.getSession();
            const parseResponse = await fetch("/api/parse-resume", {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token || ""}` },
              body: JSON.stringify({ organizationId, resumePath, fileName: row.file.name, contentType: row.file.type, fileSha256, text, images, fallbackFields }),
            });
            const parsed = await parseResponse.json();
            runId = parsed.runId || null;
            if (!parseResponse.ok) throw new Error(parsed.error || "AI parsing failed.");
            fields = Object.fromEntries(Object.entries(parsed.fields).map(([key, value]) => [key, value || fields[key] || (key === "skills" ? [] : "")]));
            extracted = { ...parsed.extracted, reviewConfidence: parsed.confidence, reviewEvidence: parsed.evidence };
          }
        } catch (parseError) {
          parseNote = parseError.message;
        }
        updateRow(row.id, { fields, extracted, runId, resumePath, fileSha256, state: "review", message: parseNote || "Review the AI-extracted details before saving." });
      } catch (error) {
        updateRow(row.id, { state: "error", message: error.message || "Could not process this resume." });
      }
    }
    setProcessing(false);
  }

  async function saveRow(row) {
    const { fields } = row;
    if (!fields.first_name.trim() || !fields.last_name.trim()) {
      updateRow(row.id, { message: "Enter both first and last name before saving." });
      return false;
    }
    const email = fields.email.trim().toLowerCase();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      updateRow(row.id, { message: "Enter a valid email address or clear the email field." });
      return false;
    }
    if (fields.years_experience !== "" && (!Number.isFinite(Number(fields.years_experience)) || Number(fields.years_experience) < 0 || Number(fields.years_experience) > 99)) {
      updateRow(row.id, { message: "Years of experience must be between 0 and 99." });
      return false;
    }
    const duplicate = email && (candidates.some((candidate) => candidate.email?.toLowerCase() === email)
      || rows.some((item) => item.id !== row.id && item.state !== "saved" && item.fields.email.trim().toLowerCase() === email));
    if (duplicate) {
      updateRow(row.id, { message: "This email is already in the Resume Pool or elsewhere in this batch." });
      return false;
    }

    updateRow(row.id, { state: "saving", message: "Saving candidate…" });
    const reviewedFields = { ...fields, email: email || "", years_experience: fields.years_experience === "" ? null : Number(fields.years_experience) };
    const payload = {
      organization_id: organizationId, created_by: userId,
      first_name: fields.first_name.trim(), last_name: fields.last_name.trim(), email: email || null,
      phone: fields.phone.trim() || null, location: fields.location.trim() || null,
      current_title: fields.current_title.trim() || null, current_company: fields.current_company.trim() || null,
      years_experience: fields.years_experience === "" ? null : Number(fields.years_experience),
      skills: fields.skills, source: "other", notes: "Added through bulk resume import.",
      resume_extracted_data: { ...(row.extracted || {}), ...reviewedFields, reviewedFields },
      resume_storage_path: row.resumePath, resume_drive_url: null, resume_sha256: row.fileSha256,
    };
    const { data: candidate, error } = await supabase.from("candidates").insert(payload).select("id").single();
    if (error) {
      updateRow(row.id, { state: "review", message: error.code === "23505" ? "A candidate with this email already exists." : error.message });
      return false;
    }
    if (row.runId) await supabase.from("resume_parse_runs").update({ candidate_id: candidate.id }).eq("id", row.runId);
    updateRow(row.id, { state: "saved", message: "Candidate saved to the Resume Pool." });
    onImported();
    return true;
  }

  async function handleClose() {
    if (processing) return;
    const unsaved = rows.filter((row) => row.state !== "saved" && row.resumePath && !row.runId).map((row) => row.resumePath);
    if (unsaved.length) await supabase.storage.from("candidate-resumes").remove(unsaved);
    onClose();
    setRows([]);
    setNotice("");
    setActiveIndex(0);
  }

  const current = rows[activeIndex];
  const finished = rows.filter((row) => row.state === "saved").length;
  const previewUrl = useMemo(() => current?.file.name.toLowerCase().endsWith(".pdf") ? URL.createObjectURL(current.file) : "", [current?.id]);
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  const saved = current?.state === "saved";

  return <Modal isOpen={isOpen} onClose={handleClose} title="Bulk upload and review resumes" className="max-w-[96vw] max-h-[96vh] overflow-y-auto">
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-textSecondary">Select up to 50 resumes. PDF, DOCX, and TXT text is sent to Groq for structured extraction.</p>
        <label className="cursor-pointer rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-surface">{rows.length ? "Add resumes" : "Choose resumes"}<input className="sr-only" type="file" multiple accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,image/jpeg,image/png" disabled={processing} onChange={(event) => { processFiles(event.target.files); event.target.value = ""; }} /></label>
      </div>
      {notice && <p role="alert" className="text-sm text-error">{notice}</p>}
      {processing && <p role="status" className="text-sm text-primary">Processing resumes… {rows.filter((row) => ["review", "saved", "error"].includes(row.state)).length} of {rows.length} ready.</p>}
      {current ? <>
        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-border py-2 text-sm"><p className="truncate font-medium" title={current.file.name}>{current.file.name}</p><span>{activeIndex + 1} of {rows.length} · {finished} saved</span></div>
        <div className="grid min-h-[55vh] gap-4 md:grid-cols-2">
          <section className="overflow-y-auto rounded-lg border border-border p-4" aria-label="Candidate details">
            <h3 className="mb-1 font-semibold">Candidate details</h3><p className="mb-4 text-xs text-textSecondary">Check each suggestion against the resume before saving.</p>
            {current.state === "processing" || current.state === "queued" ? <p role="status" className="text-sm text-textSecondary">{current.message}</p> : <>
              <div className="grid gap-3 sm:grid-cols-2">
                {FIELD_LABELS.map(([key, label]) => <label className="text-xs font-medium" key={key}>{label}{current.extracted?.reviewConfidence?.[key] != null && <span className="float-right text-textSecondary">AI {Math.round(current.extracted.reviewConfidence[key] * 100)}%</span>}<input disabled={saved} className="mt-1 w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm disabled:opacity-60" type={key === "email" ? "email" : key === "years_experience" ? "number" : "text"} min={key === "years_experience" ? "0" : undefined} max={key === "years_experience" ? "99" : undefined} step={key === "years_experience" ? "0.5" : undefined} value={current.fields[key]} onChange={(event) => updateRow(current.id, { fields: { ...current.fields, [key]: event.target.value } })} />{current.extracted?.reviewEvidence?.[key] && <span className="mt-1 block font-normal text-textSecondary">Resume: {current.extracted.reviewEvidence[key]}</span>}</label>)}
                <label className="text-xs font-medium sm:col-span-2">Skills<input disabled={saved} className="mt-1 w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm disabled:opacity-60" value={current.fields.skills.join(", ")} onChange={(event) => updateRow(current.id, { fields: { ...current.fields, skills: event.target.value.split(",").map((skill) => skill.trim()).filter(Boolean) } })} /></label>
                <label className="text-xs font-medium sm:col-span-2">Professional summary<textarea disabled={saved} className="mt-1 min-h-20 w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm disabled:opacity-60" value={current.fields.professional_summary} onChange={(event) => updateRow(current.id, { fields: { ...current.fields, professional_summary: event.target.value } })} /></label>
                <label className="text-xs font-medium sm:col-span-2">Other extracted details<textarea disabled={saved} className="mt-1 min-h-32 w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm disabled:opacity-60" value={current.fields.additional_details} onChange={(event) => updateRow(current.id, { fields: { ...current.fields, additional_details: event.target.value } })} placeholder="Education, work history, certifications, languages, projects…" /></label>
              </div>
              <p role="status" className={`mt-3 text-xs ${current.state === "error" ? "text-error" : "text-textSecondary"}`}>{current.message}</p>
            </>}
          </section>
          <section className="flex min-h-[55vh] flex-col overflow-hidden rounded-lg border border-border" aria-label="Resume preview">
            <div className="flex items-center justify-between border-b border-border px-3 py-2"><h3 className="text-sm font-semibold">Resume</h3>{!previewUrl && current.resumePath && <Button size="sm" variant="outline" onClick={async () => { try { await openCandidateResume(current.resumePath); } catch (error) { updateRow(current.id, { message: error.message || "Could not open this resume." }); } }}>Open resume</Button>}</div>
            {previewUrl ? <iframe className="min-h-0 flex-1 bg-surface" src={previewUrl} title={`Resume preview: ${current.file.name}`} /> : <div className="grid flex-1 place-items-center p-6 text-center text-sm text-textSecondary">{current.file.name.toLowerCase().endsWith(".pdf") ? "Resume preview is loading…" : "DOC/DOCX preview is not available here. Use Open resume to view it in a new tab."}</div>}
          </section>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2"><Button variant="outline" disabled={activeIndex === 0 || processing} onClick={() => setActiveIndex((index) => index - 1)}>Previous</Button><Button variant="outline" disabled={activeIndex >= rows.length - 1 || processing} onClick={() => { if (!saved) updateRow(current.id, { skipped: true }); setActiveIndex((index) => index + 1); }}>Skip for now</Button><Button variant="outline" disabled={activeIndex >= rows.length - 1 || processing} onClick={() => setActiveIndex((index) => index + 1)}>Next</Button></div>
          <div className="flex gap-2"><span className="self-center text-xs text-textSecondary">{finished} saved · {rows.filter((row) => row.skipped && row.state !== "saved").length} skipped</span><Button disabled={saved || current.state !== "review" || processing} onClick={async () => { if (await saveRow(current) && activeIndex < rows.length - 1) setActiveIndex((index) => index + 1); }}>{saved ? "Saved" : activeIndex < rows.length - 1 ? "Save candidate & next" : "Save candidate"}</Button></div>
        </div>
      </> : <div className="grid min-h-[45vh] place-items-center rounded-lg border border-dashed border-border p-8 text-center"><p className="text-sm text-textSecondary">Choose multiple resumes to upload, parse, and review them one at a time. Each file can be up to 10 MB. Scanned PDFs need manual entry.</p></div>}
      <div className="flex justify-end"><Button variant="outline" disabled={processing} onClick={handleClose}>Close batch</Button></div>
    </div>
  </Modal>;
}
