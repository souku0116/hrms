import { cn } from "@/utils/cn";

const sizes = {
  sm: "size-[var(--ws-spacing-32)]",
  md: "size-[var(--ws-spacing-40)]",
  lg: "size-[var(--ws-spacing-48)]",
};

const variants = {
  primary: "bg-[var(--ws-colors-primary-blue)] text-[var(--ws-colors-background)]",
  neutral: "bg-[var(--ws-colors-surface-secondary)] text-[var(--ws-colors-text-secondary)]",
  success: "bg-[var(--ws-colors-success)] text-[var(--ws-colors-background)]",
};

/** Consistent visual frame for Lucide or compatible SVG icon components. */
export default function IconWrapper({
  className,
  icon: Icon,
  label,
  size = "md",
  variant = "neutral",
}) {
  return (
    <span
      aria-label={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[var(--ws-radius-md)]",
        sizes[size],
        variants[variant],
        className,
      )}
      role={label ? "img" : undefined}
    >
      <Icon aria-hidden="true" className="size-[var(--ws-spacing-24)]" />
    </span>
  );
}
