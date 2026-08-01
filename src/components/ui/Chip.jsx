import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import { focusRing, transition } from "./styles";

/** Compact selected-item token with an optional accessible removal action. */
export default function Chip({ children, className, onRemove, removeLabel = "Remove", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[var(--ws-spacing-4)] rounded-[var(--ws-radius-full)]",
        "bg-[var(--ws-colors-surface-secondary)] px-[var(--ws-spacing-8)] py-[var(--ws-spacing-4)]",
        "text-[length:var(--ws-typography-caption-font-size)] text-[var(--ws-colors-text-secondary)]",
        className,
      )}
      {...props}
    >
      {children}
      {onRemove ? (
        <button
          aria-label={removeLabel}
          className={cn(
            "inline-flex items-center justify-center rounded-[var(--ws-radius-full)] text-[var(--ws-colors-muted)]",
            "hover:text-[var(--ws-colors-text-primary)]",
            transition,
            focusRing,
          )}
          onClick={onRemove}
          type="button"
        >
          <X aria-hidden="true" className="size-[var(--ws-spacing-16)]" />
        </button>
      ) : null}
    </span>
  );
}
