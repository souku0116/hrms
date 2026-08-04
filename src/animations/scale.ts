import { Variants } from "framer-motion";

export const scaleUp: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { scale: 0.95, opacity: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
};

export const scaleDown: Variants = {
  initial: { scale: 1.05, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { scale: 1.05, opacity: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
};

export const buttonScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 }
};
