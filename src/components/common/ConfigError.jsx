const REQUIRED_ENV = [
  {
    name: "VITE_SUPABASE_URL",
    hint: "Supabase project URL (Settings → API → Project URL)",
  },
  {
    name: "VITE_SUPABASE_ANON_KEY",
    hint: "Supabase anon/public key (Settings → API → anon public)",
  },
];

/** Shown when required browser env vars are missing at runtime. */
export default function ConfigError() {
  const missing = REQUIRED_ENV.filter(({ name }) => !import.meta.env[name]?.trim());
  const isVercel = typeof window !== "undefined" && window.location.hostname.includes("vercel.app");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Configuration required</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">WorkSync HR cannot start yet</h1>
        <p className="mt-3 text-slate-600">
          The app builds, but required Supabase settings were not available when this deployment was
          created.
        </p>

        <ul className="mt-6 space-y-3">
          {missing.map(({ name, hint }) => (
            <li key={name} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <code className="text-sm font-semibold text-slate-900">{name}</code>
              <p className="mt-1 text-sm text-slate-600">{hint}</p>
            </li>
          ))}
        </ul>

        {isVercel ? (
          <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-slate-700">
            <li>Open your Vercel project → Settings → Environment Variables.</li>
            <li>Add the variables above for Production and Preview.</li>
            <li>Redeploy the latest commit (Deployments → Redeploy).</li>
          </ol>
        ) : (
          <p className="mt-6 text-sm text-slate-700">
            Copy <code className="rounded bg-slate-100 px-1.5 py-0.5">.env.example</code> to{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5">.env.local</code>, fill in the
            values, then restart the dev server.
          </p>
        )}
      </div>
    </div>
  );
}
