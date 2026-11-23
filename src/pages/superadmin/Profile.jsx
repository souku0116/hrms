import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Key,
  Lock,
  Mail,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/supabaseClient";

export default function SuperadminProfile() {
  const { user, profile } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
    }
  }, [profile]);

  async function handleUpdateProfile(e) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setNotice("");
    setError("");

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;
      setNotice("Personal profile details successfully updated.");
    } catch (err) {
      setError(err.message || "Failed to update profile details.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordReset() {
    const email = profile?.email || user?.email;
    if (!email) return;
    setResettingPassword(true);
    setNotice("");
    setError("");

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (resetError) throw resetError;
      setNotice(`Password reset link dispatched to ${email}. Check your inbox.`);
    } catch (err) {
      setError(err.message || "Failed to send password reset email.");
    } finally {
      setResettingPassword(false);
    }
  }

  function copyUserId() {
    if (!user?.id) return;
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const email = profile?.email || user?.email || "—";
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Superadmin";
  const initial =
    firstName?.[0]?.toUpperCase() ||
    lastName?.[0]?.toUpperCase() ||
    email?.[0]?.toUpperCase() ||
    "S";

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs text-textSecondary">
          <span>WorkSync Platform</span>
          <span>/</span>
          <span className="font-semibold text-primary">Account Profile</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-textPrimary">
          My Administrator Profile
        </h1>
        <p className="text-sm text-textSecondary">
          Platform credentials, authentication security, and personal profile details.
        </p>
      </div>

      {/* Profile Overview Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-surface/50 p-6 shadow-xs md:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-black text-white shadow-sm">
              {initial}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-textPrimary">
                  {fullName}
                </h2>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary capitalize">
                  {profile?.role || "superadmin"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 capitalize">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {profile?.status || "active"}
                </span>
              </div>
              <p className="mt-1 text-xs text-textSecondary font-mono">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-textSecondary shadow-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Full Platform Clearance</span>
            </span>
          </div>
        </div>
      </section>

      {/* Notifications */}
      {notice && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{notice}</span>
          </div>
          <button
            onClick={() => setNotice("")}
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

      {/* Main Grid: Personal Info & Security Cards */}
      <section className="grid gap-8 lg:grid-cols-2">
        {/* Left Column: Personal Information Form */}
        <form
          onSubmit={handleUpdateProfile}
          className="space-y-5 rounded-2xl border border-border bg-background p-6 shadow-xs text-xs"
        >
          <div className="border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <h3 className="text-base font-bold text-textPrimary">Personal Information</h3>
            </div>
            <p className="mt-0.5 text-textSecondary">
              Update the name associated with your platform superadmin identity.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="First Name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              label="Last Name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <Input
            label="Email Address"
            disabled
            value={email}
            description="Email address is managed through Supabase Authentication."
          />

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 font-semibold"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{saving ? "Saving Changes…" : "Save Profile"}</span>
            </Button>
          </div>
        </form>

        {/* Right Column: Account & Security */}
        <div className="space-y-5 rounded-2xl border border-border bg-background p-6 shadow-xs text-xs">
          <div className="border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <h3 className="text-base font-bold text-textPrimary">Security & Credentials</h3>
            </div>
            <p className="mt-0.5 text-textSecondary">
              Authentication provider and account identifiers.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-textSecondary mb-1 font-medium">User Identifier (UID)</p>
              <div className="flex items-center justify-between rounded-xl border border-border bg-surface/50 p-2.5 font-mono text-[11px] text-textPrimary">
                <span className="truncate">{user?.id || "—"}</span>
                <button
                  type="button"
                  onClick={copyUserId}
                  className="ml-2 inline-flex items-center gap-1 text-primary hover:underline shrink-0"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-surface/50 p-3">
                <p className="text-textSecondary">Assigned Role</p>
                <p className="mt-1 font-bold text-textPrimary capitalize">
                  {profile?.role || "superadmin"}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface/50 p-3">
                <p className="text-textSecondary">Account Status</p>
                <p className="mt-1 font-bold text-emerald-700 capitalize">
                  {profile?.status || "active"}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border p-4 bg-surface/30 space-y-3">
              <div className="flex items-center gap-2 font-semibold text-textPrimary">
                <Key className="h-4 w-4 text-primary" />
                <span>Password Reset</span>
              </div>
              <p className="text-textSecondary">
                Send a secure password reset link to your administrator email to update your access password.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePasswordReset}
                disabled={resettingPassword}
                className="flex items-center gap-1.5"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>
                  {resettingPassword ? "Sending Reset Link…" : "Send Reset Email"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
