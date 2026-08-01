import { LoaderCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { componentStyles } from "./styles";

/** Accessible action control that renders a button or link without visual duplication. */
export default function Button({
  children,
  className,
  disabled = false,
  href,
  isLoading = false,
  loadingLabel,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}) {
  const classes = cn(
    componentStyles.button.base,
    componentStyles.button.variants[variant],
    componentStyles.button.sizes[size],
    className,
  );
  const content = isLoading ? (
    <>
      <LoaderCircle aria-hidden="true" className="size-[var(--ws-spacing-16)] animate-spin" />
      <span>{loadingLabel || children}</span>
    </>
  ) : (
    children
  );

  if (href) {
    return (
      <a
        aria-disabled={disabled || isLoading}
        className={classes}
        href={disabled || isLoading ? undefined : href}
        tabIndex={disabled || isLoading ? -1 : undefined}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button className={classes} disabled={disabled || isLoading} type={type} {...props}>
      {content}
    </button>
  );
}
