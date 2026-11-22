import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/supabaseClient";
import { ROUTES } from "@/routes/routeConstants";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function RequisitionForm() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({ title: "", department_id: "", location_id: "", openings: "1", employment_type: "full_time", work_mode: "onsite", salary_min: "", salary_max: "", currency: "USD", description: "", responsibilities: "", qualifications: "", justification: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!profile?.organization_id) return;
    Promise.all([
      supabase.from("departments").select("id,name").eq("organization_id", profile.organization_id).eq("status", "active").order("name"),
      supabase.from("locations").select("id,name").eq("organization_id", profile.organization_id).eq("status", "active").order("name"),
      ...(id ? [supabase.from("requisitions").select("*").eq("id", id).eq("organization_id", profile.organization_id).single()] : []),
    ]).then((results) => {
      const [depts, locs, existing] = results;
      setDepartments(depts.data || []); setLocations(locs.data || []);
      if (existing?.data) setForm((current) => ({ ...current, ...existing.data, department_id: existing.data.department_id || "", location_id: existing.data.location_id || "", salary_min: existing.data.salary_min ?? "", salary_max: existing.data.salary_max ?? "" }));
      if (existing?.error) setError(existing.error.message);
    });
  }, [profile?.organization_id, id]);

  function change(event) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })); }

  async function save(event) {
    event.preventDefault(); setBusy(true); setError("");
    const payload = {
      organization_id: profile.organization_id, title: form.title.trim(),
      department_id: form.department_id || null, location_id: form.location_id || null,
      openings: Number(form.openings), employment_type: form.employment_type, work_mode: form.work_mode,
      salary_min: form.salary_min ? Number(form.salary_min) : null,
      salary_max: form.salary_max ? Number(form.salary_max) : null,
      currency: form.currency.trim().toUpperCase(), description: form.description.trim() || null,
      responsibilities: form.responsibilities.trim() || null, qualifications: form.qualifications.trim() || null,
      justification: form.justification.trim() || null, recruiter_id: user.id, created_by: user.id,
    };
    if (id) {
      delete payload.organization_id;
      delete payload.created_by;
      delete payload.recruiter_id;
    }
    const result = id
      ? await supabase.from("requisitions").update(payload).eq("id", id).eq("organization_id", profile.organization_id).select("id").single()
      : await supabase.from("requisitions").insert(payload).select("id").single();
    if (result.error) { setError(result.error.message); setBusy(false); return; }
    navigate(ROUTES.REQUISITION_DETAIL.replace(":id", result.data.id));
  }

  return <main className="mx-auto max-w-4xl space-y-6 p-6 md:p-8">
    <div><Link className="text-sm text-primary hover:underline" to={ROUTES.REQUISITIONS}>← Requisitions</Link><h1 className="mt-3 text-3xl font-bold">{id ? "Edit requisition" : "New requisition"}</h1><p className="mt-1 text-textSecondary">Save as a draft, then submit it for approval.</p></div>
    <form className="grid gap-5 rounded-xl border border-border bg-background p-6 md:grid-cols-2" onSubmit={save}>
      <Input className="md:col-span-2" label="Job title" name="title" required value={form.title} onChange={change} />
      <Select label="Department" name="department_id" value={form.department_id} onChange={change}><option value="">Unassigned</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select>
      <Select label="Location" name="location_id" value={form.location_id} onChange={change}><option value="">Unassigned</option>{locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</Select>
      <Input label="Number of openings" name="openings" type="number" min="1" required value={form.openings} onChange={change} />
      <Select label="Employment type" name="employment_type" value={form.employment_type} onChange={change}><option value="full_time">Full-time</option><option value="part_time">Part-time</option><option value="contract">Contract</option><option value="temporary">Temporary</option><option value="internship">Internship</option></Select>
      <Select label="Work mode" name="work_mode" value={form.work_mode} onChange={change}><option value="onsite">On-site</option><option value="hybrid">Hybrid</option><option value="remote">Remote</option></Select>
      <Input label="Minimum salary" name="salary_min" type="number" min="0" step="0.01" value={form.salary_min} onChange={change} />
      <Input label="Maximum salary" name="salary_max" type="number" min="0" step="0.01" value={form.salary_max} onChange={change} />
      <Input label="Currency code" name="currency" maxLength="3" required value={form.currency} onChange={change} />
      <label className="block text-sm font-medium md:col-span-2">Job description<textarea className="mt-1 min-h-24 w-full rounded-md border border-border bg-background p-3" name="description" value={form.description} onChange={change} /></label>
      <label className="block text-sm font-medium md:col-span-2">Responsibilities<textarea className="mt-1 min-h-24 w-full rounded-md border border-border bg-background p-3" name="responsibilities" value={form.responsibilities} onChange={change} /></label>
      <label className="block text-sm font-medium md:col-span-2">Qualifications<textarea className="mt-1 min-h-24 w-full rounded-md border border-border bg-background p-3" name="qualifications" value={form.qualifications} onChange={change} /></label>
      <label className="block text-sm font-medium md:col-span-2">Hiring justification<textarea className="mt-1 min-h-20 w-full rounded-md border border-border bg-background p-3" name="justification" value={form.justification} onChange={change} /></label>
      {error && <p className="text-sm text-error md:col-span-2" role="alert">{error}</p>}
      <div className="flex gap-3 md:col-span-2"><Button disabled={busy} type="submit">{busy ? "Saving…" : "Save draft"}</Button><Button href={ROUTES.REQUISITIONS} variant="outline">Cancel</Button></div>
    </form>
  </main>;
}
