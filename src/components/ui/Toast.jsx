import { CheckCircle2, CircleAlert, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { focusRing } from "./styles";

const variants = {
  info: {
    icon: Info,
    styles: "border-[var(--ws-colors-primary-blue)] text-[var(--ws-colors-text-primary)]",
  },
  success: {
    icon: CheckCircle2,
    styles: "border-[var(--ws-colors-success)] text-[var(--ws-colors-text-primary)]",
  },
  warning: {
    icon: TriangleAlert,
    styles: "border-[var(--ws-colors-warning)] text-[var(--ws-colors-text-primary)]",
  },
  error: {
    icon: CircleAlert,
    styles: "border-[var(--ws-colors-error)] text-[var(--ws-colors-text-primary)]",
  },
};

/** Non-global notification surface; placement and lifecycle stay owned by the caller. */
export default function Toast({ className, message, onDismiss, title, variant = "info" }) {
  const { icon: Icon, styles } = variants[variant];

  return (
    <div
      className={cn(
        "flex items-start gap-[var(--ws-spacing-16)] rounded-[var(--ws-radius-md)] border-l-[var(--ws-spacing-4)]",
        "bg-[var(--ws-colors-background)] p-[var(--ws-spacing-16)] shadow-[var(--ws-shadow-card)]",
        styles,
        className,
      )}
      role={variant === "error" ? "alert" : "status"}
    >
      <Icon
        aria-hidden="true"
        className="mt-[var(--ws-spacing-4)] size-[var(--ws-spacing-24)] shrink-0"
      />
      <div className="min-w-0 flex-1">
        {title ? <p className="font-[var(--ws-typography-font-weight-semibold)]">{title}</p> : null}
        {message ? <p className="text-[var(--ws-colors-text-secondary)]">{message}</p> : null}
      </div>
      {onDismiss ? (
        <button
          aria-label="Dismiss notification"
          className={cn(
            "rounded-[var(--ws-radius-sm)] p-[var(--ws-spacing-4)] text-[var(--ws-colors-muted)]",
            "hover:text-[var(--ws-colors-text-primary)]",
            focusRing,
          )}
          onClick={onDismiss}
          type="button"
        >
          <X aria-hidden="true" className="size-[var(--ws-spacing-16)]" />
        </button>
      ) : null}
    </div>
  );
}
