"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface AirplaneDecorationProps {
  className?: string;
  /** Parallax scroll speed multiplier (0.2 = slow, 0.5 = medium) */
  speed?: number;
  /** SVG path for the dotted trail */
  pathD?: string;
  /** Mirror for RTL */
  flip?: boolean;
}

export default function AirplaneDecoration({
  className,
  speed = 0.3,
  flip = false,
}: AirplaneDecorationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 50}%`]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, flip ? -15 : 15]);

  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none select-none absolute overflow-visible",
        className
      )}
      aria-hidden="true"
    >
      {/* Dotted curved path */}
      <svg
        width="200"
        height="120"
        viewBox="0 0 200 120"
        fill="none"
        className="absolute inset-0 opacity-30"
        style={{ transform: flip ? "scaleX(-1)" : undefined }}
      >
        <path
          d="M 0 100 Q 50 20 100 60 Q 150 100 200 20"
          stroke="#15803D"
          strokeDasharray="6 4"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      {/* Airplane SVG following parallax */}
      <motion.div
        style={{ y, x, rotate }}
        className="relative"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="#15803D"
          className={cn("drop-shadow-sm", flip && "scale-x-[-1]")}
        >
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      </motion.div>
    </div>
  );
}

/** Small decorative star/sparkle shape used throughout */
export function StarDecoration({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none select-none", className)} aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#F59E0B" opacity="0.7">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
      </svg>
    </div>
  );
}
