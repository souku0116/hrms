import { forwardRef, useId } from "react";
import { cn } from "@/utils/cn";
import { componentStyles, controlBase } from "./styles";

/** Select field supporting either declarative options or custom option children. */
const Select = forwardRef(function Select(
  { children, className, description, error, id, label, options, placeholder, ...props },
  ref,
) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const descriptionId = description ? `${selectId}-description` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;

  return (
    <div>
      {label ? (
        <label className={componentStyles.label} htmlFor={selectId}>
          {label}
        </label>
      ) : null}
      <select
        aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
        aria-invalid={Boolean(error)}
        className={cn(controlBase, error && "border-[var(--ws-colors-error)]", className)}
        id={selectId}
        ref={ref}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options?.map(({ disabled, label: optionLabel, value }) => (
          <option disabled={disabled} key={value} value={value}>
            {optionLabel}
          </option>
        ))}
        {children}
      </select>
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

export default Select;
