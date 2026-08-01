import { cn } from "@/utils/cn";

const sizes = {
  sm: "size-[var(--ws-spacing-32)]",
  md: "size-[var(--ws-spacing-40)]",
  lg: "size-[var(--ws-spacing-64)]",
};

/** Person or organization visual identity with image and initials fallback. */
export default function Avatar({ alt = "", className, initials, size = "md", src }) {
  const classes = cn(
    "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[var(--ws-radius-full)]",
    "bg-[var(--ws-colors-surface-secondary)] font-[var(--ws-typography-font-weight-semibold)] text-[var(--ws-colors-text-secondary)]",
    sizes[size],
    className,
  );

  if (src) {
    return <img alt={alt} className={cn("object-cover", classes)} src={src} />;
  }

  return (
    <span aria-label={alt || undefined} className={classes} role={alt ? "img" : undefined}>
      {initials}
    </span>
  );
}
