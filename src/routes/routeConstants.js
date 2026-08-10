export const ROUTES = {
  // Auth routes
  LOGIN: "/login",
  LOGIN_ERROR: "/login-error",
  WRONG_ROLE: "/wrong-role",
  ACCOUNT_DISABLED: "/account-disabled",
  UNAUTHORIZED: "/unauthorized",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  // User dashboard routes
  DASHBOARD: "/dashboard",
  JOBS: "/jobs",
  JOB_DETAILS: "/jobs/:id",
  COMPANIES: "/companies",
  COMPANY_DETAILS: "/companies/:id",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  // Admin routes
  ADMIN: "/admin",
  // Superadmin routes
  SUPERADMIN: "/superadmin",
  SUPERADMIN_ORGANIZATIONS: "/superadmin/organizations",
  SUPERADMIN_ORGANIZATION_DETAIL: "/superadmin/organizations/:id",
  SUPERADMIN_USERS: "/superadmin/users",
  SUPERADMIN_AUDIT_LOGS: "/superadmin/audit-logs",
  SUPERADMIN_SETTINGS: "/superadmin/settings",
  NOT_FOUND: "*",
};
