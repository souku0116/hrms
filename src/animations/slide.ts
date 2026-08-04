import { Variants } from "framer-motion";

export const slideInUp: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { y: -20, opacity: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
};

export const slideInDown: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { y: 20, opacity: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
};

export const slideInLeft: Variants = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { x: 20, opacity: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
};

export const slideInRight: Variants = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { x: -20, opacity: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
};
