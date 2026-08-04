import { motion } from "framer-motion";
import { growthTimeline } from "./data";
import { fadeUp, staggerContainer } from "./motion";
import SectionHeading from "./SectionHeading";

/** Growth timeline showing how WorkSync scales with your business. */
export default function GrowthSection() {
  return (
    <section id="growth" className="relative bg-[var(--ws-colors-surface)] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Growth"
          title="A platform that scales as you grow"
          description="Start with automation, then unlock hiring, payroll and analytics as your workforce expands — all on one connected system."
        />

        <div className="relative mx-auto mt-16 max-w-3xl">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--ws-colors-border)] md:left-1/2" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-10"
          >
            {growthTimeline.map(({ period, title, description }, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  className={`relative flex items-start gap-6 pl-12 md:w-1/2 md:pl-0 ${
                    isLeft
                      ? "md:mr-auto md:pr-10 md:text-right"
                      : "md:ml-auto md:pl-10"
                  }`}
                >
                  {/* Dot */}
                  <span
                    className={`absolute top-1 left-4 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-4 border-[var(--ws-colors-surface)] bg-[var(--ws-colors-primary-blue)] md:left-auto ${
                      isLeft ? "md:right-0 md:translate-x-1/2" : "md:left-0 md:-translate-x-1/2"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </span>

                  <div className="rounded-2xl border border-[var(--ws-colors-border)] bg-white p-6 transition-all duration-300 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--ws-colors-primary-blue)]">
                      {period}
                    </span>
                    <h3 className="mt-2 font-heading text-xl font-bold text-[var(--ws-colors-text-primary)]">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--ws-colors-muted)]">{description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
