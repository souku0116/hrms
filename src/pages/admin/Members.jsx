import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/supabaseClient";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { PageHeader } from "@/components/superadmin";

export default function Members() {
  const { profile, user } = useAuth();
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ email: "", firstName: "", lastName: "" });
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!profile?.organization_id) { setLoading(false); return; }
    setLoading(true);
    const { data, error: queryError } = await supabase.from("organization_memberships")
      .select("id,user_id,role,status,created_at,profiles(first_name,last_name,email)")
      .eq("organization_id", profile.organization_id).order("created_at", { ascending: false });
    setMembers(data || []);
    setError(queryError?.message || "");
    setLoading(false);
  }, [profile?.organization_id]);
  useEffect(() => { load(); }, [load]);

  async function invite(event) {
    event.preventDefault();
    setBusy(true); setError(""); setMessage("");
    const { data } = await supabase.auth.getSession();
    try {
      const response = await fetch("/api/invite-member", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token || ""}` },
        body: JSON.stringify({ organizationId: profile.organization_id, email: form.email, firstName: form.firstName, lastName: form.lastName, role: "recruiter" }),
      });
      const isJson = response.headers.get("content-type")?.includes("application/json");
      const result = isJson ? await response.json() : {};
      if (!response.ok || !isJson) setError(result.error || "Invitation failed. Use the API-enabled Vercel local server or deployment.");
      else { setMessage(result.message || "Recruiter invitation sent."); setForm({ email: "", firstName: "", lastName: "" }); await load(); }
    } catch { setError("Invitation service could not be reached. Ensure the API-enabled Vercel server is running."); }
    setBusy(false);
  }

  async function setStatus(member) {
    const { error: updateError } = await supabase.from("organization_memberships")
      .update({ status: member.status === "active" ? "suspended" : "active" }).eq("id", member.id);
    if (updateError) setError(updateError.message); else await load();
  }

  return <div><PageHeader title="Team" subtitle="Manage organization administrators and recruiters." />
    <main className="mx-auto grid max-w-6xl gap-6 p-6 md:grid-cols-[minmax(0,1fr)_20rem] md:p-8">
      <section className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full text-left text-sm"><thead className="bg-surface"><tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead>
          <tbody className="divide-y divide-border">{loading ? <tr><td colSpan="5" className="p-5">Loading team…</td></tr> : members.length === 0 ? <tr><td colSpan="5" className="p-5 text-textSecondary">No team members yet.</td></tr> : members.map((member) => { const person = member.profiles || {}; return <tr key={member.id}><td className="p-4">{[person.first_name, person.last_name].filter(Boolean).join(" ") || "—"}</td><td className="p-4">{person.email || "—"}</td><td className="p-4 capitalize">{member.role.replaceAll("_", " ")}</td><td className="p-4 capitalize">{member.status}</td><td className="p-4"><button disabled={member.user_id === user?.id} className="text-primary hover:underline disabled:opacity-40" onClick={() => setStatus(member)}>{member.status === "active" ? "Suspend" : "Activate"}</button></td></tr>; })}</tbody>
        </table>
      </section>
      <form className="h-fit space-y-4 rounded-xl border border-border bg-background p-5" onSubmit={invite}>
        <h2 className="font-semibold">Invite a recruiter</h2>
        <Input label="Email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="First name" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        <Input label="Last name" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        {error && <p role="alert" className="text-sm text-error">{error}</p>}{message && <p role="status" className="text-sm text-success">{message}</p>}
        <Button disabled={busy || !profile?.organization_id} type="submit">{busy ? "Sending…" : "Send invitation"}</Button>
      </form>
    </main>
  </div>;
}
