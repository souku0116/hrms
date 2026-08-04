import { motion } from "framer-motion";
import { fadeIn } from "./motion";
import { trustedCompanies } from "./data";

/** Infinite horizontal marquee of placeholder company logotypes. */
export default function TrustedCompanies() {
  const items = [...trustedCompanies, ...trustedCompanies];

  return (
    <section aria-label="Trusted by companies" className="border-y border-[var(--ws-colors-border)] bg-[var(--ws-colors-surface)] py-10">
      <div className="mx-auto max-w-7xl px-6">
        <motion.p
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center text-sm font-medium uppercase tracking-wider text-[var(--ws-colors-muted)]"
        >
          Trusted by 1,500+ forward-thinking companies
        </motion.p>

        <div className="marquee-mask mt-8 overflow-hidden">
          <div className="marquee-track flex w-max items-center gap-14 pr-14">
            {items.map((company, i) => (
              <div
                key={`${company.name}-${i}`}
                className="flex shrink-0 items-center gap-2.5 opacity-70 transition-opacity hover:opacity-100"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--ws-colors-primary-blue)]/10 font-heading text-sm font-bold text-[var(--ws-colors-primary-blue)]">
                  {company.initials}
                </span>
                <span className="font-heading text-lg font-semibold text-[var(--ws-colors-text-primary)]/80">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
