import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { platformFeatures } from "./data";
import { fadeUp, staggerContainer } from "./motion";
import SectionHeading from "./SectionHeading";
import DashboardPreview from "./DashboardPreview";

const variantMap: Record<string, Parameters<typeof DashboardPreview>[0]["variant"]> = {
  "ai-recruitment": "ai-recruitment",
  "employee-db": "employee",
  payroll: "payroll",
  attendance: "attendance",
  leave: "leave",
  performance: "performance",
  reporting: "reporting",
};

/** Platform overview with interactive tabs that swap the dashboard preview. */
export default function PlatformFeatures() {
  const [active, setActive] = useState(platformFeatures[0].id);
  const current = platformFeatures.find((f) => f.id === active)!;

  return (
    <section id="platform" className="relative bg-[var(--ws-colors-surface)] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Platform"
          title="One connected platform for the entire employee lifecycle"
          description="Explore how each WorkSync module turns scattered HR work into a single, intelligent workflow."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          {/* Tabs */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col gap-2"
          >
            {platformFeatures.map(({ id, label, icon: Icon, headline, description }) => (
              <motion.button
                key={id}
                variants={fadeUp}
                type="button"
                onClick={() => setActive(id)}
                aria-pressed={active === id}
                className={cn(
                  "group flex items-start gap-4 rounded-xl border p-4 text-left transition-all duration-300",
                  active === id
                    ? "border-[var(--ws-colors-primary-blue)] bg-white shadow-[0_8px_32px_rgba(15,23,42,0.08)]"
                    : "border-transparent hover:border-[var(--ws-colors-border)] hover:bg-white/60",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                    active === id
                      ? "bg-[var(--ws-colors-primary-blue)] text-white"
                      : "bg-[var(--ws-colors-primary-blue)]/10 text-[var(--ws-colors-primary-blue)]",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span
                    className={cn(
                      "block font-heading font-bold",
                      active === id
                        ? "text-[var(--ws-colors-text-primary)]"
                        : "text-[var(--ws-colors-text-secondary)]",
                    )}
                  >
                    {label}
                  </span>
                  <AnimatePresence initial={false}>
                    {active === id && (
                      <motion.span
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="block overflow-hidden text-sm text-[var(--ws-colors-muted)]"
                      >
                        <span className="mt-1 block">{headline}</span>
                        <span className="mt-1 block">{description}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Preview */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <DashboardPreview variant={variantMap[active]} />
                <div className="mt-6 text-center">
                  <p className="text-sm font-medium text-[var(--ws-colors-text-primary)]">
                    {current.headline}
                  </p>
                  <p className="mt-1 text-sm text-[var(--ws-colors-muted)]">{current.description}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
