import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { stats } from "./data";
import { fadeUp, staggerContainer } from "./motion";

/** Animated numeric counter that runs when scrolled into view. */
function AnimatedCounter({
  value,
  suffix,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * value);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/** Highlight metrics band with animated count-up numbers. */
export default function StatsSection() {
  return (
    <section id="stats" className="relative overflow-hidden bg-[var(--ws-colors-primary)] py-24">
      <div className="bg-grid-dark absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.25),transparent_60%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-10 text-center sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map(({ value, suffix, label, decimals }) => (
            <motion.div key={label} variants={fadeUp}>
              <p className="font-heading text-5xl font-bold text-white">
                <AnimatedCounter value={value} suffix={suffix} decimals={decimals} />
              </p>
              <p className="mt-3 text-sm text-white/70">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
