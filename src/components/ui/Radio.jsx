import { forwardRef, useId } from "react";
import { cn } from "@/utils/cn";
import { componentStyles, focusRing } from "./styles";

/** Single radio field intended for composition into an accessible radio group. */
const Radio = forwardRef(function Radio({ className, description, id, label, ...props }, ref) {
  const generatedId = useId();
  const radioId = id || generatedId;
  const descriptionId = description ? `${radioId}-description` : undefined;

  return (
    <div>
      <div className="flex items-start gap-[var(--ws-spacing-8)]">
        <input
          aria-describedby={descriptionId}
          className={cn(
            "mt-[var(--ws-spacing-4)] size-[var(--ws-spacing-16)] border-[var(--ws-colors-border)]",
            "accent-[var(--ws-colors-primary-blue)]",
            focusRing,
            className,
          )}
          id={radioId}
          ref={ref}
          type="radio"
          {...props}
        />
        {label ? (
          <label className="text-[var(--ws-colors-text-primary)]" htmlFor={radioId}>
            {label}
          </label>
        ) : null}
      </div>
      {description ? (
        <p className={componentStyles.description} id={descriptionId}>
          {description}
        </p>
      ) : null}
    </div>
  );
});

export default Radio;
