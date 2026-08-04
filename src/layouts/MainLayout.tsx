import * as React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { pageTransition } from "../animations/page";

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto px-4 sm:px-6 lg:px-8">
          <div className="font-heading text-xl font-bold text-primary">WorkSync HR</div>
          {/* Main Navigation will go here */}
        </div>
      </header>
      <motion.main
        className="flex-1"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        <Outlet />
      </motion.main>
      <footer className="border-t bg-card py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm leading-loose text-muted-foreground text-center md:text-left">
            Built for modern HR teams. © {new Date().getFullYear()} WorkSync HR.
          </p>
        </div>
      </footer>
    </div>
  );
}
