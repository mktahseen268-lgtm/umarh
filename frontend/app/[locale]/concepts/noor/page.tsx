"use client";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";
import { useState, useEffect, useDeferredValue, useMemo } from "react";
import { Sparkles, Mic, ArrowRight, Zap, Shield, TrendingDown } from "lucide-react";
import { ConceptSwitcher } from "../_components/ConceptSwitcher";

type Suggestion = {
  id: string;
  title: string;
  reasoning: string;
  price: number;
  match: number;
};

const SUGGESTION_BANK: Suggestion[] = [
  { id: "s1", title: "Family of 4 · 7 nights · 200m to Haram",   reasoning: "your family size and Ramadan window",          price: 4980, match: 96 },
  { id: "s2", title: "Premium Umrah · Hilton Suites · 5 nights", reasoning: "your budget and 5★ preference",                price: 2490, match: 91 },
  { id: "s3", title: "Mecca + Medina · 12 nights · Mid-range",   reasoning: "your interest in visiting Madinah",            price: 3120, match: 88 },
  { id: "s4", title: "Last 10 Nights of Ramadan · 3★ · Group",   reasoning: "Laylat al-Qadr timing in your dates",          price: 1680, match: 85 },
];

export default function NoorPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0F] text-white">
      <MeshBackground />
      <div className="relative z-10">
        <Hero />
        <FeatureRail />
        <LiveSection />
        <ConceptSwitcher theme="dark" />
      </div>
    </div>
  );
}

/* -------------------- Mesh Background -------------------- */

function MeshBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute -left-1/4 -top-1/4 h-[120vh] w-[120vh] rounded-full opacity-50 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 60%)",
        }}
        animate={{ x: [0, 100, -50, 0], y: [0, 80, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -right-1/4 top-1/4 h-[100vh] w-[100vh] rounded-full opacity-40 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.55) 0%, transparent 60%)",
        }}
        animate={{ x: [0, -120, 60, 0], y: [0, -60, 90, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -bottom-1/4 left-1/3 h-[110vh] w-[110vh] rounded-full opacity-40 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(34,211,238,0.4) 0%, transparent 60%)",
        }}
        animate={{ x: [0, 80, -100, 0], y: [0, -90, 40, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 bg-[#0A0A0F]/40" />
    </div>
  );
}

/* -------------------- Hero with AI Prompt -------------------- */

function Hero() {
  return (
    <section className="relative px-6 pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-white/70 backdrop-blur"
        >
          <Sparkles size={12} className="text-cyan-300" />
          Powered by AI · Free in beta
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl"
        >
          Describe your Umrah.<br />
          <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
            Noor will compose it.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-5 max-w-xl text-white/60"
        >
          Tell us your dates, family size, and budget. Get personalized packages with
          live pricing — in seconds, not hours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          <AIPromptBar />
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------- AI Prompt Bar -------------------- */

function AIPromptBar() {
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const [streaming, setStreaming] = useState(false);
  const [status,    setStatus]    = useState("Thinking…");
  const [results,   setResults]   = useState<Suggestion[]>([]);

  useEffect(() => {
    if (dq.length < 3) {
      setResults([]);
      setStreaming(false);
      return;
    }
    setStreaming(true);
    setResults([]);
    const phases = [
      "Reading your intent…",
      "Looking at 1,247 packages…",
      "Comparing prices and ratings…",
      "Finalizing matches…",
    ];
    let phase = 0;
    setStatus(phases[0]!);
    const tick = setInterval(() => {
      phase = (phase + 1) % phases.length;
      setStatus(phases[phase]!);
    }, 600);
    const done = setTimeout(() => {
      setStreaming(false);
      setResults(SUGGESTION_BANK);
      clearInterval(tick);
    }, 2000);
    return () => { clearInterval(tick); clearTimeout(done); };
  }, [dq]);

  // Cursor spotlight
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 30 });
  const sy = useSpring(my, { stiffness: 200, damping: 30 });
  const spotlight = useTransform(
    [sx, sy] as any,
    ([x, y]: number[]) =>
      `radial-gradient(600px circle at ${x}px ${y}px, rgba(99,102,241,0.18), transparent 40%)`,
  );

  return (
    <div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-2 backdrop-blur-2xl"
    >
      <motion.div
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0"
      />
      <div className="relative flex items-center gap-3 rounded-2xl bg-black/40 px-5 py-4">
        <Sparkles className="h-5 w-5 shrink-0 text-cyan-300" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. family of 4, 7 nights, walking distance to Haram, under OMR 5000"
          dir="auto"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none md:text-base"
          aria-label="Describe your Umrah"
        />
        <button
          aria-label="Voice input"
          className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-white/80 ring-1 ring-white/10 transition-colors hover:bg-white/10"
        >
          <Mic size={16} />
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {dq.length > 2 && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden"
          >
            {streaming ? (
              <div className="flex items-center gap-3 px-5 py-5 text-white/70">
                <TypingDots />
                <span className="text-sm">{status}</span>
              </div>
            ) : (
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
                className="space-y-1.5 px-2 pb-2 pt-3"
              >
                {results.map((s) => (
                  <motion.li
                    key={s.id}
                    variants={{
                      hidden:  { opacity: 0, y: 24, scale: 0.97 },
                      visible: {
                        opacity: 1, y: 0, scale: 1,
                        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                      },
                    }}
                    whileHover={{ x: 4 }}
                    className="group flex cursor-pointer items-center justify-between gap-4 rounded-xl px-4 py-3 text-left ring-1 ring-white/5 transition-colors hover:bg-white/[0.05]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{s.title}</span>
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                          {s.match}% match
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-white/50">based on {s.reasoning}</p>
                    </div>
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <span className="font-mono text-sm tabular-nums text-cyan-300">
                        OMR {s.price.toLocaleString()}
                      </span>
                      <ArrowRight size={14} className="text-white/40 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-cyan-300"
          animate={{ scale: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, delay: i * 0.15, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

/* -------------------- Feature Rail -------------------- */

const FEATURES = [
  { icon: Zap,          title: "Composes in seconds",   desc: "Natural-language to verified packages, instantly."     },
  { icon: TrendingDown, title: "Live price tracking",   desc: "Get notified the moment your saved package drops."     },
  { icon: Shield,       title: "Verified agencies only", desc: "Saudi MoT licensed. Escrow-protected. Real reviews."  },
];

function FeatureRail() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
        {FEATURES.map((f, i) => (
          <TiltCard key={f.title} delay={i * 0.1}>
            <f.icon size={20} className="text-cyan-300" />
            <h3 className="mt-4 font-medium">{f.title}</h3>
            <p className="mt-1.5 text-sm text-white/60">{f.desc}</p>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}

function TiltCard({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-1, 1], [4, -4]), { stiffness: 200, damping: 20 });
  const rotY = useSpring(useTransform(mx, [-1, 1], [-4, 4]), { stiffness: 200, damping: 20 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width  * 2 - 1);
        my.set((e.clientY - r.top)  / r.height * 2 - 1);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-colors hover:bg-white/[0.05]"
    >
      {children}
    </motion.div>
  );
}

/* -------------------- Live Counters Section -------------------- */

function LiveSection() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl md:p-12">
        <p className="text-xs font-medium uppercase tracking-widest text-cyan-300">Live</p>
        <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Right now, on Noor</h2>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <Stat label="Travelers planning"  end={2347}  suffix=""    />
          <Stat label="Packages compared"   end={48291} suffix=""    />
          <Stat label="Avg. savings"        end={18}    suffix="%"   />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, end, suffix }: { label: string; end: number; suffix: string }) {
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => Math.floor(v).toLocaleString());

  useEffect(() => {
    const controls = animate(mv, end, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [end, mv]);

  return (
    <div>
      <motion.div className="font-mono text-3xl tabular-nums text-white md:text-4xl">
        <motion.span>{display}</motion.span>
        <span className="text-cyan-300">{suffix}</span>
      </motion.div>
      <p className="mt-1 text-sm text-white/60">{label}</p>
    </div>
  );
}

