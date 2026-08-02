import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "./routeConstants";

const isAuthenticated = true;

export default function PrivateRoute() {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to={ROUTES.LOGIN} />;
  }

  return <Outlet />;
}
