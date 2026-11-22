import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/supabaseClient";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { PageHeader } from "@/components/superadmin";

export default function OrganizationSetup({ type }) {
  const { profile, user } = useAuth();
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [workMode, setWorkMode] = useState("onsite");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const table = type === "departments" ? "departments" : "locations";
  const title = type === "departments" ? "Departments" : "Locations";

  const load = useCallback(async () => {
    if (!profile?.organization_id) { setLoading(false); return; }
    setLoading(true);
    const { data, error: queryError } = await supabase.from(table).select("*").eq("organization_id", profile.organization_id).order("name");
    setRows(data || []);
    setError(queryError?.message || "");
    setLoading(false);
  }, [profile?.organization_id, table]);
  useEffect(() => { load(); }, [load]);

  async function add(event) {
    event.preventDefault();
    setBusy(true);
    const payload = { organization_id: profile.organization_id, name: name.trim(), created_by: user.id };
    if (type === "locations") Object.assign(payload, { city: city.trim() || null, country: country.trim() || null, work_mode: workMode });
    const { error: insertError } = await supabase.from(table).insert(payload);
    if (insertError) setError(insertError.message);
    else { setName(""); setCity(""); setCountry(""); setError(""); await load(); }
    setBusy(false);
  }

  async function toggle(row) {
    const { error: updateError } = await supabase.from(table).update({ status: row.status === "active" ? "inactive" : "active" }).eq("id", row.id);
    if (updateError) setError(updateError.message); else await load();
  }

  return <div><PageHeader title={title} subtitle={`Manage ${title.toLowerCase()} available to your hiring team.`} />
    <main className="mx-auto grid max-w-6xl gap-6 p-6 md:grid-cols-[minmax(0,1fr)_20rem] md:p-8">
      <section className="rounded-xl border border-border bg-background">
        <h2 className="border-b border-border p-4 font-semibold">Current {title.toLowerCase()}</h2>
        {loading ? <p className="p-5 text-textSecondary">Loading…</p> : rows.length === 0 ? <p className="p-5 text-textSecondary">No {title.toLowerCase()} have been added yet.</p> : <ul className="divide-y divide-border">{rows.map((row) => <li className="flex items-center justify-between gap-4 p-4" key={row.id}><span><strong>{row.name}</strong>{type === "locations" && <span className="ml-2 text-sm text-textSecondary">{[row.city, row.country, row.work_mode].filter(Boolean).join(" · ")}</span>}<span className="ml-2 text-xs capitalize text-textSecondary">{row.status}</span></span><button className="text-sm text-primary hover:underline" onClick={() => toggle(row)}>{row.status === "active" ? "Deactivate" : "Activate"}</button></li>)}</ul>}
      </section>
      <form className="h-fit space-y-4 rounded-xl border border-border bg-background p-5" onSubmit={add}>
        <h2 className="font-semibold">Add {type === "departments" ? "department" : "location"}</h2>
        <Input label="Name" required value={name} onChange={(e) => setName(e.target.value)} />
        {type === "locations" && <><Input label="City" value={city} onChange={(e) => setCity(e.target.value)} /><Input label="Country" value={country} onChange={(e) => setCountry(e.target.value)} /><Select label="Work mode" value={workMode} onChange={(e) => setWorkMode(e.target.value)}><option value="onsite">On-site</option><option value="hybrid">Hybrid</option><option value="remote">Remote</option></Select></>}
        {error && <p className="text-sm text-error" role="alert">{error}</p>}
        <Button disabled={busy || !profile?.organization_id} type="submit">{busy ? "Saving…" : "Add"}</Button>
      </form>
    </main>
  </div>;
}
