import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer } from "./motion";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/** Reusable eyebrow + title + description block for landing sections. */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? (
        <motion.p
          variants={fadeUp}
          className="text-sm font-semibold uppercase tracking-wider text-[var(--ws-colors-primary-blue)]"
        >
          {eyebrow}
        </motion.p>
      ) : null}
      <motion.h2
        variants={fadeUp}
        className="mt-3 font-heading text-3xl font-bold tracking-tight text-[var(--ws-colors-text-primary)] sm:text-4xl"
      >
        {title}
      </motion.h2>
      {description ? (
        <motion.p
          variants={fadeUp}
          className="mt-4 text-lg leading-relaxed text-[var(--ws-colors-text-secondary)]"
        >
          {description}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
