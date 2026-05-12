"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useMotionValue,
  animate,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ConceptSwitcher } from "../_components/ConceptSwitcher";

export default function MirajPage() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 22 });

  return (
    <div ref={containerRef} className="relative bg-black text-white">
      <SkyBackdrop progress={smoothProgress} />
      <CloudLayer progress={smoothProgress} depth="back" />
      <CloudLayer progress={smoothProgress} depth="mid" />
      {!reduce && <FlightPath progress={smoothProgress} />}
      <CloudLayer progress={smoothProgress} depth="front" />
      <BoardingPassHUD progress={smoothProgress} />
      <StarField progress={smoothProgress} />

      <Tarmac />
      <Climbing />
      <Cruise />
      <Approach />
      <Touchdown />

      <ConceptSwitcher theme="dark" />
    </div>
  );
}

/* -------- BACKDROP: time-of-day gradient interpolated by scroll -------- */

function SkyBackdrop({ progress }: { progress: any }) {
  const bg = useTransform(
    progress,
    [0, 0.18, 0.45, 0.7, 0.9, 1],
    [
      "linear-gradient(180deg, #ff8c5a 0%, #ff5e7a 40%, #2d1b4e 100%)", // tarmac sunset
      "linear-gradient(180deg, #ff5e7a 0%, #6a3e7e 50%, #1a1542 100%)", // climbing dusk
      "linear-gradient(180deg, #0a0e27 0%, #0a0e27 100%)",              // night cruise
      "linear-gradient(180deg, #1a1542 0%, #4a3068 50%, #ff8c5a 100%)", // descent
      "linear-gradient(180deg, #ff8c5a 0%, #fde7c5 60%, #ffd97f 100%)", // approach dawn
      "linear-gradient(180deg, #fde7c5 0%, #ffd97f 100%)",              // arrival
    ],
  );
  return (
    <motion.div
      style={{ background: bg }}
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}

/* -------- CLOUD LAYERS: parallax depth -------- */

function CloudLayer({ progress, depth }: { progress: any; depth: "back" | "mid" | "front" }) {
  const config = {
    back:  { speed: -200,  blur: 6, opacity: 0.35, count: 5, size: 360, top: 18 },
    mid:   { speed: -560,  blur: 3, opacity: 0.45, count: 4, size: 480, top: 38 },
    front: { speed: -1100, blur: 1, opacity: 0.55, count: 3, size: 640, top: 58 },
  }[depth];

  const y = useTransform(progress, [0, 1], [0, config.speed]);

  const clouds = useMemo(
    () =>
      Array.from({ length: config.count }, (_, i) => ({
        left: (i * 100) / config.count + Math.random() * 12 - 6,
        top:  config.top + Math.random() * 22 - 11,
        scale: 0.7 + Math.random() * 0.6,
      })),
    [config.count, config.top],
  );

  return (
    <motion.div
      style={{ y, opacity: config.opacity, filter: `blur(${config.blur}px)` }}
      className="pointer-events-none fixed inset-0 z-[1]"
    >
      {clouds.map((c, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${c.left}%`,
            top:  `${c.top}%`,
            width:  config.size * c.scale,
            height: config.size * 0.4 * c.scale,
            opacity: 0.6,
            filter: "blur(40px)",
          }}
        />
      ))}
    </motion.div>
  );
}

/* -------- STAR FIELD: appears at night (45–75% scroll) -------- */

function StarField({ progress }: { progress: any }) {
  const opacity = useTransform(progress, [0.35, 0.45, 0.7, 0.78], [0, 0.85, 0.85, 0]);
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 70,
        size: 0.8 + Math.random() * 1.6,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3,
      })),
    [],
  );
  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none fixed inset-0 z-[2]"
    >
      {stars.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </motion.div>
  );
}

/* -------- FLIGHT PATH: SVG path, plane moves with scroll -------- */

function FlightPath({ progress }: { progress: any }) {
  // Curved path from bottom-left to top-right (taxi → climb → cruise → descent)
  const d = "M 80 540 C 200 540, 280 360, 480 280 S 800 220, 1100 130 S 1500 80, 1820 100";
  const planeOffset = useTransform(progress, [0, 1], ["0%", "100%"]);
  const pathOpacity = useTransform(progress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  return (
    <svg
      viewBox="0 0 1920 600"
      className="pointer-events-none fixed inset-0 z-[3] h-screen w-screen"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="flightGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(255,202,1,0)"   />
          <stop offset="50%"  stopColor="rgba(255,202,1,0.7)" />
          <stop offset="100%" stopColor="rgba(255,202,1,0)"   />
        </linearGradient>
        <filter id="planeGlow">
          <feGaussianBlur stdDeviation="2.5" />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>

      {/* Drawn path */}
      <motion.path
        d={d}
        fill="none"
        stroke="url(#flightGrad)"
        strokeWidth={1.5}
        strokeDasharray="4 6"
        style={{ pathLength: progress, opacity: pathOpacity }}
      />

      {/* Plane on offsetPath */}
      <motion.g
        style={{
          offsetPath: `path("${d}")`,
          offsetDistance: planeOffset,
          offsetRotate: "auto",
        }}
      >
        <Plane />
      </motion.g>
    </svg>
  );
}

function Plane() {
  return (
    <g>
      {/* Engine glow */}
      <motion.circle
        cx={-22} cy={0} r={6} fill="#ff7b3a"
        filter="url(#planeGlow)"
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.85, 1.15, 0.85] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Fuselage */}
      <path d="M-20 0 L 26 -2 L 30 0 L 26 2 Z" fill="#fde7c5" stroke="#0a0e27" strokeWidth={0.5} />
      {/* Wings */}
      <motion.g
        animate={{ scaleY: [1, 1.02, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "0.5", originY: "0.5" }}
      >
        <path d="M-4 -1 L 12 -16 L 16 -16 L 8 -1 Z" fill="#ffca01" />
        <path d="M-4 1  L 12  16 L 16  16 L 8  1 Z" fill="#ffca01" />
      </motion.g>
      {/* Tail */}
      <path d="M-18 0 L -22 -10 L -18 -2 Z" fill="#ffca01" />
      {/* Wingtip strobes */}
      <motion.circle
        cx={16} cy={-16} r={1.4} fill="#ff3a3a"
        animate={{ opacity: [1, 0, 1, 0, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, times: [0, 0.4, 0.45, 0.85, 1] }}
      />
      <motion.circle
        cx={16} cy={16} r={1.4} fill="#ffffff"
        animate={{ opacity: [1, 0, 1, 0, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, times: [0, 0.4, 0.45, 0.85, 1], delay: 0.8 }}
      />
    </g>
  );
}

/* -------- BOARDING PASS HUD -------- */

function BoardingPassHUD({ progress }: { progress: any }) {
  const [pct, setPct] = useState(0);
  const [alt, setAlt] = useState(0);

  useEffect(() => {
    return progress.on("change", (v: number) => {
      setPct(Math.round(v * 100));
      // Simulate altitude profile: climb to 35,000 by 30%, cruise, descend after 75%
      let a = 0;
      if (v < 0.3)      a = (v / 0.3) * 35000;
      else if (v < 0.75) a = 35000;
      else              a = 35000 * (1 - (v - 0.75) / 0.25);
      setAlt(Math.round(a / 1000) * 1000);
    });
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed right-4 top-4 z-40 hidden w-72 rounded-2xl bg-black/60 p-4 font-mono text-xs text-white/90 ring-1 ring-white/15 backdrop-blur md:block"
    >
      <div className="flex items-center justify-between border-b border-white/15 pb-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-amber-400">Boarding Pass</span>
        <span className="text-[10px] text-white/50">UMR 2026</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-[11px]">
        <div>
          <div className="text-white/40">Passenger</div>
          <div className="font-medium">Guest Pilgrim</div>
        </div>
        <div>
          <div className="text-white/40">Class</div>
          <div className="font-medium">Niyyah</div>
        </div>
        <div>
          <div className="text-white/40">From</div>
          <div className="font-medium">MCT · Muscat</div>
        </div>
        <div>
          <div className="text-white/40">To</div>
          <div className="font-medium">JED · Mecca</div>
        </div>
        <div>
          <div className="text-white/40">Altitude</div>
          <div className="font-medium tabular-nums">FL {(alt / 100).toFixed(0).padStart(3, "0")}</div>
        </div>
        <div>
          <div className="text-white/40">Progress</div>
          <div className="font-medium tabular-nums">{pct}%</div>
        </div>
      </div>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-200"
          style={{ width: `${pct}%` }}
        />
      </div>
    </motion.div>
  );
}

/* -------- TARMAC (hero) -------- */

function Tarmac() {
  return (
    <section className="relative z-10 flex h-screen flex-col items-center justify-center px-6 text-center">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-300"
      >
        Now boarding · Gate 1
      </motion.p>
      <motion.h1
        initial="hidden" animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.2, delayChildren: 0.4 } } }}
        className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
      >
        {["Your journey to Mecca", "begins above the clouds."].map((line) => (
          <motion.span
            key={line}
            className="block overflow-hidden pb-2"
            variants={{
              hidden:  { clipPath: "inset(100% 0 0 0)", y: 30 },
              visible: { clipPath: "inset(0% 0 0 0)", y: 0,
                transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            {line}
          </motion.span>
        ))}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.6 }}
        className="mt-6 max-w-xl text-base text-white/80"
      >
        Scroll. The plane will fly with you. Each section is an altitude.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2.0, type: "spring", stiffness: 110, damping: 18 }}
        className="mt-10"
      >
        <button className="rounded-full bg-amber-400 px-8 py-3.5 text-sm font-medium text-black shadow-[0_0_50px_rgba(255,202,1,0.4)] transition-shadow hover:shadow-[0_0_70px_rgba(255,202,1,0.7)]">
          Begin boarding
        </button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 2.6, duration: 0.6 },
          y:       { delay: 2.6, duration: 2.4, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute bottom-10 text-xs uppercase tracking-[0.4em] text-white/60"
      >
        Scroll to take off ↓
      </motion.div>
    </section>
  );
}

/* -------- CLIMBING (3,000 ft) -------- */

function Climbing() {
  return (
    <Altitude marker="3,000 ft · Climbing">
      <h2 className="font-display text-3xl tracking-tight md:text-5xl">
        Why now?
      </h2>
      <p className="mt-4 max-w-xl text-white/80">
        The Quran does not say <em>if</em> you are able. It says <em>when</em>. The right moment is the one you choose.
      </p>
      <blockquote className="mt-8 max-w-md border-l-2 border-amber-400 pl-4 text-right" style={{ direction: "rtl" }}>
        <p className="font-display text-xl text-amber-300">وَأَذِّن فِي ٱلنَّاسِ بِٱلْحَجِّ يَأْتُوكَ رِجَالًۭا</p>
        <p className="mt-2 text-sm italic text-white/60" style={{ direction: "ltr" }}>
          "And proclaim to the people the pilgrimage; they will come to you on foot." — 22:27
        </p>
      </blockquote>
    </Altitude>
  );
}

/* -------- CRUISE (35,000 ft) — featured destinations -------- */

function Cruise() {
  return (
    <Altitude marker="35,000 ft · Cruising">
      <h2 className="font-display text-3xl tracking-tight md:text-5xl">
        Three destinations on the route.
      </h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          { title: "Mecca · 7 nights",   sub: "Premium · 80m to Haram", price: "OMR 1,290" },
          { title: "Mecca + Medina · 14", sub: "Standard · 350m",        price: "OMR 1,840" },
          { title: "Last 10 of Ramadan",  sub: "Group · 700m",           price: "OMR   980" },
        ].map((d, i) => (
          <motion.div
            key={d.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur"
          >
            <p className="text-xs uppercase tracking-widest text-amber-400">{d.sub}</p>
            <h3 className="mt-2 font-medium text-lg">{d.title}</h3>
            <p className="mt-3 font-mono text-sm tabular-nums text-amber-300">{d.price} <span className="text-xs text-white/50">/ traveler</span></p>
          </motion.div>
        ))}
      </div>
    </Altitude>
  );
}

/* -------- APPROACH (descent) -------- */

function Approach() {
  return (
    <Altitude marker="Final approach · Descending">
      <h2 className="font-display text-3xl tracking-tight md:text-5xl">
        Mecca's lights, on the horizon.
      </h2>
      <p className="mt-4 max-w-xl text-white/80">
        Right now, more than 23,000 souls are circumambulating the Kaaba.
        Every minute, dozens land. Every minute, dozens depart for home — changed.
      </p>
      <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/40 px-5 py-3 text-sm backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
        <span className="font-mono text-white/80">Live · 23,847 in Tawaf right now</span>
      </div>
    </Altitude>
  );
}

/* -------- TOUCHDOWN (CTA) -------- */

function Touchdown() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const kaabaScale = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
  const kaabaOp    = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);

  return (
    <section
      ref={ref}
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-32 pt-24 text-center"
    >
      <motion.div
        style={{ scale: kaabaScale, opacity: kaabaOp }}
        className="relative mx-auto h-40 w-32 rounded-sm shadow-[0_0_120px_rgba(255,202,1,0.5)] md:h-56 md:w-44"
      >
        <div className="absolute inset-0 rounded-sm bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]" />
        <div className="absolute inset-x-3 top-3 h-2 rounded-sm bg-amber-400" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="mt-12 font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-400"
      >
        Touchdown · Mecca
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 max-w-2xl font-display text-4xl tracking-tight md:text-6xl"
      >
        You've arrived. Now make it real.
      </motion.h2>

      <motion.button
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 110, damping: 18 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        className="mt-10 rounded-full bg-amber-400 px-10 py-4 text-sm font-medium text-black shadow-[0_0_60px_rgba(255,202,1,0.45)] hover:shadow-[0_0_80px_rgba(255,202,1,0.7)] transition-shadow"
      >
        Book your boarding pass →
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.5 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ delay: 1.2 }}
        className="mt-16 text-xs uppercase tracking-[0.3em] text-white/40"
      >
        Mi'raj · Concept 1 of 3 (new)
      </motion.p>
    </section>
  );
}

/* -------- ALTITUDE WRAPPER -------- */

function Altitude({ marker, children }: { marker: string; children: React.ReactNode }) {
  return (
    <section className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-32">
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-300"
      >
        {marker}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="mt-3"
      >
        {children}
      </motion.div>
    </section>
  );
}
