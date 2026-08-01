import { animation } from "./animation";
import { breakpoints } from "./breakpoints";
import { colors } from "./colors";
import { radius } from "./radius";
import { shadow } from "./shadow";
import { spacing } from "./spacing";
import { typography } from "./typography";

export { animation, breakpoints, colors, radius, shadow, spacing, typography };

export const theme = Object.freeze({
  animation,
  breakpoints,
  colors,
  radius,
  shadow,
  spacing,
  typography,
});

function toKebabCase(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function createCssVariables(tokens, path = []) {
  return Object.entries(tokens).reduce((variables, [key, value]) => {
    const tokenPath = [...path, toKebabCase(key)];

    if (value && typeof value === "object") {
      return { ...variables, ...createCssVariables(value, tokenPath) };
    }

    return {
      ...variables,
      [`--ws-${tokenPath.join("-")}`]: value,
    };
  }, {});
}

export const themeCssVariables = Object.freeze(createCssVariables(theme));
