"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { ConceptSwitcher } from "../_components/ConceptSwitcher";
import { SandField, setFlowMode, type FlowMode } from "./SandField";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Chapter = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  hijri: string;
  flow: FlowMode;
  /** CSS filter applied to the chapter pane for color grading. */
  filter: string;
  /** Tailwind background class for the chapter pane. */
  bg: string;
  clockSpeed: number; // multiplier
};

const CHAPTERS: Chapter[] = [
  {
    id: "frozen",
    kicker: "Chapter 0",
    title: "Time stood still.",
    body: "Before the journey, there is the moment of pause. The sand stops falling. The clock holds its breath. Scroll. Time will resume.",
    hijri: "—",
    flow: "frozen",
    filter: "saturate(0.4) brightness(0.85)",
    bg: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
    clockSpeed: 0,
  },
  {
    id: "before",
    kicker: "Chapter I",
    title: "Before. Your life today.",
    body: "Phone calls, deadlines, the noise of being needed. You walk briskly because there is always somewhere else to be.",
    hijri: "1446 AH",
    flow: "rising",
    filter: "hue-rotate(-10deg) saturate(0.6) contrast(1.05)",
    bg: "bg-gradient-to-br from-slate-800 via-slate-700 to-blue-950",
    clockSpeed: 1.5,
  },
  {
    id: "niyyah",
    kicker: "Chapter II",
    title: "Niyyah. The intention.",
    body: "A single thought: this year. Sand begins to pour faster than the world can catch it. Time slows around you.",
    hijri: "Rajab 1446",
    flow: "falling",
    filter: "hue-rotate(15deg) saturate(0.9) brightness(0.95)",
    bg: "bg-gradient-to-br from-amber-950 via-stone-800 to-slate-900",
    clockSpeed: 0.5,
  },
  {
    id: "preparation",
    kicker: "Chapter III",
    title: "Preparation. Tasks orbit you.",
    body: "Passport. Ihram. The dua you rehearse aloud. Each thing finds its way to your hands when you ask.",
    hijri: "Sha'ban 1446",
    flow: "orbit",
    filter: "hue-rotate(20deg) saturate(1.0) brightness(1.0)",
    bg: "bg-gradient-to-br from-amber-900 via-stone-700 to-amber-950",
    clockSpeed: 1.2,
  },
  {
    id: "departure",
    kicker: "Chapter IV",
    title: "Departure. Crossing sky.",
    body: "Engines hum. Below, your country recedes. Above, only horizon. You are between. You are arriving.",
    hijri: "Ramadan 1446",
    flow: "rushing",
    filter: "hue-rotate(180deg) saturate(0.85) contrast(1.1)",
    bg: "bg-gradient-to-br from-cyan-900 via-slate-800 to-orange-950",
    clockSpeed: 3,
  },
  {
    id: "mecca",
    kicker: "Chapter V",
    title: "Mecca. The center.",
    body: "Seven circumambulations. Seven heartbeats. The world becomes a single point and you are walking around it.",
    hijri: "Ramadan 14",
    flow: "spiral",
    filter: "hue-rotate(80deg) saturate(0.8) brightness(0.85) contrast(1.15)",
    bg: "bg-gradient-to-br from-emerald-950 via-stone-900 to-amber-950",
    clockSpeed: 0.3,
  },
  {
    id: "madinah",
    kicker: "Chapter VI",
    title: "Madinah. The peace.",
    body: "Soft rain on green domes. Whispered salaams. The Prophet's city, where the heart finally rests.",
    hijri: "Ramadan 21",
    flow: "drifting",
    filter: "hue-rotate(100deg) saturate(0.6) brightness(1.05)",
    bg: "bg-gradient-to-br from-emerald-900 via-slate-700 to-stone-200",
    clockSpeed: 0.8,
  },
  {
    id: "return",
    kicker: "Chapter VII",
    title: "Return. A new self.",
    body: "Same airport. Same city. Same job tomorrow. But the eyes that see all of it — those are different now.",
    hijri: "Shawwal 1",
    flow: "embers",
    filter: "hue-rotate(-10deg) saturate(1.1) brightness(1.05)",
    bg: "bg-gradient-to-br from-rose-900 via-amber-700 to-amber-300",
    clockSpeed: 1,
  },
];

export default function MizanPage() {
  const reduce = useReducedMotion();
  const wrapperRef = useRef<HTMLElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const track = trackRef.current;
    const wrapper = wrapperRef.current;
    if (!track || !wrapper) return;

    const ctx = gsap.context(() => {
      const total = CHAPTERS.length;
      gsap.to(track, {
        x: () => `-${(total - 1) * 100}vw`,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          scrub: 1,
          start: "top top",
          end:   () => `+=${(total - 1) * window.innerHeight}`,
          snap: {
            snapTo: 1 / (total - 1),
            duration: { min: 0.25, max: 0.7 },
            ease: "expo.out",
          },
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (total - 1));
            setActiveIdx(idx);
          },
        },
      });
    }, wrapper);

    return () => ctx.revert();
  }, [reduce]);

  // Sync sand flow mode to active chapter
  useEffect(() => {
    setFlowMode(CHAPTERS[activeIdx]!.flow);
  }, [activeIdx]);

  // Reduced-motion: vertical stack instead of horizontal pin
  if (reduce) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        {CHAPTERS.map((ch) => (
          <section
            key={ch.id}
            className={`flex min-h-screen items-center px-6 ${ch.bg}`}
            style={{ filter: ch.filter }}
          >
            <ChapterContent ch={ch} active />
          </section>
        ))}
        <ConceptSwitcher theme="dark" />
      </div>
    );
  }

  return (
    <>
      {!reduce && <SandField count={500} />}
      <HUD activeIdx={activeIdx} />
      <Minimap activeIdx={activeIdx} />

      <section
        ref={wrapperRef}
        className="relative h-screen overflow-hidden bg-slate-950 text-white"
      >
        <div
          ref={trackRef}
          className="flex h-full"
          style={{ width: `${CHAPTERS.length * 100}vw` }}
        >
          {CHAPTERS.map((ch, i) => (
            <article
              key={ch.id}
              className={`relative flex h-full w-screen shrink-0 items-center px-6 md:px-16 ${ch.bg}`}
              style={{
                filter: ch.filter,
                transition: "filter 1.2s ease-out",
              }}
            >
              <ChapterContent ch={ch} active={i === activeIdx} />
            </article>
          ))}
        </div>
      </section>

      <ScrollHint />
      <ConceptSwitcher theme="dark" />
    </>
  );
}

/* -------- HUD: Hijri counter + analog clock -------- */

function HUD({ activeIdx }: { activeIdx: number }) {
  const ch = CHAPTERS[activeIdx]!;
  return (
    <>
      {/* Hijri counter */}
      <motion.div
        key={ch.hijri}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pointer-events-none fixed left-6 top-6 z-40 font-mono text-[10px] uppercase tracking-[0.4em] text-white/80 md:text-xs"
      >
        <span className="text-white/40">Now ·</span> {ch.hijri}
      </motion.div>

      {/* Analog clock */}
      <Clock speed={ch.clockSpeed} />
    </>
  );
}

function Clock({ speed }: { speed: number }) {
  const minuteRef = useRef<SVGLineElement>(null);
  const hourRef   = useRef<SVGLineElement>(null);

  useEffect(() => {
    if (!minuteRef.current || !hourRef.current) return;
    if (speed === 0) {
      // Frozen with subtle tremor
      gsap.to(minuteRef.current, {
        rotation: "+=0.5",
        repeat: -1, yoyo: true,
        duration: 0.6, ease: "sine.inOut",
        transformOrigin: "50% 100%",
      });
      gsap.to(hourRef.current, {
        rotation: "+=0.3",
        repeat: -1, yoyo: true,
        duration: 0.7, ease: "sine.inOut",
        transformOrigin: "50% 100%",
      });
      return () => { gsap.killTweensOf([minuteRef.current, hourRef.current]); };
    }
    const min = gsap.to(minuteRef.current, {
      rotation: "+=360",
      duration: 6 / speed,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 100%",
    });
    const hr  = gsap.to(hourRef.current, {
      rotation: "+=360",
      duration: 72 / speed,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 100%",
    });
    return () => { min.kill(); hr.kill(); };
  }, [speed]);

  return (
    <div className="pointer-events-none fixed right-6 top-6 z-40 hidden md:block">
      <svg viewBox="-22 -22 44 44" className="h-12 w-12 text-white/80">
        <circle cx={0} cy={0} r={20} fill="none" stroke="currentColor" strokeWidth={0.6} opacity={0.5} />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6;
          return (
            <line
              key={i}
              x1={Math.sin(a) * 16} y1={-Math.cos(a) * 16}
              x2={Math.sin(a) * 19} y2={-Math.cos(a) * 19}
              stroke="currentColor" strokeWidth={0.5} opacity={0.5}
            />
          );
        })}
        <line ref={hourRef}   x1={0} y1={0} x2={0} y2={-9}  stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
        <line ref={minuteRef} x1={0} y1={0} x2={0} y2={-15} stroke="currentColor" strokeWidth={0.8} strokeLinecap="round" />
        <circle cx={0} cy={0} r={1} fill="currentColor" />
      </svg>
    </div>
  );
}

/* -------- MINIMAP -------- */

function Minimap({ activeIdx }: { activeIdx: number }) {
  return (
    <nav className="pointer-events-none fixed bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1.5">
      {CHAPTERS.map((ch, i) => (
        <span
          key={ch.id}
          className="h-px transition-all duration-500"
          style={{
            width: i === activeIdx ? 40 : 16,
            backgroundColor:
              i === activeIdx ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)",
          }}
        />
      ))}
    </nav>
  );
}

/* -------- CHAPTER CONTENT -------- */

function ChapterContent({ ch, active }: { ch: Chapter; active: boolean }) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-3xl">
      <motion.p
        animate={{ opacity: active ? 1 : 0.4, x: active ? 0 : -8 }}
        transition={{ duration: 0.7 }}
        className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/70"
      >
        {ch.kicker}
      </motion.p>

      <motion.h2
        animate={{
          opacity: active ? 1 : 0.3,
          y: active ? 0 : 10,
          filter: active ? "blur(0px)" : "blur(4px)",
        }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 font-display text-4xl leading-[1.05] tracking-tight md:text-7xl"
      >
        {ch.title}
      </motion.h2>

      <motion.p
        animate={{ opacity: active ? 0.85 : 0.2, y: active ? 0 : 6 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mt-6 max-w-xl text-base text-white/80 md:text-lg"
      >
        {ch.body}
      </motion.p>

      {ch.id === "return" && (
        <motion.button
          animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 rounded-full bg-white px-8 py-3.5 text-sm font-medium text-slate-900 shadow-lg transition-transform hover:scale-105"
        >
          Begin your story →
        </motion.button>
      )}
    </div>
  );
}

/* -------- SCROLL HINT -------- */

function ScrollHint() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.6, 0.6, 0] }}
      transition={{
        duration: 6,
        delay: 2,
        times: [0, 0.15, 0.85, 1],
        repeat: Infinity,
      }}
      className="pointer-events-none fixed bottom-32 left-1/2 z-40 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-white/60"
    >
      Scroll · time will move
    </motion.div>
  );
}
