import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Building2,
  FileText,
  LayoutDashboard,
  LogOut,
  MapPin,
  Users,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/routes/routeConstants";

export default function OrganizationLayout() {
  const { role, profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = role === "admin";

  const overviewPath = isAdmin ? ROUTES.ADMIN : ROUTES.RECRUITER;

  const links = [
    { label: "Overview", to: overviewPath, icon: LayoutDashboard },
    { label: "Requisitions", to: ROUTES.REQUISITIONS, icon: Briefcase },
    { label: "Resume Pool", to: ROUTES.RESUME_POOL, icon: FileText },
    ...(isAdmin
      ? [
          { label: "Departments", to: ROUTES.ADMIN_DEPARTMENTS, icon: Building2 },
          { label: "Locations", to: ROUTES.ADMIN_LOCATIONS, icon: MapPin },
          { label: "Team", to: ROUTES.ADMIN_MEMBERS, icon: Users },
        ]
      : []),
  ];

  async function handleSignOut() {
    await signOut();
    navigate(ROUTES.LOGIN, { replace: true });
  }

  const userInitials =
    [profile?.first_name?.[0], profile?.last_name?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "U";
  const fullName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "User";

  const rawOrg = profile?.organization?.name || "Workspace";
  const cleanedOrg = rawOrg
    .replace(/(?:^|\s*[-–(]?)\s*demo\s*[)-]?/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const displayOrgName =
    cleanedOrg.toLowerCase() === "worksynchr" || cleanedOrg.toLowerCase() === "worksync hr"
      ? "WorkSync HR"
      : cleanedOrg || "WorkSync HR";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-3">
            <Link
              className="flex items-center gap-2 font-heading text-lg font-bold text-primary hover:opacity-90 transition-opacity"
              to={overviewPath}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-white shadow-xs">
                W
              </span>
              <span>WorkSync</span>
            </Link>
            <span className="h-4 w-px bg-border hidden sm:inline" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-semibold text-textPrimary truncate max-w-[180px]">
                {displayOrgName}
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary capitalize">
                {role}
              </span>
            </div>
          </div>

          <nav aria-label="Organization workspace" className="flex items-center gap-1.5 sm:gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.to === overviewPath
                  ? location.pathname === link.to ||
                    (isAdmin && location.pathname === ROUTES.ADMIN) ||
                    (!isAdmin && location.pathname === ROUTES.RECRUITER)
                  : location.pathname.startsWith(link.to);

              return (
                <Link
                  key={link.to}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "text-textSecondary hover:bg-background hover:text-textPrimary"
                  }`}
                  to={link.to}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-right">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {userInitials}
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold text-textPrimary leading-none">{fullName}</p>
                <p className="text-[10px] text-textSecondary mt-0.5 truncate max-w-[130px]">
                  {profile?.email || user?.email}
                </p>
              </div>
            </div>

            <Button
              onClick={handleSignOut}
              size="sm"
              variant="outline"
              className="flex items-center gap-1.5 text-xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
