"use client";

import dynamic from "next/dynamic";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useState } from "react";
import { ConceptSwitcher } from "../_components/ConceptSwitcher";

// Three.js / shader code lazy-loaded — never bundled into other routes
const PortalShader = dynamic(
  () => import("./PortalShader").then((m) => m.PortalShader),
  { ssr: false },
);
const Particles = dynamic(
  () => import("./Particles").then((m) => m.Particles),
  { ssr: false },
);

export default function BabPage() {
  const reduce = useReducedMotion();
  const [entered, setEntered] = useState(false);

  return (
    <div className="relative min-h-[600vh] bg-[#08040e] text-white">
      {!reduce && <PortalShader />}
      {!reduce && <Particles count={260} />}

      <Threshold entered={entered} onEnter={() => setEntered(true)} />

      <Layer
        kicker="Layer I"
        title="The world you are leaving."
        body="The phone calls, the deadlines, the noise. Today, all of it. Hold it lightly."
      />

      <Layer
        kicker="Layer II"
        title="The desert before the door."
        body="Sand has carried every prayer that came before yours. The wind remembers. So does the earth."
        align="right"
      />

      <Layer
        kicker="Layer III"
        title="The cave of light."
        body="A whisper became a verse. A verse became a faith. A faith became your reason to be here."
      />

      <DoorsOfLight />

      <Kaaba />

      <ConceptSwitcher theme="dark" />
    </div>
  );
}

/* -------- THRESHOLD: hero with portal & "enter" gate -------- */

function Threshold({
  entered,
  onEnter,
}: {
  entered: boolean;
  onEnter: () => void;
}) {
  return (
    <section className="relative z-10 flex h-screen flex-col items-center justify-center px-6 text-center">
      {!entered ? (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.4, duration: 1.2 }}
            className="font-mono text-[10px] uppercase tracking-[0.5em] text-amber-200/70"
          >
            بَابٌ · the door
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight md:text-7xl"
          >
            Cross the threshold.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 2.4, duration: 0.9 }}
            className="mt-4 max-w-md text-sm text-white/70 md:text-base"
          >
            This is not a website. It is a passage. Move your cursor — the portal will follow you.
          </motion.p>

          <motion.button
            onClick={onEnter}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 3,
              type: "spring",
              stiffness: 110,
              damping: 18,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="group mt-12 inline-flex items-center gap-3 rounded-full border border-amber-200/40 bg-amber-200/5 px-8 py-4 text-sm font-medium text-amber-100 backdrop-blur transition-colors hover:border-amber-200 hover:bg-amber-200/10"
          >
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-amber-200"
            />
            Enter
            <span className="opacity-50 transition-transform group-hover:translate-x-1">→</span>
          </motion.button>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-amber-200/70">
            crossed
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
            Now scroll, gently.
          </h1>
          <p className="mt-4 text-sm text-white/60 md:text-base">
            Each layer is a deeper place. Take your time.
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="mt-12 text-xs uppercase tracking-[0.4em] text-white/40"
          >
            ↓
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

/* -------- LAYER: scroll-revealed text panel -------- */

function Layer({
  kicker,
  title,
  body,
  align = "left",
}: {
  kicker: string;
  title: string;
  body: string;
  align?: "left" | "right";
}) {
  return (
    <section className="relative z-10 flex min-h-screen items-center px-6 py-24 md:px-12">
      <div className={`mx-auto w-full max-w-5xl ${align === "right" ? "md:text-right" : ""}`}>
        <motion.p
          initial={{ opacity: 0, x: align === "right" ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="font-mono text-[10px] uppercase tracking-[0.5em] text-amber-200/70"
        >
          {kicker}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-3xl font-display text-3xl leading-[1.1] tracking-tight md:text-6xl"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 0.75, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className={`mt-6 max-w-xl text-base text-white/75 md:text-lg ${
            align === "right" ? "md:ml-auto" : ""
          }`}
        >
          {body}
        </motion.p>
      </div>
    </section>
  );
}

/* -------- DOORS OF LIGHT: packages as portal-doors -------- */

const DOORS = [
  { title: "Mecca · 7 nights",          sub: "Premium · 80m to Haram",   price: "OMR 1,290" },
  { title: "Mecca + Medina · 14 nights",sub: "Standard · 350m to Haram", price: "OMR 1,840" },
  { title: "Last 10 of Ramadan",        sub: "Group · 700m to Haram",    price: "OMR 980"   },
];

function DoorsOfLight() {
  return (
    <section className="relative z-10 px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="font-mono text-[10px] uppercase tracking-[0.5em] text-amber-200/70"
        >
          Layer IV · doors of light
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-3xl font-display text-3xl leading-[1.1] tracking-tight md:text-6xl"
        >
          Each door opens the same way.<br/>
          <span className="text-amber-200/80">Step through.</span>
        </motion.h2>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {DOORS.map((d, i) => (
            <motion.button
              key={d.title}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl border border-amber-200/15 bg-gradient-to-b from-amber-200/5 to-transparent p-8 text-left backdrop-blur transition-colors hover:border-amber-200/40"
            >
              <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(252,211,77,0.25),transparent_60%)] opacity-50 transition-opacity group-hover:opacity-100" />
              <p className="text-xs uppercase tracking-widest text-amber-200/80">{d.sub}</p>
              <h3 className="mt-3 font-display text-2xl leading-tight">{d.title}</h3>
              <p className="mt-6 font-mono text-sm tabular-nums text-amber-200">
                {d.price} <span className="text-xs text-white/50">/ traveler</span>
              </p>
              <span className="mt-8 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-200/70 transition-colors group-hover:text-amber-200">
                Step through
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------- KAABA: final reveal & CTA -------- */

function Kaaba() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0.85, 1], [0.55, 1]);
  const opacity = useTransform(scrollYProgress, [0.85, 0.92, 1], [0, 1, 1]);

  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-32 pt-24 text-center">
      <motion.div
        style={{ scale, opacity }}
        className="relative mx-auto h-44 w-32 md:h-60 md:w-44"
      >
        <div className="absolute inset-0 rounded-sm bg-gradient-to-b from-[#1a1a1a] via-[#0e0e0e] to-[#050505] shadow-[0_0_120px_rgba(252,211,77,0.5)] ring-1 ring-amber-200/20" />
        <div className="absolute inset-x-3 top-3 h-2 rounded-sm bg-amber-300" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.7 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="mt-12 font-mono text-[10px] uppercase tracking-[0.5em] text-amber-200/80"
      >
        Layer V · the center
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 max-w-2xl font-display text-4xl leading-[1.05] tracking-tight md:text-6xl"
      >
        You arrived a long time ago.<br/>
        <span className="text-amber-200">Make it official.</span>
      </motion.h2>

      <motion.button
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 110, damping: 18 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="mt-12 rounded-full bg-amber-300 px-10 py-4 text-sm font-medium text-black shadow-[0_0_60px_rgba(252,211,77,0.5)] transition-shadow hover:shadow-[0_0_90px_rgba(252,211,77,0.8)]"
      >
        Book your passage →
      </motion.button>

      <p className="mt-20 font-mono text-[10px] uppercase tracking-[0.4em] text-white/30">
        Bab · concept 2 of 3 (new)
      </p>
    </section>
  );
}
