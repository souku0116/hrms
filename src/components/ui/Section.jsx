import { cn } from "@/utils/cn";

const spacing = {
  sm: "py-[var(--ws-spacing-48)]",
  md: "py-[var(--ws-spacing-64)]",
  lg: "py-[var(--ws-spacing-80)]",
  xl: "py-[var(--ws-spacing-120)]",
};

const tones = {
  plain: "bg-[var(--ws-colors-background)]",
  surface: "bg-[var(--ws-colors-surface)]",
  secondary: "bg-[var(--ws-colors-surface-secondary)]",
  primary: "bg-[var(--ws-colors-primary)] text-[var(--ws-colors-background)]",
};

/** Semantic content band with tokenized spacing, color, and optional entrance motion. */
export default function Section({
  animate = false,
  as: Component = "section",
  children,
  className,
  spacing: verticalSpacing = "lg",
  tone = "plain",
  ...props
}) {
  return (
    <Component
      className={cn(
        spacing[verticalSpacing],
        tones[tone],
        animate && "ws-section-entrance",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
