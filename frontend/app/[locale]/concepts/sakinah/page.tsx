"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { ConceptSwitcher } from "../_components/ConceptSwitcher";

const HERO_LINES = ["Your journey home", "begins with a single step."];

const JOURNEYS = [
  {
    title: "7-Night Mecca Reflection",
    niyyah: "For those who seek silence near the House.",
    image: "/images/destinations/abraj-al-bait.jpg",
    nights: 7,
  },
  {
    title: "Mecca & Medina · 14 Nights",
    niyyah: "Walk the path of the Prophet, peace be upon him.",
    image: "/images/destinations/masjid-nabawi.jpg",
    nights: 14,
  },
  {
    title: "Last Ten Nights of Ramadan",
    niyyah: "Witness Laylat al-Qadr where it began.",
    image: "/images/destinations/jabal-al-nour.jpg",
    nights: 10,
  },
];

export default function SakinahPage() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pause video when off-screen for battery + LCP
  useEffect(() => {
    if (!videoRef.current || reduce) return;
    const v = videoRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        e.isIntersecting ? v.play().catch(() => {}) : v.pause();
      },
      { threshold: 0.1 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <div className="bg-[#0B0F0E] text-[#E9DFCB]">
      <CinemaHero reduce={reduce} videoRef={videoRef} />
      <VerseRibbon />
      <Journeys />
      <FooterColophon />
      <ConceptSwitcher theme="dark" />
    </div>
  );
}

/* -------------------- Hero -------------------- */

function CinemaHero({
  reduce,
  videoRef,
}: {
  reduce: boolean | null;
  videoRef: React.RefObject<HTMLVideoElement>;
}) {
  return (
    <section className="relative h-[100svh] overflow-hidden">
      {!reduce && (
        <motion.video
          ref={videoRef}
          autoPlay muted loop playsInline preload="metadata"
          poster="/images/hero-bg.jpg"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 0.65, scale: 1 }}
          transition={{
            opacity: { duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] },
            scale:   { duration: 12,  delay: 0.4, ease: "linear" },
          }}
        >
          <source src="/images/14874751_3840_2160_60fps.mp4" type="video/mp4" />
        </motion.video>
      )}

      {reduce && (
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-60"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F0E]/35 via-transparent to-[#0B0F0E]" />

      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 text-center">
        <motion.h1
          className="font-display text-5xl leading-[1.05] tracking-tight md:text-7xl"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.18, delayChildren: 1.2 } },
          }}
        >
          {HERO_LINES.map((line) => (
            <motion.span
              key={line}
              className="block overflow-hidden pb-2"
              variants={{
                hidden:  { clipPath: "inset(100% 0 0 0)", y: 32 },
                visible: {
                  clipPath: "inset(0% 0 0 0)",
                  y: 0,
                  transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {line}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="mt-6 max-w-xl text-base text-[#E9DFCB]/80"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 2.2, ease: "easeOut" }}
        >
          Reserve your Umrah with quiet confidence. Plan in Hijri, lock the price,
          travel with intention.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col gap-3 sm:flex-row"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.18, delayChildren: 2.6 } },
          }}
        >
          {[
            { label: "Begin",            primary: true  },
            { label: "Speak to a guide", primary: false },
          ].map(({ label, primary }) => (
            <motion.button
              key={label}
              variants={{
                hidden:  { opacity: 0, y: 24 },
                visible: {
                  opacity: 1, y: 0,
                  transition: { type: "spring", stiffness: 120, damping: 18 },
                },
              }}
              whileHover={!reduce ? { scale: 1.03 } : {}}
              whileTap={{ scale: 0.98 }}
              className={
                primary
                  ? "rounded-full bg-[#C9A85B] px-8 py-3.5 text-sm font-medium text-[#0B0F0E] shadow-[0_0_40px_rgba(201,168,91,0.25)] hover:shadow-[0_0_60px_rgba(201,168,91,0.45)] transition-shadow"
                  : "rounded-full border border-[#E9DFCB]/40 px-8 py-3.5 text-sm font-medium text-[#E9DFCB] hover:border-[#E9DFCB]"
              }
            >
              {label}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {!reduce && <ParticleField count={18} />}
      <ScrollHint />
    </section>
  );
}

/* -------------------- Particles -------------------- */

function ParticleField({ count }: { count: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        delay: Math.random() * 4,
        duration: 6 + Math.random() * 6,
        drift: 10 + Math.random() * 25,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-[1]">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-[#C9A85B]"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            filter: "blur(0.5px)",
          }}
          animate={{
            y: [0, -p.drift, 0, p.drift, 0],
            opacity: [0, 0.6, 0.4, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* -------------------- Scroll Hint -------------------- */

function ScrollHint() {
  return (
    <motion.div
      className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      transition={{ delay: 3.4, duration: 0.8 }}
    >
      <motion.div
        className="h-12 w-px bg-gradient-to-b from-transparent via-[#C9A85B] to-transparent"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

/* -------------------- Verse Ribbon -------------------- */

function VerseRibbon() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const smoothY = useSpring(y, { damping: 20, stiffness: 80 });

  return (
    <section ref={ref} className="relative px-6 py-32 md:py-48">
      <motion.div
        style={{ y: smoothY }}
        className="mx-auto max-w-3xl text-center"
      >
        <p
          className="font-display text-3xl leading-snug text-[#C9A85B] md:text-5xl"
          style={{ direction: "rtl" }}
        >
          وَأَذِّن فِي ٱلنَّاسِ بِٱلْحَجِّ
        </p>
        <p className="mt-6 font-display text-xl italic text-[#E9DFCB]/70 md:text-2xl">
          “And proclaim to mankind the pilgrimage.”
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.3em] text-[#E9DFCB]/40">
          Surah Al-Hajj · 22:27
        </p>
      </motion.div>
    </section>
  );
}

/* -------------------- Journeys -------------------- */

function Journeys() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-[#C9A85B]/80">
            Three journeys
          </p>
          <h2 className="mt-3 font-display text-4xl text-[#E9DFCB] md:text-5xl">
            Choose how your story unfolds.
          </h2>
        </Reveal>

        <div className="mt-16 space-y-24">
          {JOURNEYS.map((j, i) => (
            <JourneyPanel key={j.title} journey={j} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function JourneyPanel({
  journey,
  reverse,
}: {
  journey: typeof JOURNEYS[number];
  reverse: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const smoothImgY = useSpring(imgY, { damping: 25, stiffness: 80 });

  return (
    <Reveal>
      <div
        ref={ref}
        className={`grid items-center gap-10 md:grid-cols-2 ${
          reverse ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        <motion.div
          className="relative aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-white/5"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div style={{ y: smoothImgY }} className="absolute inset-[-10%]">
            <Image
              src={journey.image}
              alt={journey.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F0E]/60 via-transparent to-transparent" />
        </motion.div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#C9A85B]">
            {journey.nights} nights
          </p>
          <h3 className="mt-3 font-display text-3xl text-[#E9DFCB] md:text-4xl">
            {journey.title}
          </h3>
          <p className="mt-4 max-w-md font-display text-lg italic text-[#E9DFCB]/70">
            {journey.niyyah}
          </p>
          <button className="mt-8 inline-flex items-center gap-2 border-b border-[#C9A85B] pb-1 text-sm font-medium text-[#C9A85B] transition-colors hover:text-[#E9DFCB]">
            Read this journey →
          </button>
        </div>
      </div>
    </Reveal>
  );
}

/* -------------------- Reveal primitive -------------------- */

function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, clipPath: "inset(8% 0 8% 0)" }}
      whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0% 0)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* -------------------- Footer -------------------- */

function FooterColophon() {
  return (
    <footer className="border-t border-white/5 px-6 py-16 text-center">
      <p className="font-display text-2xl text-[#E9DFCB]">Begin.</p>
      <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[#E9DFCB]/40">
        Sakinah · Concept 1 of 3
      </p>
    </footer>
  );
}
