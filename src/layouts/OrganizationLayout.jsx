import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/routes/routeConstants";

export default function OrganizationLayout() {
  const { role, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const isAdmin = role === "admin";
  const links = [
    { label: "Overview", to: isAdmin ? ROUTES.ADMIN : ROUTES.REQUISITIONS },
    { label: "Requisitions", to: ROUTES.REQUISITIONS },
    { label: "Resume Pool", to: ROUTES.RESUME_POOL },
    ...(isAdmin ? [
      { label: "Departments", to: ROUTES.ADMIN_DEPARTMENTS },
      { label: "Locations", to: ROUTES.ADMIN_LOCATIONS },
      { label: "Team", to: ROUTES.ADMIN_MEMBERS },
    ] : []),
  ];

  async function handleSignOut() {
    await signOut();
    navigate(ROUTES.LOGIN, { replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <Link className="font-bold text-primary" to={isAdmin ? ROUTES.ADMIN : ROUTES.REQUISITIONS}>WorkSync</Link>
            <p className="text-sm text-textSecondary">{profile?.organization?.name || "Organization workspace"}</p>
          </div>
          <nav aria-label="Organization workspace" className="flex flex-wrap items-center gap-2">
            {links.map((link) => <Link key={link.to} className="rounded-md px-3 py-2 text-sm text-textSecondary hover:bg-background hover:text-textPrimary" to={link.to}>{link.label}</Link>)}
            <Button onClick={handleSignOut} size="sm" variant="outline">Sign out</Button>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
