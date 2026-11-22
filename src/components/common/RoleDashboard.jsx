import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

const roleLabels = {
  user: "Employee",
  admin: "Organization admin",
  superadmin: "Platform superadmin",
};

export default function RoleDashboard({ role }) {
  const { user, profile, signOut } = useAuth();
  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ");

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center px-6 py-12">
      <section className="w-full rounded-2xl border border-border bg-surface p-8 shadow-sm md:p-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">WorkSync</p>
        <h1 className="mt-3 text-3xl font-bold text-textPrimary">{roleLabels[role]} dashboard</h1>
        <p className="mt-2 text-textSecondary">Your account is ready. Dashboard features will be added here.</p>
        <dl className="mt-8 grid gap-4 rounded-xl border border-border bg-background p-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-textSecondary">Name</dt>
            <dd className="mt-1 font-medium text-textPrimary">{name || "Not provided"}</dd>
          </div>
          <div>
            <dt className="text-sm text-textSecondary">Email</dt>
            <dd className="mt-1 break-all font-medium text-textPrimary">{profile?.email || user?.email || "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-textSecondary">Account type</dt>
            <dd className="mt-1 font-medium capitalize text-textPrimary">{role}</dd>
          </div>
          <div>
            <dt className="text-sm text-textSecondary">Account status</dt>
            <dd className="mt-1 font-medium capitalize text-textPrimary">{profile?.status || "—"}</dd>
          </div>
        </dl>
        <Button className="mt-8" onClick={signOut}>Sign out</Button>
      </section>
    </main>
  );
}
