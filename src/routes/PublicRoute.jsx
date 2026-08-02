import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "./routeConstants";

const isAuthenticated = true;

export default function PublicRoute() {
  if (isAuthenticated) {
    return <Navigate replace to={ROUTES.DASHBOARD} />;
  }

  return <Outlet />;
}
