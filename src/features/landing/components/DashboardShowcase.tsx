import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, TrendingUp, Wallet, CalendarCheck } from "lucide-react";
import { fadeUp, staggerContainer } from "./motion";
import SectionHeading from "./SectionHeading";

const showcaseStats = [
  { icon: Users, label: "Time-to-hire reduced", value: 40, suffix: "%" },
  { icon: Wallet, label: "Payroll errors eliminated", value: 99, suffix: "%" },
  { icon: CalendarCheck, label: "Attendance automated", value: 100, suffix: "%" },
  { icon: TrendingUp, label: "Retention increase", value: 25, suffix: "%" },
];

/** Animated counter that counts up when scrolled into view. */
function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/** Interactive dashboard metrics showcase with animated counters. */
export default function DashboardShowcase() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Dashboard"
          title="See your workforce at a glance"
          description="Live dashboards turn raw HR data into decisions — with real-time charts, candidate pipelines and critical metrics all in one place."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {showcaseStats.map(({ icon: Icon, label, value, suffix }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className="group rounded-2xl border border-[var(--ws-colors-border)] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--ws-colors-primary-blue)]/10 text-[var(--ws-colors-primary-blue)] transition-colors group-hover:bg-[var(--ws-colors-primary-blue)] group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-5 font-heading text-3xl font-bold text-[var(--ws-colors-text-primary)]">
                <CountUp value={value} suffix={suffix} />
              </p>
              <p className="mt-2 text-sm text-[var(--ws-colors-muted)]">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
