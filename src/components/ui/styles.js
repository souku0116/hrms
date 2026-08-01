export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ws-colors-primary-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ws-colors-background)]";

export const transition =
  "transition-[background-color,border-color,color,box-shadow,opacity,transform] duration-[var(--ws-animation-duration-base)] ease-[var(--ws-animation-easing-standard)]";

export const controlBase = [
  "w-full min-h-[var(--ws-spacing-40)] rounded-[var(--ws-radius-sm)]",
  "border border-[var(--ws-colors-border)] bg-[var(--ws-colors-background)]",
  "px-[var(--ws-spacing-16)] py-[var(--ws-spacing-8)]",
  "text-[length:var(--ws-typography-body-font-size)] leading-[var(--ws-typography-body-line-height)]",
  "text-[var(--ws-colors-text-primary)] placeholder:text-[var(--ws-colors-muted)]",
  "disabled:cursor-not-allowed disabled:bg-[var(--ws-colors-surface-secondary)] disabled:opacity-70",
  transition,
  focusRing,
].join(" ");

export const componentStyles = Object.freeze({
  button: {
    base: [
      "inline-flex min-h-[var(--ws-spacing-40)] items-center justify-center",
      "gap-[var(--ws-spacing-8)] rounded-[var(--ws-radius-sm)]",
      "px-[var(--ws-spacing-16)] py-[var(--ws-spacing-8)]",
      "font-[var(--ws-typography-font-weight-semibold)]",
      "text-[length:var(--ws-typography-small-font-size)] leading-[var(--ws-typography-small-line-height)]",
      "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
      transition,
      focusRing,
    ].join(" "),
    variants: {
      primary:
        "bg-[var(--ws-colors-primary-blue)] text-[var(--ws-colors-background)] hover:bg-[var(--ws-colors-secondary-blue)]",
      secondary:
        "bg-[var(--ws-colors-surface-secondary)] text-[var(--ws-colors-text-primary)] hover:bg-[var(--ws-colors-border)]",
      outline:
        "border border-[var(--ws-colors-border)] bg-[var(--ws-colors-background)] text-[var(--ws-colors-text-primary)] hover:bg-[var(--ws-colors-surface)]",
      ghost:
        "bg-transparent text-[var(--ws-colors-text-secondary)] hover:bg-[var(--ws-colors-surface-secondary)] hover:text-[var(--ws-colors-text-primary)]",
      danger: "bg-[var(--ws-colors-error)] text-[var(--ws-colors-background)] hover:opacity-90",
    },
    sizes: {
      sm: "min-h-[var(--ws-spacing-32)] px-[var(--ws-spacing-8)] py-[var(--ws-spacing-4)]",
      md: "min-h-[var(--ws-spacing-40)] px-[var(--ws-spacing-16)] py-[var(--ws-spacing-8)]",
      lg: "min-h-[var(--ws-spacing-48)] px-[var(--ws-spacing-24)] py-[var(--ws-spacing-8)]",
    },
  },
  card: {
    base: [
      "rounded-[var(--ws-radius-lg)] border border-[var(--ws-colors-border)]",
      "bg-[var(--ws-colors-background)] p-[var(--ws-spacing-24)]",
      "shadow-[var(--ws-shadow-card)]",
    ].join(" "),
  },
  label:
    "mb-[var(--ws-spacing-8)] block font-[var(--ws-typography-font-weight-medium)] text-[length:var(--ws-typography-small-font-size)] leading-[var(--ws-typography-small-line-height)] text-[var(--ws-colors-text-primary)]",
  description:
    "mt-[var(--ws-spacing-4)] text-[length:var(--ws-typography-small-font-size)] leading-[var(--ws-typography-small-line-height)] text-[var(--ws-colors-text-secondary)]",
  error:
    "mt-[var(--ws-spacing-4)] text-[length:var(--ws-typography-small-font-size)] leading-[var(--ws-typography-small-line-height)] text-[var(--ws-colors-error)]",
});
