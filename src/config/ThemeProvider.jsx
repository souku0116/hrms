import { useEffect } from "react";
import { themeCssVariables } from "@/config/theme";

/** Applies the token source of truth as CSS custom properties for all UI layers. */
export function ThemeProvider({ children, mode = "light" }) {
  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.dataset.theme;
    const previousValues = new Map(
      Object.keys(themeCssVariables).map((name) => [name, root.style.getPropertyValue(name)]),
    );

    Object.entries(themeCssVariables).forEach(([name, value]) => {
      root.style.setProperty(name, value);
    });
    root.dataset.theme = mode;

    return () => {
      previousValues.forEach((value, name) => {
        if (value) {
          root.style.setProperty(name, value);
        } else {
          root.style.removeProperty(name);
        }
      });
      if (previousTheme) {
        root.dataset.theme = previousTheme;
      } else {
        delete root.dataset.theme;
      }
    };
  }, [mode]);

  return children;
}
