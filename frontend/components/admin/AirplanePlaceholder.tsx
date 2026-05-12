"use client";

/*
 * AirplanePlaceholder
 * --------------------
 * Tries to load a real PNG first (drop files into /public/images/ to activate):
 *   /images/plane-card.png   — 3/4 side view for summary cards
 *   /images/plane-left.png   — ascending angle for left decoration
 *   /images/plane-right.png  — bottom-right decoration
 *
 * Falls back to a premium inline SVG that already looks great.
 * To switch to PNGs: just drop the files in /public/images/ — code auto-detects.
 */

import Image from "next/image";
import { useState, useId } from "react";

/* ── Shared path map ──────────────────────────────────────── */
export const PLANE_PATHS = {
  card:  "/images/plane-card.png",
  left:  "/images/plane-left.png",
  right: "/images/plane-right.png",
} as const;

/* ─────────────────────────────────────────────────────────── */
/* SVG VARIANT: side-elevated view (nose pointing right)       */
/* Used for: stat cards, bottom-right decoration               */
/* ─────────────────────────────────────────────────────────── */
function PlaneSVGSide({ scale = 1 }: { scale?: number }) {
  const uid = useId().replace(/:/g, "");
  const bId  = `b${uid}`;
  const wId  = `w${uid}`;

  const wins = [68, 85, 102, 119, 136, 153, 170, 187, 204, 221, 238];

  return (
    <svg
      viewBox="0 0 280 160"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      <defs>
        <linearGradient id={bId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d8ecff" />
        </linearGradient>
        <linearGradient id={wId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.93)" />
          <stop offset="100%" stopColor="rgba(185,222,255,0.62)" />
        </linearGradient>
        <filter id={`sh${uid}`} x="-15%" y="-40%" width="130%" height="180%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="rgba(0,0,0,0.28)" />
        </filter>
        <filter id={`gl${uid}`} x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feFlood floodColor="#1abc9c" floodOpacity="0.18" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Ground glow */}
      <ellipse cx="145" cy="152" rx="105" ry="8" fill="rgba(26,188,156,0.16)" />

      {/* Fuselage */}
      <path
        d="M22 80 Q50 67 218 72 Q247 73 263 80 Q247 87 218 88 Q50 93 22 80Z"
        fill={`url(#${bId})`}
        filter={`url(#sh${uid})`}
      />

      {/* Upper wing */}
      <path d="M118 72 L79 18 L101 24 L136 70Z" fill={`url(#${wId})`} />
      {/* Lower wing (foreshortened) */}
      <path d="M118 88 L79 132 L101 136 L136 90Z" fill="rgba(226,240,255,0.76)" />

      {/* Upper engine nacelle */}
      <ellipse cx="83" cy="21" rx="15" ry="5" fill="#1e2d3d" transform="rotate(-28,83,21)" />
      <ellipse cx="76" cy="20" rx="6"  ry="3" fill="#1abc9c99" transform="rotate(-28,76,20)" />

      {/* Lower engine nacelle */}
      <ellipse cx="83" cy="133" rx="15" ry="5" fill="#1e2d3d" transform="rotate(28,83,133)" />
      <ellipse cx="76" cy="134" rx="6"  ry="3" fill="#1abc9c99" transform="rotate(28,76,134)" />

      {/* Vertical tail fin */}
      <path d="M24 80 L17 32 L40 40 L40 77Z" fill="#1abc9c" />
      {/* Horizontal stabilizer — upper */}
      <path d="M23 76 L2 59 L7 67 L23 80Z" fill="#1abc9c" />
      {/* Horizontal stabilizer — lower */}
      <path d="M23 84 L2 101 L7 93 L23 80Z" fill="#1abc9c" />

      {/* Windows */}
      {wins.map((x, i) => (
        <rect key={i} x={x} y="76" width="9" height="5.5" rx="2.5"
          fill="rgba(180,220,255,0.85)" />
      ))}

      {/* Top fuselage highlight */}
      <path d="M54 70 Q158 65 255 71" stroke="rgba(255,255,255,0.72)"
        strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Nose tip */}
      <ellipse cx="261" cy="80" rx="3" ry="2" fill="rgba(220,240,255,0.7)" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* SVG VARIANT: ascending (rotated, for left decoration)       */
/* ─────────────────────────────────────────────────────────── */
function PlaneSVGAscending() {
  return (
    <div style={{ width: "100%", height: "100%", transform: "rotate(-32deg)", transformOrigin: "center" }}>
      <PlaneSVGSide />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* Public component                                            */
/* ─────────────────────────────────────────────────────────── */
interface AirplanePlaceholderProps {
  variant?: "card" | "left" | "right";
  className?: string;
  style?: React.CSSProperties;
}

export default function AirplanePlaceholder({
  variant = "card",
  className = "",
  style,
}: AirplanePlaceholderProps) {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <div className={className} style={{ position: "relative", ...style }}>
      {!useFallback ? (
        <Image
          src={PLANE_PATHS[variant]}
          alt=""
          fill
          className="object-contain"
          onError={() => setUseFallback(true)}
          priority
        />
      ) : variant === "left" ? (
        <PlaneSVGAscending />
      ) : (
        <PlaneSVGSide />
      )}
    </div>
  );
}
