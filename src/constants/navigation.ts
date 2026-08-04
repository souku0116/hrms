import {
  LayoutDashboard,
  Users,
  Briefcase,
  DollarSign,
  Calendar,
  Settings,
  HelpCircle,
  FileText
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

export const mainNavigation: NavItem[] = [
  {
    title: "Product",
    href: "/product",
    icon: Briefcase,
  },
  {
    title: "Solutions",
    href: "/solutions",
    icon: Users,
  },
  {
    title: "Pricing",
    href: "/pricing",
    icon: DollarSign,
  },
  {
    title: "Resources",
    href: "/resources",
    icon: FileText,
  },
];

export const dashboardNavigation: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Directory",
    href: "/dashboard/directory",
    icon: Users,
  },
  {
    title: "Time Off",
    href: "/dashboard/timeoff",
    icon: Calendar,
  },
  {
    title: "Payroll",
    href: "/dashboard/payroll",
    icon: DollarSign,
  },
  {
    title: "Documents",
    href: "/dashboard/documents",
    icon: FileText,
  },
];

export const secondaryNavigation: NavItem[] = [
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    href: "/dashboard/support",
    icon: HelpCircle,
  },
];
