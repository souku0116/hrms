import * as React from "react";
import { Menu } from "lucide-react";

/** Superadmin header component. */
export function SuperadminHeader({ greeting = "Good morning, Superadmin", onMenuClick }) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md text-muted hover:bg-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-semibold text-textPrimary">{greeting}</p>
        </div>
      </div>
    </header>
  );
}

export default SuperadminHeader;
