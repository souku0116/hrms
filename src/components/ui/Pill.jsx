import { cn } from "@/utils/cn";

/** Rounded metadata label intended for filters, categories, and lightweight status. */
export default function Pill({ children, className, tone = "neutral" }) {
  const tones = {
    neutral: "bg-[var(--ws-colors-surface-secondary)] text-[var(--ws-colors-text-secondary)]",
    primary: "bg-[var(--ws-colors-primary-blue)] text-[var(--ws-colors-background)]",
    success: "bg-[var(--ws-colors-success)] text-[var(--ws-colors-background)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--ws-radius-full)] px-[var(--ws-spacing-16)] py-[var(--ws-spacing-8)]",
        "text-[length:var(--ws-typography-small-font-size)] leading-[var(--ws-typography-small-line-height)]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
