import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/routes/routeConstants";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    const { data, error: signupError } = await signUp(form);
    setBusy(false);
    if (signupError) setError(signupError.message);
    else if (data?.session) navigate(ROUTES.DASHBOARD, { replace: true });
    else setMessage("Check your email to confirm your account, then sign in.");
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6 px-5 py-12">
      <div><h1 className="text-3xl font-bold text-textPrimary">Create an account</h1><p className="mt-2 text-textSecondary">New accounts start with the employee role. An administrator can grant elevated access.</p></div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium">First name<Input required autoComplete="given-name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></label>
        <label className="block text-sm font-medium">Last name<Input required autoComplete="family-name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></label>
        <label className="block text-sm font-medium">Email<Input required type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label className="block text-sm font-medium">Password<Input required type="password" minLength={8} autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        {error && <p role="alert" className="text-sm text-error">{error}</p>}
        {message && <p role="status" className="text-sm text-success">{message}</p>}
        <Button disabled={busy} type="submit" className="w-full">{busy ? "Creating account…" : "Create account"}</Button>
      </form>
      <p className="text-center text-sm text-textSecondary">Already have an account? <Link className="text-primary hover:underline" to={ROUTES.LOGIN}>Sign in</Link></p>
    </div>
  );
}
