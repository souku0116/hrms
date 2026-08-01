/** Joins optional class names without introducing a styling dependency. */
export function cn(...classNames) {
  return classNames.flat(Infinity).filter(Boolean).join(" ");
}
