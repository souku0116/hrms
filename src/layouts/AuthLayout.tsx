import * as React from "react";
import { Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { pageTransition } from "../animations/page";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
        <motion.div
          className="mx-auto w-full max-w-sm lg:w-96"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
        >
          <div className="mb-8">
            <Link to="/" className="font-heading text-2xl font-bold text-primary">
              WorkSync HR
            </Link>
          </div>
          <Outlet />
        </motion.div>
      </div>
      <div className="hidden lg:block relative w-1/2 flex-1 bg-dark">
        <div className="absolute inset-0 h-full w-full object-cover bg-gradient-to-br from-primary/80 to-dark/90">
           {/* Decorative elements or images can go here */}
           <div className="flex h-full items-center justify-center p-12">
             <div className="glass-dark rounded-2xl p-10 max-w-lg text-white">
               <h2 className="text-3xl font-bold font-heading mb-4">Empower Your Global Team</h2>
               <p className="text-lg text-white/80 text-balance">
                 The all-in-one platform to hire, pay, and manage your workforce anywhere in the world.
               </p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
