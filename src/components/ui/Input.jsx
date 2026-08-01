import { forwardRef, useId } from "react";
import { cn } from "@/utils/cn";
import { componentStyles, controlBase } from "./styles";

/** Labeled text input with built-in description and error relationships. */
const Input = forwardRef(function Input(
  { className, description, error, id, label, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      {label ? (
        <label className={componentStyles.label} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        className={cn(controlBase, error && "border-[var(--ws-colors-error)]", className)}
        id={inputId}
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

export default Input;
