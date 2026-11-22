import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/routes/routeConstants";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ForgotPassword() {
  const { requestPasswordReset, updatePassword, isRecoverySession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const result = isRecoverySession
      ? await updatePassword(password)
      : await requestPasswordReset(email);
    setBusy(false);
    if (result.error) setError(result.error.message);
    else setMessage(isRecoverySession ? "Password updated. You are signed in with your new password." : "If an account exists for that email, a password reset link has been sent.");
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6 px-5 py-12">
      <div><h1 className="text-3xl font-bold text-textPrimary">{isRecoverySession ? "Choose a new password" : "Reset your password"}</h1><p className="mt-2 text-textSecondary">{isRecoverySession ? "Set a new password for your account." : "We’ll email you a secure password reset link."}</p></div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {isRecoverySession ? <label className="block text-sm font-medium">New password<Input required minLength={8} type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label> : <label className="block text-sm font-medium">Email<Input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>}
        {error && <p role="alert" className="text-sm text-error">{error}</p>}
        {message && <p role="status" className="text-sm text-success">{message}</p>}
        <Button disabled={busy} type="submit" className="w-full">{busy ? "Please wait…" : isRecoverySession ? "Update password" : "Send reset link"}</Button>
      </form>
      <p className="text-center text-sm"><Link className="text-primary hover:underline" to={ROUTES.LOGIN}>Back to sign in</Link></p>
    </div>
  );
}
