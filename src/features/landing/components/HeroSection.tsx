import { motion } from "framer-motion";
import { Sparkles, Play, ArrowRight } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { fadeUp, floatLoop, staggerContainer } from "./motion";
import DashboardPreview from "./DashboardPreview";

export default function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Background layers */}
      <div className="animated-gradient absolute inset-0" aria-hidden="true" />
      <div className="grid-pattern absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,rgba(248,250,252,0.9)_70%)]"
        aria-hidden="true"
      />

      {/* Soft blobs */}
      <motion.div
        className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[var(--ws-colors-primary-blue)]/20 blur-3xl"
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute top-40 right-0 h-80 w-80 rounded-full bg-[var(--ws-colors-secondary-blue)]/20 blur-3xl"
        animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <div className="container relative mx-auto grid items-center gap-14 px-6 lg:grid-cols-2 lg:gap-10">
        {/* Left copy */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          <motion.div variants={fadeUp}>
            <Badge className="gap-1.5 border border-[var(--ws-colors-primary-blue)]/20 bg-[var(--ws-colors-primary-blue)]/5 px-3 py-1.5 text-[var(--ws-colors-primary-blue)]">
              <Sparkles className="h-3.5 w-3.5" />
              AI Powered HR Platform for Modern Businesses
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-[var(--ws-colors-text-primary)] sm:text-5xl lg:text-6xl"
          >
            Run HR with <span className="text-gradient">AI precision</span> and human clarity
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--ws-colors-text-secondary)]"
          >
            WorkSync is the AI-powered HR platform that unifies recruitment, payroll,
            attendance and performance — so your team can focus on people, not paperwork.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="#contact" size="lg">
              Book Demo
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button href="#platform" variant="outline" size="lg">
              <Play className="mr-1 h-4 w-4" />
              Explore Platform
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            <div>
              <p className="font-heading text-2xl font-bold text-[var(--ws-colors-text-primary)]">
                250K+
              </p>
              <p className="text-sm text-[var(--ws-colors-muted)]">Employees managed</p>
            </div>
            <div className="h-10 w-px bg-[var(--ws-colors-border)]" />
            <div>
              <p className="font-heading text-2xl font-bold text-[var(--ws-colors-text-primary)]">
                1500+
              </p>
              <p className="text-sm text-[var(--ws-colors-muted)]">Companies onboard</p>
            </div>
            <div className="h-10 w-px bg-[var(--ws-colors-border)]" />
            <div>
              <p className="font-heading text-2xl font-bold text-[var(--ws-colors-text-primary)]">
                4.9/5
              </p>
              <p className="text-sm text-[var(--ws-colors-muted)]">Customer rating</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative"
        >
          <motion.div
            className="absolute -top-6 -right-4 z-10 hidden rounded-xl border border-[var(--ws-colors-border)] bg-white/80 p-3 shadow-lg backdrop-blur sm:block"
            variants={floatLoop}
            animate="animate"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ws-colors-success)]/10 text-[var(--ws-colors-success)]">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold text-[var(--ws-colors-text-primary)]">
                  AI Match Found
                </p>
                <p className="text-[11px] text-[var(--ws-colors-muted)]">92% · Senior Frontend</p>
              </div>
            </div>
          </motion.div>

          <DashboardPreview variant="overview" />

          <motion.div
            className="absolute -bottom-6 -left-4 z-10 hidden rounded-xl border border-[var(--ws-colors-border)] bg-white/80 p-3 shadow-lg backdrop-blur sm:block"
            variants={floatLoop}
            animate="animate"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ws-colors-primary-blue)]/10 text-[var(--ws-colors-primary-blue)]">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold text-[var(--ws-colors-text-primary)]">
                  Payroll Synced
                </p>
                <p className="text-[11px] text-[var(--ws-colors-muted)]">$482K · This month</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
