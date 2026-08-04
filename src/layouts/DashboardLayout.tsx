import * as React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { pageTransition } from "../animations/page";

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar will go here */}
      <aside className="hidden w-64 flex-col border-r bg-card md:flex">
        <div className="flex h-16 items-center border-b px-6">
          <span className="font-heading text-lg font-bold text-primary">WorkSync HR</span>
        </div>
        <div className="flex-1 overflow-auto py-4">
          {/* Navigation Links */}
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <div className="flex items-center md:hidden">
             {/* Mobile Menu Toggle */}
             <span className="font-heading text-lg font-bold text-primary">WorkSync HR</span>
          </div>
          <div className="flex items-center space-x-4">
             {/* User Profile / Notifications */}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="mx-auto max-w-7xl"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
