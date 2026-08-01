import { cn } from "@/utils/cn";

const styles = {
  display:
    "font-[var(--ws-typography-display-font-weight)] text-[length:var(--ws-typography-display-font-size)] leading-[var(--ws-typography-display-line-height)] tracking-[var(--ws-typography-letter-spacing-display)]",
  hero: "font-[var(--ws-typography-hero-font-weight)] text-[length:var(--ws-typography-hero-font-size)] leading-[var(--ws-typography-hero-line-height)] tracking-[var(--ws-typography-letter-spacing-display)]",
  h1: "font-[var(--ws-typography-h1-font-weight)] text-[length:var(--ws-typography-h1-font-size)] leading-[var(--ws-typography-h1-line-height)] tracking-[var(--ws-typography-letter-spacing-heading)]",
  h2: "font-[var(--ws-typography-h2-font-weight)] text-[length:var(--ws-typography-h2-font-size)] leading-[var(--ws-typography-h2-line-height)] tracking-[var(--ws-typography-letter-spacing-heading)]",
  h3: "font-[var(--ws-typography-h3-font-weight)] text-[length:var(--ws-typography-h3-font-size)] leading-[var(--ws-typography-h3-line-height)]",
  h4: "font-[var(--ws-typography-h4-font-weight)] text-[length:var(--ws-typography-h4-font-size)] leading-[var(--ws-typography-h4-line-height)]",
};

/** Semantic heading primitive decoupling HTML level from visual scale. */
export default function Heading({
  as: Component = "h2",
  children,
  className,
  level = "h2",
  ...props
}) {
  return (
    <Component className={cn(styles[level], className)} {...props}>
      {children}
    </Component>
  );
}
