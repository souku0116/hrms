import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PageFallback from "@/components/common/PageFallback";
import AppLayout from "@/components/layout/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import SuperadminLayout from "@/layouts/SuperadminLayout";
import LayoutRoute from "./LayoutRoute";
import PrivateRoute from "./PrivateRoute";
import SuperadminRoute from "./SuperadminRoute";
import AdminRoute from "./AdminRoute";
import RecruiterRoute from "./RecruiterRoute";
import OrganizationLayout from "@/layouts/OrganizationLayout";
import { ROUTES } from "./routeConstants";

const Home = lazy(() => import("@/pages/Landing"));
const Login = lazy(() => import("@/pages/auth/Login"));
const LoginError = lazy(() => import("@/pages/auth/LoginError"));
const WrongRole = lazy(() => import("@/pages/auth/WrongRole"));
const AccountDisabled = lazy(() => import("@/pages/auth/AccountDisabled"));
const Unauthorized = lazy(() => import("@/pages/auth/Unauthorized"));
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
const AdminDashboard = lazy(() => import("@/pages/dashboard/Admin"));

// Superadmin pages
const SuperadminDashboard = lazy(() => import("@/pages/superadmin/Dashboard"));
const Organizations = lazy(() => import("@/pages/superadmin/Organizations"));
const OrganizationDetail = lazy(() => import("@/pages/superadmin/OrganizationDetail"));
const SuperadminUsers = lazy(() => import("@/pages/superadmin/Users"));
const AuditLogs = lazy(() => import("@/pages/superadmin/AuditLogs"));
const SuperadminSettings = lazy(() => import("@/pages/superadmin/Settings"));
const SuperadminProfile = lazy(() => import("@/pages/superadmin/Profile"));
const SuperadminHelp = lazy(() => import("@/pages/superadmin/Help"));
const OrganizationSetup = lazy(() => import("@/pages/admin/OrganizationSetup"));
const OrganizationMembers = lazy(() => import("@/pages/admin/Members"));
const Requisitions = lazy(() => import("@/pages/recruiter/Requisitions"));
const RequisitionForm = lazy(() => import("@/pages/recruiter/RequisitionForm"));
const RequisitionDetail = lazy(() => import("@/pages/recruiter/RequisitionDetail"));
const ResumePool = lazy(() => import("@/pages/recruiter/ResumePool"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* Public Auth Routes */}
        <Route element={<LayoutRoute layout={AuthLayout} />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.SIGNUP} element={<Signup />} />
        </Route>

        <Route element={<LayoutRoute layout={AuthLayout} />}>
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        </Route>

        {/* Auth Error Routes (public, no auth required) */}
        <Route element={<LayoutRoute layout={AuthLayout} />}>
          <Route path={ROUTES.LOGIN_ERROR} element={<LoginError />} />
          <Route path={ROUTES.WRONG_ROLE} element={<WrongRole />} />
          <Route path={ROUTES.ACCOUNT_DISABLED} element={<AccountDisabled />} />
          <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />
        </Route>

        {/* User/Employee Dashboard Routes (protected) */}
        <Route element={<PrivateRoute allowedRoles={["user"]} />}>
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

        {/* Admin Routes (role-protected) */}
        <Route element={<AdminRoute />}>
          <Route element={<LayoutRoute layout={OrganizationLayout} />}>
            <Route path={ROUTES.ADMIN} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN_DEPARTMENTS} element={<OrganizationSetup type="departments" />} />
            <Route path={ROUTES.ADMIN_LOCATIONS} element={<OrganizationSetup type="locations" />} />
            <Route path={ROUTES.ADMIN_MEMBERS} element={<OrganizationMembers />} />
          </Route>
        </Route>

        <Route element={<RecruiterRoute />}>
          <Route element={<LayoutRoute layout={OrganizationLayout} />}>
            <Route path={ROUTES.RECRUITER} element={<Requisitions />} />
            <Route path={ROUTES.REQUISITIONS} element={<Requisitions />} />
            <Route path={ROUTES.RESUME_POOL} element={<ResumePool />} />
            <Route path={ROUTES.REQUISITION_NEW} element={<RequisitionForm />} />
            <Route path={ROUTES.REQUISITION_EDIT} element={<RequisitionForm />} />
            <Route path={ROUTES.REQUISITION_DETAIL} element={<RequisitionDetail />} />
          </Route>
        </Route>

        {/* Superadmin Routes (role-protected) */}
        <Route element={<SuperadminRoute />}>
          <Route element={<LayoutRoute layout={SuperadminLayout} />}>
            <Route path={ROUTES.SUPERADMIN} element={<SuperadminDashboard />} />
            <Route path={ROUTES.SUPERADMIN_ORGANIZATIONS} element={<Organizations />} />
            <Route path={ROUTES.SUPERADMIN_ORGANIZATION_DETAIL} element={<OrganizationDetail />} />
            <Route path={ROUTES.SUPERADMIN_USERS} element={<SuperadminUsers />} />
            <Route path={ROUTES.SUPERADMIN_AUDIT_LOGS} element={<AuditLogs />} />
            <Route path={ROUTES.SUPERADMIN_SETTINGS} element={<SuperadminSettings />} />
            <Route path={ROUTES.SUPERADMIN_PROFILE} element={<SuperadminProfile />} />
            <Route path={ROUTES.SUPERADMIN_HELP} element={<SuperadminHelp />} />
          </Route>
        </Route>

        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
