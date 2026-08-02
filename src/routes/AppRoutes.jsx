import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PageFallback from "@/components/common/PageFallback";
import AppLayout from "@/components/layout/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import LayoutRoute from "./LayoutRoute";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import { ROUTES } from "./routeConstants";

const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Signup = lazy(() => import("@/pages/auth/Signup"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Jobs = lazy(() => import("@/pages/dashboard/Jobs"));
const JobDetails = lazy(() => import("@/pages/dashboard/JobDetails"));
const Companies = lazy(() => import("@/pages/dashboard/Companies"));
const CompanyDetails = lazy(() => import("@/pages/dashboard/CompanyDetails"));
const Profile = lazy(() => import("@/pages/dashboard/Profile"));
const Settings = lazy(() => import("@/pages/dashboard/Settings"));
const NotFound = lazy(() => import("@/pages/dashboard/NotFound"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
        </Route>

        <Route element={<PublicRoute />}>
          <Route element={<LayoutRoute layout={AuthLayout} />}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.SIGNUP} element={<Signup />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          </Route>
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<LayoutRoute layout={DashboardLayout} />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.JOBS} element={<Jobs />} />
            <Route path={ROUTES.JOB_DETAILS} element={<JobDetails />} />
            <Route path={ROUTES.COMPANIES} element={<Companies />} />
            <Route path={ROUTES.COMPANY_DETAILS} element={<CompanyDetails />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
          </Route>
        </Route>

        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
