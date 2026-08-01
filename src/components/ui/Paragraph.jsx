import { cn } from "@/utils/cn";

const styles = {
  large:
    "text-[length:var(--ws-typography-body-large-font-size)] leading-[var(--ws-typography-body-large-line-height)]",
  body: "text-[length:var(--ws-typography-body-font-size)] leading-[var(--ws-typography-body-line-height)]",
  small:
    "text-[length:var(--ws-typography-small-font-size)] leading-[var(--ws-typography-small-line-height)]",
  caption:
    "text-[length:var(--ws-typography-caption-font-size)] leading-[var(--ws-typography-caption-line-height)]",
};

/** Body copy primitive with token-based type scale and semantic color choices. */
export default function Paragraph({ children, className, muted = false, size = "body", ...props }) {
  return (
    <p
      className={cn(
        styles[size],
        muted ? "text-[var(--ws-colors-text-secondary)]" : "text-[var(--ws-colors-text-primary)]",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
