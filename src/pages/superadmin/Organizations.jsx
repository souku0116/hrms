import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/supabaseClient";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { PageHeader } from "@/components/superadmin";
import { ROUTES } from "@/routes/routeConstants";

const emptyForm = { name: "", adminEmail: "", firstName: "", lastName: "" };

export default function Organizations() {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadOrganizations = useCallback(async () => {
    setLoading(true);
    const { data, error: queryError } = await supabase.from("organizations").select("id,name,slug,status,created_at").order("created_at", { ascending: false });
    setError(queryError?.message || "");
    setOrganizations(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadOrganizations(); }, [loadOrganizations]);

  async function createOrganization(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const slug = form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { data: organization, error: insertError } = await supabase
      .from("organizations").insert({ name: form.name.trim(), slug }).select("id").single();
    if (insertError) {
      setError(insertError.message);
      setBusy(false);
      return;
    }
    const { data: sessionData } = await supabase.auth.getSession();
    try {
      const inviteResponse = await fetch("/api/invite-member", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionData.session?.access_token || ""}` },
        body: JSON.stringify({ organizationId: organization.id, email: form.adminEmail, firstName: form.firstName, lastName: form.lastName, role: "admin" }),
      });
      const isJson = inviteResponse.headers.get("content-type")?.includes("application/json");
      const inviteResult = isJson ? await inviteResponse.json() : {};
      if (!inviteResponse.ok || !isJson) {
        setError(`Organization created. Admin invitation was not confirmed: ${inviteResult.error || "Run this action through Vercel's API-enabled local server or deployment."}`);
      } else setNotice(`Organization created. ${inviteResult.message || "Administrator invitation sent."}`);
    } catch {
      setError("Organization created, but the admin invitation service could not be reached. Retry from the organization detail page.");
    }
    setBusy(false);
    setIsOpen(false);
    setForm(emptyForm);
    await loadOrganizations();
  }

  async function toggleStatus(org) {
    const nextStatus = org.status === "active" ? "suspended" : "active";
    const { error: updateError } = await supabase.from("organizations").update({ status: nextStatus }).eq("id", org.id);
    if (updateError) setError(updateError.message);
    else await loadOrganizations();
  }

  return (
    <div>
      <PageHeader title="Organizations" subtitle="Create and manage WorkSync customer organizations." actions={<Button onClick={() => setIsOpen(true)}>Add organization</Button>} />
      <main className="mx-auto max-w-7xl space-y-5 p-6 md:p-8">
        {notice && <p className="rounded-md bg-success/10 p-3 text-sm text-success" role="status">{notice}</p>}
        {error && <p className="rounded-md bg-error/10 p-3 text-sm text-error" role="alert">{error}</p>}
        <div className="overflow-x-auto rounded-xl border border-border bg-background">
          <table className="w-full text-left text-sm"><thead className="bg-surface text-textSecondary"><tr><th className="p-4">Organization</th><th className="p-4">Slug</th><th className="p-4">Status</th><th className="p-4">Created</th><th className="p-4">Actions</th></tr></thead>
            <tbody className="divide-y divide-border">{loading ? <tr><td className="p-6" colSpan="5">Loading organizations…</td></tr> : organizations.length === 0 ? <tr><td className="p-6 text-textSecondary" colSpan="5">No organizations yet. Add the first organization to get started.</td></tr> : organizations.map((org) => <tr key={org.id}><td className="p-4 font-medium">{org.name}</td><td className="p-4 text-textSecondary">{org.slug}</td><td className="p-4 capitalize">{org.status}</td><td className="p-4">{new Date(org.created_at).toLocaleDateString()}</td><td className="flex gap-3 p-4"><Link className="text-primary hover:underline" to={ROUTES.SUPERADMIN_ORGANIZATION_DETAIL.replace(":id", org.id)}>View</Link><button className="text-primary hover:underline" onClick={() => toggleStatus(org)}>{org.status === "active" ? "Suspend" : "Activate"}</button></td></tr>)}</tbody>
          </table>
        </div>
      </main>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create organization">
        <form className="space-y-4" onSubmit={createOrganization}>
          <Input label="Organization name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Administrator email" type="email" required value={form.adminEmail} onChange={(e) => setForm({ ...form, adminEmail: e.target.value })} />
          <div className="grid gap-3 sm:grid-cols-2"><Input label="Admin first name" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /><Input label="Admin last name" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
          <p className="text-sm text-textSecondary">The administrator will receive a Supabase invitation email.</p>
          <Button type="submit" disabled={busy || !user}>{busy ? "Creating…" : "Create and invite admin"}</Button>
        </form>
      </Modal>
    </div>
  );
}
