"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * App Router page transition for marketing routes.
 * `template.tsx` re-mounts on navigation (unlike `layout.tsx`), so this fires
 * on every Home → Packages → Tour → Checkout transition.
 *
 * Subtle by design: 250ms fade + 8px slide. UI stays visible the entire time.
 * Honors `prefers-reduced-motion`.
 */
export default function MarketingTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
