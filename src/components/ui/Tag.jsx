import { cn } from "@/utils/cn";

/** Quiet categorical label for metadata and filter summaries. */
export default function Tag({ children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--ws-radius-sm)] border border-[var(--ws-colors-border)]",
        "px-[var(--ws-spacing-8)] py-[var(--ws-spacing-4)]",
        "text-[length:var(--ws-typography-caption-font-size)] text-[var(--ws-colors-text-secondary)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
