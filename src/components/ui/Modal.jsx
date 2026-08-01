import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import { focusRing } from "./styles";

/** Accessible modal dialog with escape, backdrop, and focus-return behavior. */
export default function Modal({ children, className, isOpen, onClose, title }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const activeElement = document.activeElement;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      activeElement?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-labelledby={title ? titleId : undefined}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--ws-colors-overlay)] p-[var(--ws-spacing-16)]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
      role="dialog"
    >
      <div
        className={cn(
          "w-full max-w-[var(--ws-breakpoints-content-sm)] rounded-[var(--ws-radius-lg)]",
          "bg-[var(--ws-colors-background)] p-[var(--ws-spacing-24)] shadow-[var(--ws-shadow-floating)]",
          className,
        )}
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="flex items-start justify-between gap-[var(--ws-spacing-16)]">
          {title ? (
            <h2
              className="font-[var(--ws-typography-h3-font-weight)] text-[length:var(--ws-typography-h3-font-size)] leading-[var(--ws-typography-h3-line-height)] text-[var(--ws-colors-text-primary)]"
              id={titleId}
            >
              {title}
            </h2>
          ) : null}
          <button
            aria-label="Close dialog"
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-[var(--ws-radius-sm)]",
              "p-[var(--ws-spacing-8)] text-[var(--ws-colors-muted)] hover:bg-[var(--ws-colors-surface-secondary)]",
              "hover:text-[var(--ws-colors-text-primary)]",
              focusRing,
            )}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="size-[var(--ws-spacing-24)]" />
          </button>
        </div>
        <div className={title ? "mt-[var(--ws-spacing-24)]" : undefined}>{children}</div>
      </div>
    </div>
  );
}
