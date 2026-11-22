import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "./routeConstants";

export default function RecruiterRoute() {
  const location = useLocation();
  const { isAuthenticated, loading, profile, role } = useAuth();

  if (loading) return <div className="p-10 text-center" role="status">Loading your workspace…</div>;
  if (!isAuthenticated) return <Navigate replace state={{ from: location }} to={ROUTES.LOGIN} />;
  if (!profile) return <Navigate replace to={ROUTES.LOGIN_ERROR} />;
  if (["inactive", "suspended"].includes(String(profile.status).toLowerCase())) {
    return <Navigate replace to={ROUTES.ACCOUNT_DISABLED} />;
  }
  if (profile.membership_status !== "active") return <Navigate replace to={ROUTES.ACCOUNT_DISABLED} />;
  if (!(["recruiter", "admin"].includes(role))) return <Navigate replace to={ROUTES.UNAUTHORIZED} />;
  if (!profile.organization_id) return <Navigate replace to={ROUTES.UNAUTHORIZED} />;
  return <Outlet />;
}
