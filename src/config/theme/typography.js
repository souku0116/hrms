const createTypeStyle = (fontSize, lineHeight, fontWeight = "400") => ({
  fontSize,
  lineHeight,
  fontWeight,
});

export const typography = Object.freeze({
  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontWeight: Object.freeze({
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  }),
  letterSpacing: Object.freeze({
    display: "-0.03em",
    heading: "-0.02em",
    normal: "0",
  }),
  display: Object.freeze(createTypeStyle("3.75rem", "1.05", "600")),
  hero: Object.freeze(createTypeStyle("3rem", "1.1", "600")),
  h1: Object.freeze(createTypeStyle("2.5rem", "1.15", "600")),
  h2: Object.freeze(createTypeStyle("2rem", "1.2", "600")),
  h3: Object.freeze(createTypeStyle("1.5rem", "1.3", "600")),
  h4: Object.freeze(createTypeStyle("1.25rem", "1.4", "600")),
  bodyLarge: Object.freeze(createTypeStyle("1.125rem", "1.6")),
  body: Object.freeze(createTypeStyle("1rem", "1.6")),
  small: Object.freeze(createTypeStyle("0.875rem", "1.5")),
  caption: Object.freeze(createTypeStyle("0.75rem", "1.4", "500")),
});
