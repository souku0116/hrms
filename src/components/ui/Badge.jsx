import { cn } from "@/utils/cn";

const variants = {
  neutral: "bg-[var(--ws-colors-surface-secondary)] text-[var(--ws-colors-text-secondary)]",
  primary: "bg-[var(--ws-colors-primary-blue)] text-[var(--ws-colors-background)]",
  success: "bg-[var(--ws-colors-success)] text-[var(--ws-colors-background)]",
  warning: "bg-[var(--ws-colors-warning)] text-[var(--ws-colors-primary)]",
  error: "bg-[var(--ws-colors-error)] text-[var(--ws-colors-background)]",
};

/** Compact semantic status label. */
export default function Badge({ children, className, variant = "neutral" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--ws-radius-full)] px-[var(--ws-spacing-8)] py-[var(--ws-spacing-4)]",
        "font-[var(--ws-typography-font-weight-medium)] text-[length:var(--ws-typography-caption-font-size)] leading-[var(--ws-typography-caption-line-height)]",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
