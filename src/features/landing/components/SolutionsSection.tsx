import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { solutions } from "./data";
import { fadeUp, staggerContainer } from "./motion";
import SectionHeading from "./SectionHeading";

/** Solutions grid with gradient-border cards, hover lift and icon emphasis. */
export default function SolutionsSection() {
  return (
    <section id="solutions" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Solutions"
          title="Everything your HR team needs in one platform"
          description="From first requisition to final payroll, WorkSync automates the entire employee lifecycle so your team can focus on what matters — people."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {solutions.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-[var(--ws-colors-border)] bg-white p-7",
                "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)]",
                title === "Analytics" && "sm:last:col-span-2 lg:last:col-span-1 lg:last:col-start-2",
              )}
            >
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--ws-colors-primary-blue)] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--ws-colors-primary-blue)]/10 text-[var(--ws-colors-primary-blue)] transition-colors duration-300 group-hover:bg-[var(--ws-colors-primary-blue)] group-hover:text-white">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-heading text-xl font-bold text-[var(--ws-colors-text-primary)]">
                {title}
              </h3>
              <p className="mt-3 text-[var(--ws-colors-text-secondary)]">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
