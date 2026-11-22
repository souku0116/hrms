import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "./routeConstants";

export default function PrivateRoute({ allowedRoles = ["user"] }) {
  const location = useLocation();
  const { isAuthenticated, loading, profile, role } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to={ROUTES.LOGIN} />;
  }

  if (!profile) return <Navigate replace to={ROUTES.LOGIN_ERROR} />;
  if (["inactive", "suspended"].includes(String(profile.status).toLowerCase())) {
    return <Navigate replace to={ROUTES.ACCOUNT_DISABLED} />;
  }
  if (profile.membership_status && profile.membership_status !== "active") return <Navigate replace to={ROUTES.ACCOUNT_DISABLED} />;
  if (!allowedRoles.includes(role)) return <Navigate replace to={ROUTES.UNAUTHORIZED} />;

  return <Outlet />;
}
