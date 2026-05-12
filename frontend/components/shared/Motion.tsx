"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

/* -------------------------------------------------------------------- */
/*  Counter — animated number, fires once on scroll-into-view           */
/* -------------------------------------------------------------------- */

interface CounterProps {
  /** Final value to animate to. */
  to: number;
  /** Animation duration in ms. */
  duration?: number;
  /** Number of decimal places. e.g. 4.9 → places=1 */
  places?: number;
  /** Prefix shown before the number (e.g. "$"). */
  prefix?: string;
  /** Suffix shown after the number (e.g. "+", "K+", "★"). */
  suffix?: string;
  /**
   * Display the value rounded to thousands as "K" — e.g. 50000 → 50K.
   * Useful for big-number stats.
   */
  short?: boolean;
  className?: string;
}

/**
 * Counts up to `to` over `duration` ms, easing out cubic.
 * Fires once when the element enters the viewport.
 */
export function Counter({
  to,
  duration = 1500,
  places = 0,
  prefix = "",
  suffix = "",
  short = false,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce ? to : 0);
  const display = useTransform(mv, (v) => {
    const value = short && v >= 1000
      ? `${(v / 1000).toFixed(places)}K`
      : v.toFixed(places);
    return `${prefix}${value}${suffix}`;
  });

  useEffect(() => {
    if (!inView || reduce) {
      mv.set(to);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      mv.set(eased * to);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduce, mv]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{display}</motion.span>
    </span>
  );
}

/* -------------------------------------------------------------------- */
/*  Reveal — fade + slide up on scroll-into-view                         */
/* -------------------------------------------------------------------- */

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Initial Y offset in pixels. */
  y?: number;
  /** Animation duration in seconds. */
  duration?: number;
  /** Delay before animation starts. */
  delay?: number;
  /** Trigger amount (0..1) of element visible to fire. */
  amount?: number;
  /** Render as this tag instead of div. */
  as?: "div" | "section" | "article" | "li";
}

const revealVariants: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function Reveal({
  children,
  className,
  y = 24,
  duration = 0.55,
  delay = 0,
  amount = 0.25,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const Comp = motion[as];

  if (reduce) {
    if (as === "section") return <section className={className}>{children}</section>;
    if (as === "article") return <article className={className}>{children}</article>;
    if (as === "li")      return <li      className={className}>{children}</li>;
    return <div className={className}>{children}</div>;
  }

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      variants={revealVariants}
    >
      {children}
    </Comp>
  );
}

/* -------------------------------------------------------------------- */
/*  HoverLift — consistent hover lift + shadow growth for cards          */
/* -------------------------------------------------------------------- */

interface HoverLiftProps {
  children: ReactNode;
  className?: string;
  /** Disables the lift (for grids/lists where parent handles it). */
  disabled?: boolean;
  /** Lift distance in px. Default -4. */
  liftY?: number;
}

export function HoverLift({
  children,
  className,
  disabled = false,
  liftY = -4,
}: HoverLiftProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      whileHover={!disabled && !reduce ? { y: liftY } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------- */
/*  Marquee — infinite horizontal scroll for brand strips, tickers       */
/* -------------------------------------------------------------------- */

interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full loop. Lower = faster. Default 30. */
  duration?: number;
  className?: string;
}

/**
 * Infinite horizontal scroll. Children should be repeatable content
 * (e.g. brand logos, testimonial avatars). Auto-duplicates so the loop
 * is seamless. Edges fade via mask-image. Honors reduced motion.
 */
export function Marquee({ children, duration = 30, className }: MarqueeProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-12 ${className ?? ""}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden ${className ?? ""}`}
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <motion.div
        className="flex w-max gap-12 will-change-transform"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
