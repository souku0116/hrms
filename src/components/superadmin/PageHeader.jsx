import * as React from "react";
import { cn } from "@/lib/utils";

/** Page header component for superadmin pages. */
export function PageHeader({ title, subtitle, actions, className }) {
  return (
    <div className={cn("border-b bg-surface px-6 py-6 md:py-8", className)}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-textPrimary">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-textSecondary">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
