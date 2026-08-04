import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { fadeUp, staggerContainer } from "./motion";

/** Large gradient conversion block with background animation. */
export default function CTASection() {
  return (
    <section id="contact" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--ws-colors-primary-blue)] via-[var(--ws-colors-secondary-blue)] to-[var(--ws-colors-primary)] px-8 py-16 text-center sm:px-16 sm:py-20"
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
            transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.3), transparent 40%)",
              backgroundSize: "200% 200%",
            }}
            aria-hidden="true"
          />

          <div className="relative">
            <motion.h2
              variants={fadeUp}
              className="mx-auto max-w-2xl font-heading text-3xl font-bold text-white sm:text-4xl"
            >
              Ready to transform your HR operations?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-xl text-lg text-white/80"
            >
              Book a demo today and see how WorkSync can automate your entire employee
              lifecycle in under a week.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                href="/login"
                className="bg-white text-[var(--ws-colors-primary-blue)] hover:bg-white/90"
              >
                Book Demo
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button
                href="#platform"
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:bg-white/10"
              >
                Explore Platform
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
