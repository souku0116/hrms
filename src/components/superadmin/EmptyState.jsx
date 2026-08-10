import * as React from "react";
import { cn } from "@/lib/utils";

/** Empty state component. */
export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}
    >
      {Icon && <Icon className="h-12 w-12 text-muted mb-4" />}
      <h3 className="font-semibold text-textPrimary mb-1">{title}</h3>
      {description && <p className="text-sm text-textSecondary mb-4 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;
