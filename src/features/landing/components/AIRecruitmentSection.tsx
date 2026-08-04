import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { aiWorkflow } from "./data";
import { fadeUp, staggerContainer } from "./motion";
import SectionHeading from "./SectionHeading";

/** Animated AI recruitment workflow with connected step cards. */
export default function AIRecruitmentSection() {
  return (
    <section id="ai-recruitment" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="AI Recruitment"
          title="From resume to offer, fully automated"
          description="Watch how WorkSync's AI engine drives every step of the hiring lifecycle — cutting time-to-hire and removing guesswork."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-5"
        >
          {aiWorkflow.map(({ icon: Icon, title, description }, i) => (
            <div key={title} className="relative">
              <motion.div
                variants={fadeUp}
                className="group h-full rounded-2xl border border-[var(--ws-colors-border)] bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)]"
              >
                <span className="relative mx-auto inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--ws-colors-primary-blue)]/10 text-[var(--ws-colors-primary-blue)]">
                  <Icon className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--ws-colors-primary-blue)] text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-[var(--ws-colors-text-primary)]">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-[var(--ws-colors-muted)]">{description}</p>
              </motion.div>

              {i < aiWorkflow.length - 1 && (
                <motion.div
                  className="absolute top-1/2 -right-4 z-10 hidden -translate-y-1/2 lg:block"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--ws-colors-border)] bg-white text-[var(--ws-colors-primary-blue)] shadow-sm">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
