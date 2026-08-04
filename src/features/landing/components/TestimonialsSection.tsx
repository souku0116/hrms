import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "./data";
import { fadeUp, staggerContainer } from "./motion";
import SectionHeading from "./SectionHeading";

/** Auto-rotating testimonial glass cards with star ratings. */
export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Customers"
          title="Loved by HR teams everywhere"
          description="Hear from the people who run HR on WorkSync every day."
        />

        <div className="relative mx-auto mt-16 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass rounded-3xl p-8 sm:p-10"
            >
              <div className="flex items-center gap-1 text-[var(--ws-colors-warning)]">
                {Array.from({ length: testimonials[index].rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="mt-6 text-lg leading-relaxed text-[var(--ws-colors-text-primary)] sm:text-xl">
                “{testimonials[index].quote}”
              </p>
              <div className="mt-8 flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ws-colors-primary-blue)]/10 font-heading font-bold text-[var(--ws-colors-primary-blue)]">
                  {testimonials[index].initials}
                </span>
                <div>
                  <p className="font-heading font-bold text-[var(--ws-colors-text-primary)]">
                    {testimonials[index].name}
                  </p>
                  <p className="text-sm text-[var(--ws-colors-muted)]">
                    {testimonials[index].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-8 bg-[var(--ws-colors-primary-blue)]"
                    : "w-2.5 bg-[var(--ws-colors-border)]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
