import { forwardRef, useId } from "react";
import { cn } from "@/utils/cn";
import { componentStyles, focusRing } from "./styles";

/** Checkbox field with an associated label, description, and validation message. */
const Checkbox = forwardRef(function Checkbox(
  { className, description, error, id, label, ...props },
  ref,
) {
  const generatedId = useId();
  const checkboxId = id || generatedId;
  const descriptionId = description ? `${checkboxId}-description` : undefined;
  const errorId = error ? `${checkboxId}-error` : undefined;

  return (
    <div>
      <div className="flex items-start gap-[var(--ws-spacing-8)]">
        <input
          aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
          aria-invalid={Boolean(error)}
          className={cn(
            "mt-[var(--ws-spacing-4)] size-[var(--ws-spacing-16)] rounded-[var(--ws-radius-sm)]",
            "border-[var(--ws-colors-border)] accent-[var(--ws-colors-primary-blue)]",
            focusRing,
            className,
          )}
          id={checkboxId}
          ref={ref}
          type="checkbox"
          {...props}
        />
        {label ? (
          <label className="text-[var(--ws-colors-text-primary)]" htmlFor={checkboxId}>
            {label}
          </label>
        ) : null}
      </div>
      {description ? (
        <p className={componentStyles.description} id={descriptionId}>
          {description}
        </p>
      ) : null}
      {error ? (
        <p className={componentStyles.error} id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export default Checkbox;
