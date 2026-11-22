import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/superadmin";

export default function SuperadminProfile() {
  const { user, profile } = useAuth();
  return <div><PageHeader title="My profile" subtitle="Signed-in platform administrator account." /><main className="mx-auto max-w-3xl p-6 md:p-8"><dl className="grid gap-5 rounded-xl border border-border bg-background p-6 sm:grid-cols-2"><div><dt className="text-sm text-textSecondary">Name</dt><dd>{[profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Not provided"}</dd></div><div><dt className="text-sm text-textSecondary">Email</dt><dd>{profile?.email || user?.email}</dd></div><div><dt className="text-sm text-textSecondary">Role</dt><dd className="capitalize">{profile?.role}</dd></div><div><dt className="text-sm text-textSecondary">Status</dt><dd className="capitalize">{profile?.status}</dd></div></dl></main></div>;
}
