import { cn } from "@/utils/cn";

const sizes = {
  sm: "max-w-[var(--ws-breakpoints-content-sm)]",
  md: "max-w-[var(--ws-breakpoints-content-md)]",
  lg: "max-w-[var(--ws-breakpoints-content-lg)]",
  xl: "max-w-[var(--ws-breakpoints-content-xl)]",
};

/** Centers responsive content without prescribing a page-level visual treatment. */
export default function Container({
  as: Component = "div",
  children,
  className,
  size = "xl",
  ...props
}) {
  return (
    <Component
      className={cn(
        "mx-auto w-full px-[var(--ws-spacing-16)] sm:px-[var(--ws-spacing-24)] lg:px-[var(--ws-spacing-32)]",
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
