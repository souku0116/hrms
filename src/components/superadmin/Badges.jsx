import * as React from "react";
import Badge from "@/components/ui/Badge";

/** Status badge component with role-specific variants. */
export function StatusBadge({ status, className }) {
  const statusVariants = {
    Active: "success",
    Inactive: "neutral",
    Suspended: "error",
    Pending: "warning",
  };

  return (
    <Badge variant={statusVariants[status] || "neutral"} className={className}>
      {status}
    </Badge>
  );
}

/** Role badge component. */
export function RoleBadge({ role, className }) {
  const roleVariants = {
    SUPERADMIN: "primary",
    ADMIN: "primary",
    USER: "neutral",
  };

  return (
    <Badge variant={roleVariants[role] || "neutral"} className={className}>
      {role}
    </Badge>
  );
}

export default { StatusBadge, RoleBadge };
