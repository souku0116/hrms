import { forwardRef, useId } from "react";
import { cn } from "@/utils/cn";
import { componentStyles, controlBase } from "./styles";

/** Labeled multiline field that shares the standard form-control styling. */
const Textarea = forwardRef(function Textarea(
  { className, description, error, id, label, ...props },
  ref,
) {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const descriptionId = description ? `${textareaId}-description` : undefined;
  const errorId = error ? `${textareaId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      {label ? (
        <label className={componentStyles.label} htmlFor={textareaId}>
          {label}
        </label>
      ) : null}
      <textarea
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        className={cn(
          controlBase,
          "min-h-[var(--ws-spacing-120)] resize-y",
          error && "border-[var(--ws-colors-error)]",
          className,
        )}
        id={textareaId}
        ref={ref}
        {...props}
      />
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

export default Textarea;
