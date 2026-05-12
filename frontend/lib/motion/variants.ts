import type { Variants } from "framer-motion";

export const fadeInUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

export const slideInLeft: Variants = {
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const slideInRight: Variants = {
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const staggerContainer: Variants = {
  hidden:  {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

export const cardHover = {
  rest:  { scale: 1, y: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" },
  hover: { scale: 1.02, y: -4, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" },
};

export const airplanePath: Variants = {
  animate: {
    offsetDistance: ["0%", "100%"],
    transition: {
      duration: 8,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

export const pageTransition: Variants = {
  initial:  { opacity: 0, y: 8 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit:     { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export const modalVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1,  transition: { duration: 0.2, ease: "easeOut" } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

export const backdropVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

export const toastVariants: Variants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0, transition: { type: "spring", damping: 20, stiffness: 300 } },
  exit:    { opacity: 0, x: 100, transition: { duration: 0.2 } },
};

export const heartToggle: Variants = {
  rest:   { scale: 1 },
  tap:    { scale: 1.4, transition: { type: "spring", damping: 10, stiffness: 400 } },
};

export const counterVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};
