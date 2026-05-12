"use client";

import { motion } from "framer-motion";

/**
 * Skeleton placeholder that matches PackageCard dimensions exactly.
 * Used by /packages while filter changes are loading. Prevents CLS.
 *
 * Dimensions tracked from PackageCard.tsx:
 *   - rounded-2xl card
 *   - h-48 image area
 *   - p-4 content
 *   - 4 content rows: location · title (2 lines) · rating · footer
 */
export default function SkeletonCard() {
  return (
    <motion.div
      role="status"
      aria-label="Loading package"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl overflow-hidden shadow-card"
    >
      {/* Image area */}
      <div className="relative h-48 bg-neutral-200 overflow-hidden">
        <Shimmer />
      </div>

      {/* Content area */}
      <div className="p-4">
        {/* Location row */}
        <div className="flex items-center gap-1 mb-1.5">
          <div className="h-2.5 w-3 rounded-sm bg-neutral-200" />
          <div className="h-2.5 w-16 rounded-sm bg-neutral-200" />
        </div>

        {/* Title — 2 lines */}
        <div className="space-y-1.5 mb-2">
          <div className="h-3.5 w-full rounded-sm bg-neutral-200" />
          <div className="h-3.5 w-3/5 rounded-sm bg-neutral-200" />
        </div>

        {/* Rating row */}
        <div className="flex items-center gap-1 mb-3">
          <div className="h-3 w-3 rounded-sm bg-neutral-200" />
          <div className="h-3 w-8 rounded-sm bg-neutral-200" />
          <div className="h-3 w-10 rounded-sm bg-neutral-200" />
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-14 rounded-sm bg-neutral-200" />
          <div className="h-3.5 w-20 rounded-sm bg-neutral-200" />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Single shimmer overlay reused across the skeleton.
 * Translates a soft gradient across the surface every 1.6s.
 */
function Shimmer() {
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 -translate-x-full"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
      }}
      animate={{ x: ["-100%", "100%"] }}
      transition={{ duration: 1.6, ease: "linear", repeat: Infinity }}
    />
  );
}

export function SkeletonCardGrid({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={`sk-${i}`} />
      ))}
    </>
  );
}
