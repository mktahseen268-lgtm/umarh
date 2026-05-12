"use client";

/**
 * FlightAnimation
 * ---------------
 * Animates the three frontend plane images along a bezier path that
 * matches the dotted trail embedded in each image.
 *
 * Images used (all in /public/images/):
 *   left-plane-bg.png       → plane + ascending arc (bottom-left → top-right)
 *   right-plane-bg.png      → plane + descending arc (top-left → bottom-right)
 *   about-us-plane-left.png → plane + diagonal arc (top-left → bottom-right)
 *
 * Each image is self-contained — it includes the plane silhouette and its
 * dotted trail. The component animates the whole image along an SVG
 * offset-path whose direction matches the trail already baked into the PNG.
 *
 * Usage:
 *   <FlightAnimation variant="left"  style={{ width: 240, height: 240 }} />
 *   <FlightAnimation variant="right" style={{ width: 240, height: 240 }} />
 *   <FlightAnimation variant="about" style={{ width: 220, height: 220 }} />
 *   <FlightLeft  style={{ ... }} />   ← named preset shorthand
 *   <FlightRight style={{ ... }} />
 *   <FlightAbout style={{ ... }} />
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// ─── Image map ────────────────────────────────────────────────────────────
// Only the three frontend images are used. The admin images
// (plane-left.png, plane-right.png) are NOT used here.

const IMAGES = {
  left:  "/images/left-plane-bg.png",
  right: "/images/right-plane-bg.png",
  about: "/images/about-us-plane-left.png",
} as const;

type Variant = keyof typeof IMAGES;

// ─── Path definitions (600 × 480 reference space) ─────────────────────────
//
// Each path direction matches the dotted trail visible in the corresponding
// PNG so the image looks like it's flying in the right direction.
//
// left  → ascending  : enters bottom-left, dips slightly, rises to top-right
// right → descending : enters top-left, curves down through centre, exits bottom-right
// about → diagonal   : enters top-left, sweeps diagonally down to bottom-right

const REF_W = 600;
const REF_H = 480;

const PATHS: Record<Variant, string> = {
  // Matches left-plane-bg.png — ascending arc, plane at top-right end
  left: "M 20,430 C 110,470 230,455 340,370 C 430,300 490,210 545,120 C 565,78 572,48 578,22",

  // Matches right-plane-bg.png — descending arc, plane at top-left end
  right: "M 22,22 C 110,26 230,80 340,185 C 420,265 480,360 570,450",

  // Matches about-us-plane-left.png — diagonal, plane at bottom-right end
  about: "M 35,45 C 140,38 260,115 370,230 C 445,315 510,400 575,462",
};

// ─── Props ────────────────────────────────────────────────────────────────

interface FlightAnimationProps {
  /**
   * Which image + path to use.
   * @default "left"
   */
  variant?: Variant;

  /**
   * Full loop duration in seconds.
   * @default 8
   */
  duration?: number;

  /**
   * Rendered size of the image at the reference scale (px, square).
   * The image itself determines the visual proportions.
   * @default 180
   */
  imageSize?: number;

  /**
   * Easing for the path traversal.
   * @default "easeInOut"
   */
  ease?: "linear" | "easeInOut" | "easeIn" | "easeOut";

  /** Extra CSS classes on the outer wrapper. */
  className?: string;

  /** Inline styles on the outer wrapper (set width / height here). */
  style?: React.CSSProperties;

  /**
   * Render the SVG path as a debug overlay.
   * @default false
   */
  debug?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────

export default function FlightAnimation({
  variant   = "left",
  duration  = 8,
  imageSize = 180,
  ease      = "easeInOut",
  className = "",
  style,
  debug     = false,
}: FlightAnimationProps) {
  const src  = IMAGES[variant];
  const path = PATHS[variant];

  // ── Responsive scaling ─────────────────────────────────────────────────
  // The motion canvas is drawn in REF_W × REF_H space, then CSS-scaled to
  // match the actual container so the path stays aligned at any container size.
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      setScale(Math.min(width / REF_W, height / REF_H));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Glow: subtle teal bloom so the plane reads well on any background ──
  const glow =
    "drop-shadow(0 0 12px rgba(26,188,156,0.45)) " +
    "drop-shadow(0 0  5px rgba(26,188,156,0.25)) " +
    "drop-shadow(0 4px 8px rgba(0,0,0,0.18))";

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={`relative select-none pointer-events-none overflow-visible ${className}`}
      style={style}
    >
      {/* ── Motion canvas: reference coordinate space, CSS-scaled ─────── */}
      <div
        style={{
          position      : "absolute",
          top           : 0,
          left          : 0,
          width         : REF_W,
          height        : REF_H,
          transform     : `scale(${scale})`,
          transformOrigin: "top left",
          pointerEvents : "none",
        }}
      >
        {/* ── Debug overlay ─────────────────────────────────────────── */}
        {debug && (
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
          >
            <path d={path} fill="none" stroke="red" strokeWidth={2} strokeDasharray="6 4" />
          </svg>
        )}

        {/* ── Primary motion: travel along the bezier offset-path ───── */}
        <motion.div
          style={{
            position    : "absolute",
            top         : 0,
            left        : 0,
            // Attach to the CSS Motion Path — direction determined by the path
            offsetPath  : `path('${path}')`,
            // The image already shows the plane at the correct angle for its
            // direction, so we disable auto-rotation to keep the image upright.
            offsetRotate: "0deg",
            willChange  : "transform",
          }}
          animate={{ offsetDistance: ["0%", "100%"] }}
          transition={{
            duration,
            repeat    : Infinity,
            ease,
            repeatType: "loop",
          }}
        >
          {/* ── Secondary motion: floating oscillation ─────────────── */}
          <motion.div
            animate={{ y: [-6, 6, -6] }}
            transition={{
              duration  : 3,
              repeat    : Infinity,
              ease      : "easeInOut",
              delay     : 0.5,
            }}
            style={{
              // Centre the image on the path point
              marginLeft : -imageSize / 2,
              marginTop  : -imageSize / 2,
              filter     : glow,
            }}
          >
            <Image
              src={src}
              alt=""
              width={imageSize}
              height={imageSize}
              style={{ display: "block" }}
              priority
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Named presets ────────────────────────────────────────────────────────

export function FlightLeft(props: Omit<FlightAnimationProps, "variant">) {
  return <FlightAnimation variant="left" {...props} />;
}

export function FlightRight(props: Omit<FlightAnimationProps, "variant">) {
  return <FlightAnimation variant="right" {...props} />;
}

export function FlightAbout(props: Omit<FlightAnimationProps, "variant">) {
  return <FlightAnimation variant="about" {...props} />;
}
