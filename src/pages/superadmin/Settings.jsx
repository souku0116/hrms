import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/supabaseClient";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { PageHeader } from "@/components/superadmin";

export default function Settings() {
  const { user } = useAuth();
  const [form, setForm] = useState({ platform_name: "WorkSync", support_email: "" });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    supabase.from("platform_settings").select("setting_value").eq("setting_key", "general").maybeSingle().then(({ data, error: loadError }) => {
      if (data?.setting_value) setForm((current) => ({ ...current, ...data.setting_value }));
      setError(loadError?.message || ""); setLoading(false);
    });
  }, []);
  async function save(event) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    const { error: saveError } = await supabase.from("platform_settings").upsert({ setting_key: "general", setting_value: form, updated_by: user.id, updated_at: new Date().toISOString() });
    setError(saveError?.message || ""); if (!saveError) setMessage("Platform settings saved."); setBusy(false);
  }
  return <div><PageHeader title="Platform settings" subtitle="Settings stored in Supabase for the WorkSync platform." /><main className="mx-auto max-w-3xl p-6 md:p-8">
    <form className="space-y-5 rounded-xl border border-border bg-background p-6" onSubmit={save}><h2 className="text-lg font-semibold">General</h2>
      <Input label="Platform name" required value={form.platform_name} onChange={(e) => setForm({ ...form, platform_name: e.target.value })} />
      <Input label="Support email" type="email" value={form.support_email} onChange={(e) => setForm({ ...form, support_email: e.target.value })} />
      {loading && <p role="status" className="text-sm text-textSecondary">Loading settings…</p>}{error && <p role="alert" className="text-sm text-error">{error}</p>}{message && <p role="status" className="text-sm text-success">{message}</p>}
      <Button disabled={busy || loading} type="submit">{busy ? "Saving…" : "Save settings"}</Button>
    </form>
  </main></div>;
}
