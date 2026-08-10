import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "./routeConstants";

export default function PublicRoute() {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect authenticated users to their appropriate dashboard
    if (role === "superadmin") {
      return <Navigate replace to={ROUTES.SUPERADMIN} />;
    } else if (role === "admin") {
      return <Navigate replace to={ROUTES.ADMIN} />;
    } else {
      return <Navigate replace to={ROUTES.DASHBOARD} />;
    }
  }

  return <Outlet />;
}
