import { motion } from "framer-motion";
import { industries } from "./data";
import { fadeUp, staggerContainer } from "./motion";
import SectionHeading from "./SectionHeading";

/** Grid of industry verticals served by WorkSync. */
export default function IndustrySection() {
  return (
    <section id="industries" className="relative bg-[var(--ws-colors-surface)] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Industries"
          title="Built for the way your industry works"
          description="WorkSync adapts to the pace, compliance needs and workforce rhythm of every vertical — no matter how complex."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {industries.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="group flex h-full flex-col rounded-2xl border border-[var(--ws-colors-border)] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--ws-colors-primary-blue)]/40 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--ws-colors-primary-blue)]/10 text-[var(--ws-colors-primary-blue)] transition-colors duration-300 group-hover:bg-[var(--ws-colors-primary-blue)] group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-bold text-[var(--ws-colors-text-primary)]">
                {title}
              </h3>
              <p className="mt-2 text-sm text-[var(--ws-colors-muted)]">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
