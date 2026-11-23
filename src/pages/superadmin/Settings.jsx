import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Database,
  Lock,
  Save,
  Server,
  Sliders,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/supabaseClient";

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [form, setForm] = useState({
    platform_name: "WorkSync HR",
    support_email: "support@worksync.io",
    welcome_message: "Welcome to WorkSync - Workforce & Talent Hub",
    default_timezone: "UTC",
    session_timeout_minutes: "60",
    enforce_drive_links: true,
    email_on_submission: true,
    email_on_invitation: true,
    security_audit_logging: true,
  });

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase
      .from("platform_settings")
      .select("setting_value")
      .eq("setting_key", "general")
      .maybeSingle()
      .then(({ data, error: loadError }) => {
        if (data?.setting_value) {
          setForm((current) => ({ ...current, ...data.setting_value }));
        }
        setError(loadError?.message || "");
        setLoading(false);
      });
  }, []);

  async function handleSave(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    const { error: saveError } = await supabase.from("platform_settings").upsert({
      setting_key: "general",
      setting_value: form,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    });

    if (saveError) {
      setError(saveError.message);
    } else {
      setMessage("Platform settings successfully updated and saved.");
    }
    setBusy(false);
  }

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs text-textSecondary">
          <span>WorkSync Platform</span>
          <span>/</span>
          <span className="font-semibold text-primary">Settings</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-textPrimary">
          Platform Settings
        </h1>
        <p className="text-sm text-textSecondary">
          Global platform parameters, notification rules, security policies, and environment status.
        </p>
      </div>

      {/* Notifications */}
      {message && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{message}</span>
          </div>
          <button
            onClick={() => setMessage("")}
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

      {/* Main Settings Container */}
      <div className="grid gap-8 lg:grid-cols-4">
        {/* Settings Navigation Tabs (Left Sidebar) */}
        <div className="space-y-1 lg:col-span-1">
          <div className="rounded-2xl border border-border bg-background p-2 shadow-xs space-y-1">
            {[
              { id: "general", label: "General & Branding", icon: Sliders },
              { id: "security", label: "Security & Access", icon: Lock },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "system", label: "System & Health", icon: Server },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-left transition-all ${
                    active
                      ? "bg-primary text-white shadow-xs"
                      : "text-textSecondary hover:bg-surface hover:text-textPrimary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-border bg-surface/50 p-4 text-xs text-textSecondary space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-textPrimary">
              <Database className="h-3.5 w-3.5 text-primary" />
              <span>Supabase Storage</span>
            </div>
            <p>
              Settings are stored in the <code>platform_settings</code> table and synchronized across sessions.
            </p>
          </div>
        </div>

        {/* Settings Form Area (Right Content) */}
        <form
          onSubmit={handleSave}
          className="space-y-6 rounded-2xl border border-border bg-background p-6 shadow-sm lg:col-span-3 text-xs"
        >
          {activeTab === "general" && (
            <div className="space-y-5">
              <div className="border-b border-border pb-4">
                <h2 className="text-base font-bold text-textPrimary">General & Branding</h2>
                <p className="mt-0.5 text-textSecondary">
                  Configure default application identity and platform-wide defaults.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Platform Name"
                  required
                  value={form.platform_name}
                  onChange={(e) => setForm({ ...form, platform_name: e.target.value })}
                />
                <Input
                  label="Official Support Email"
                  type="email"
                  required
                  value={form.support_email}
                  onChange={(e) => setForm({ ...form, support_email: e.target.value })}
                />
              </div>

              <Input
                label="Welcome Banner Tagline"
                value={form.welcome_message}
                onChange={(e) => setForm({ ...form, welcome_message: e.target.value })}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-textPrimary mb-1">
                    Default Timezone
                  </label>
                  <select
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-textPrimary focus:border-primary focus:outline-none"
                    value={form.default_timezone}
                    onChange={(e) => setForm({ ...form, default_timezone: e.target.value })}
                  >
                    <option value="UTC">UTC (Universal Time)</option>
                    <option value="Asia/Kolkata">IST (Asia/Kolkata - UTC+5:30)</option>
                    <option value="America/New_York">EST (America/New York - UTC-5)</option>
                    <option value="Europe/London">GMT (Europe/London - UTC+0)</option>
                  </select>
                </div>

                <Input
                  label="Inactivity Session Timeout (Minutes)"
                  type="number"
                  min="15"
                  max="1440"
                  value={form.session_timeout_minutes}
                  onChange={(e) =>
                    setForm({ ...form, session_timeout_minutes: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-5">
              <div className="border-b border-border pb-4">
                <h2 className="text-base font-bold text-textPrimary">Security & Access Policies</h2>
                <p className="mt-0.5 text-textSecondary">
                  Govern role-based permissions, authentication safety, and file security.
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 rounded-xl border border-border p-4 hover:bg-surface/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.enforce_drive_links}
                    onChange={(e) =>
                      setForm({ ...form, enforce_drive_links: e.target.checked })
                    }
                    className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="font-semibold text-textPrimary">
                      Strict Google Drive URL Validation
                    </p>
                    <p className="text-textSecondary text-[11px] mt-0.5">
                      Ensure all candidate resume links must originate from verified drive.google.com or docs.google.com domains.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-xl border border-border p-4 hover:bg-surface/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.security_audit_logging}
                    onChange={(e) =>
                      setForm({ ...form, security_audit_logging: e.target.checked })
                    }
                    className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="font-semibold text-textPrimary">
                      Comprehensive Security Audit Logging
                    </p>
                    <p className="text-textSecondary text-[11px] mt-0.5">
                      Record every requisition submission, approval, rejection, and membership change into the immutable audit ledger.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-5">
              <div className="border-b border-border pb-4">
                <h2 className="text-base font-bold text-textPrimary">Automated Notification Rules</h2>
                <p className="mt-0.5 text-textSecondary">
                  Control dispatch of email notifications and transactional triggers.
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 rounded-xl border border-border p-4 hover:bg-surface/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.email_on_submission}
                    onChange={(e) =>
                      setForm({ ...form, email_on_submission: e.target.checked })
                    }
                    className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="font-semibold text-textPrimary">
                      Requisition Approval Alert Emails
                    </p>
                    <p className="text-textSecondary text-[11px] mt-0.5">
                      Notify organization administrators when a recruiter submits a requisition for review.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-xl border border-border p-4 hover:bg-surface/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.email_on_invitation}
                    onChange={(e) =>
                      setForm({ ...form, email_on_invitation: e.target.checked })
                    }
                    className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="font-semibold text-textPrimary">
                      Member Welcome Invitations
                    </p>
                    <p className="text-textSecondary text-[11px] mt-0.5">
                      Dispatch Supabase Auth activation emails whenever an administrator invites a new recruiter or manager.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="space-y-5">
              <div className="border-b border-border pb-4">
                <h2 className="text-base font-bold text-textPrimary">System Information & Health</h2>
                <p className="mt-0.5 text-textSecondary">
                  Underlying runtime, database connectivity, and platform version.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-surface/50 p-4">
                  <p className="text-textSecondary">Application Version</p>
                  <p className="mt-1 text-sm font-bold text-textPrimary font-mono">
                    v0.1.0-release (WorkSync HR)
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-surface/50 p-4">
                  <p className="text-textSecondary">Supabase Database</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-semibold text-emerald-700">
                      Connected & Healthy
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-surface/50 p-4">
                  <p className="text-textSecondary">Environment</p>
                  <p className="mt-1 text-sm font-bold text-textPrimary font-mono">
                    Production Ready (Vite + React)
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-surface/50 p-4">
                  <p className="text-textSecondary">Storage Mode</p>
                  <p className="mt-1 text-sm font-bold text-textPrimary">
                    Google Drive Cloud Storage
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-textSecondary">
              {loading ? "Loading settings…" : "Changes take effect immediately upon saving."}
            </span>
            <Button
              type="submit"
              disabled={busy || loading}
              className="flex items-center gap-2 font-semibold"
            >
              <Save className="h-4 w-4" />
              <span>{busy ? "Saving Settings…" : "Save Settings"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
