import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes/routeConstants";

/** Superadmin sidebar navigation component. */
export function SuperadminSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: ROUTES.SUPERADMIN,
    },
    {
      label: "Organizations",
      icon: Building2,
      path: ROUTES.SUPERADMIN_ORGANIZATIONS,
    },
    {
      label: "Users",
      icon: Users,
      path: ROUTES.SUPERADMIN_USERS,
    },
    {
      label: "Audit Logs",
      icon: FileText,
      path: ROUTES.SUPERADMIN_AUDIT_LOGS,
    },
    {
      label: "Settings",
      icon: Settings,
      path: ROUTES.SUPERADMIN_SETTINGS,
    },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  const handleNavClick = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform duration-300 md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-6">
        <span className="font-semibold text-lg text-primary">WorkSync</span>
        <button
          onClick={onClose}
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md text-muted hover:bg-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-auto py-6">
        <div className="px-3">
          <p className="mb-3 px-3 text-xs font-semibold text-muted uppercase tracking-wider">
            SUPERADMIN
          </p>
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavClick(item.path)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-background"
                        : "text-textSecondary hover:bg-surface hover:text-textPrimary",
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t p-3 space-y-2">
        <button className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-textSecondary hover:bg-surface hover:text-textPrimary transition-colors">
          <HelpCircle className="h-5 w-5 flex-shrink-0" />
          <span>Help</span>
        </button>
        <button className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-textSecondary hover:bg-surface hover:text-textPrimary transition-colors">
          <Users className="h-5 w-5 flex-shrink-0" />
          <span>Profile</span>
        </button>
        <button className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-error hover:bg-error/10 transition-colors">
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default SuperadminSidebar;
