import * as React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { SuperadminSidebar } from "@/components/superadmin/SuperadminSidebar";
import { SuperadminHeader } from "@/components/superadmin/SuperadminHeader";
import { pageTransition } from "@/animations/page";

/** Superadmin application layout shell. */
export function SuperadminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <SuperadminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <SuperadminHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Content area */}
        <main className="flex-1 overflow-auto">
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default SuperadminLayout;
