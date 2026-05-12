"use client";

import {
  motion,
  AnimatePresence,
  LayoutGroup,
  useScroll,
  useTransform,
} from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Search, MapPin, ShieldCheck, Star, Heart, Calendar } from "lucide-react";
import { ConceptSwitcher } from "../_components/ConceptSwitcher";

type Pkg = {
  id: string;
  title: string;
  cover: string;
  agency: string;
  verified: boolean;
  distanceM: number;
  nights: number;
  price: number;
  rating: number;
  reviews: number;
  quotaLeft?: number;
  category: "umrah" | "hajj" | "ramadan";
};

const PACKAGES: Pkg[] = [
  { id: "1", title: "Premium Umrah · Hilton Suites · 7 Nights",         cover: "/images/destinations/abraj-al-bait.jpg", agency: "Al-Safa Travel",     verified: true,  distanceM: 80,   nights: 7,  price: 1290, rating: 4.9, reviews: 312, category: "umrah" },
  { id: "2", title: "Mecca + Medina · Standard · 14 Nights",            cover: "/images/destinations/masjid-nabawi.jpg", agency: "Hidaya Tours",       verified: true,  distanceM: 350,  nights: 14, price: 1840, rating: 4.7, reviews: 891, category: "umrah" },
  { id: "3", title: "Hajj 2026 · Mina Tent + Aziziah Apt",              cover: "/images/destinations/jabal-arafat.jpg",  agency: "Manasik Co.",        verified: true,  distanceM: 1200, nights: 18, price: 6450, rating: 4.8, reviews: 124, quotaLeft: 7,  category: "hajj"   },
  { id: "4", title: "Last 10 Nights of Ramadan · 3★",                   cover: "/images/destinations/jabal-al-nour.jpg", agency: "Noor Holidays",      verified: false, distanceM: 700,  nights: 11, price: 980,  rating: 4.4, reviews: 67,  category: "ramadan"},
  { id: "5", title: "Family Package · 4 travelers · 9 Nights",          cover: "/images/destinations/dest1.jpg",         agency: "Family First Travel",verified: true,  distanceM: 240,  nights: 9,  price: 1620, rating: 4.6, reviews: 203, category: "umrah" },
  { id: "6", title: "Express Umrah · Weekend · 4 Nights",               cover: "/images/destinations/dest2.jpg",         agency: "Quick Umrah",        verified: true,  distanceM: 600,  nights: 4,  price: 690,  rating: 4.3, reviews: 482, category: "umrah" },
];

const FILTERS = [
  { id: "all",     label: "All packages" },
  { id: "umrah",   label: "Umrah"        },
  { id: "hajj",    label: "Hajj 2026"    },
  { id: "ramadan", label: "Ramadan"      },
] as const;

export default function TawafPage() {
  return (
    <div className="min-h-screen bg-white">
      <StickyHero />
      <PackageGrid />
      <BookingTicker />
      <ConceptSwitcher theme="light" />
    </div>
  );
}

/* -------------------- Hero -------------------- */

function StickyHero() {
  const { scrollY } = useScroll();
  const padY     = useTransform(scrollY, [0, 300], [24,  10]);
  const heroH    = useTransform(scrollY, [0, 300], ["40vh", "0vh"]);

  return (
    <section className="relative">
      <motion.div
        style={{ height: heroH }}
        className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-amber-50"
      >
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-emerald-200 blur-3xl" />
          <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-amber-200 blur-3xl" />
        </div>
        <div className="relative mx-auto flex h-full max-w-6xl items-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="text-xs font-medium uppercase tracking-widest text-emerald-700">
              Trusted by 12,400+ pilgrims
            </p>
            <h1 className="mt-2 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
              Find your Umrah in three taps.
            </h1>
            <p className="mt-3 max-w-xl text-neutral-600">
              Compare verified agencies. Filter by distance to Haram. Book in under four minutes.
            </p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        style={{ paddingTop: padY, paddingBottom: padY }}
        className="sticky top-0 z-30 border-b border-neutral-200 bg-white/85 px-6 backdrop-blur"
      >
        <div className="mx-auto max-w-6xl">
          <SearchBar />
        </div>
      </motion.div>
    </section>
  );
}

function SearchBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex flex-col items-stretch gap-2 rounded-2xl bg-white p-2 shadow-[0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-neutral-200 md:flex-row md:items-center"
    >
      <Field icon={<MapPin size={16}/>} label="From"      value="Muscat" />
      <Field icon={<Calendar size={16}/>} label="Dates"   value="14 Ramadan – 21 Ramadan" />
      <Field icon={<MapPin size={16}/>} label="Distance" value="≤ 500m to Haram" />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
      >
        <Search size={16} /> Search
      </motion.button>
    </motion.div>
  );
}

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <button className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-neutral-50">
      <span className="text-emerald-700">{icon}</span>
      <div>
        <div className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">{label}</div>
        <div className="text-sm font-medium text-neutral-900">{value}</div>
      </div>
    </button>
  );
}

/* -------------------- Grid + Filters -------------------- */

function PackageGrid() {
  const [filter, setFilter] = useState<typeof FILTERS[number]["id"]>("all");
  const [saved,  setSaved]  = useState<Set<string>>(new Set());

  const visible = useMemo(
    () => filter === "all" ? PACKAGES : PACKAGES.filter((p) => p.category === filter),
    [filter],
  );

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">Available now</h2>
            <p className="mt-1 text-sm text-neutral-500">
              <motion.span
                key={visible.length}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block tabular-nums"
              >
                {visible.length}
              </motion.span>{" "}
              packages match your filters
            </p>
          </div>
          <FilterChips value={filter} onChange={setFilter} />
        </div>

        <LayoutGroup>
          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((p) => (
                <Card
                  key={p.id}
                  pkg={p}
                  saved={saved.has(p.id)}
                  onSave={() =>
                    setSaved((s) => {
                      const next = new Set(s);
                      next.has(p.id) ? next.delete(p.id) : next.add(p.id);
                      return next;
                    })
                  }
                />
              ))}
            </AnimatePresence>
          </ul>
        </LayoutGroup>
      </div>
    </section>
  );
}

function FilterChips({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: typeof FILTERS[number]["id"]) => void;
}) {
  return (
    <div className="flex gap-2">
      {FILTERS.map((f) => {
        const active = value === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active ? "text-white" : "text-neutral-700 hover:text-neutral-900"
            }`}
          >
            {active && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full bg-neutral-900"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{f.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Card({
  pkg,
  saved,
  onSave,
}: {
  pkg: Pkg;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        layout:  { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
        opacity: { duration: 0.25 },
      }}
      whileHover={{ y: -4 }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200 transition-shadow hover:shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            src={pkg.cover}
            alt={pkg.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </motion.div>

        <motion.button
          onClick={(e) => { e.preventDefault(); onSave(); }}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 backdrop-blur"
          whileTap={{ scale: 0.85 }}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
        >
          <motion.span
            animate={saved ? { scale: [1, 1.4, 1] } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 12 }}
          >
            <Heart
              size={18}
              className={saved ? "fill-amber-500 text-amber-500" : "text-neutral-700"}
            />
          </motion.span>
        </motion.button>

        {pkg.quotaLeft !== undefined && pkg.quotaLeft <= 10 && (
          <div className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-medium text-white shadow">
            {pkg.quotaLeft} seats left
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <span>{pkg.agency}</span>
          {pkg.verified && <ShieldCheck size={13} className="text-blue-600" />}
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-0.5">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            {pkg.rating.toFixed(1)} <span className="text-neutral-400">({pkg.reviews})</span>
          </span>
        </div>

        <h3 className="mt-1.5 line-clamp-2 font-medium text-neutral-900">{pkg.title}</h3>

        <div className="mt-2 flex items-center gap-3 text-xs text-neutral-600">
          <span className="inline-flex items-center gap-1">
            <MapPin size={12}/> {pkg.distanceM}m to Haram
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar size={12}/> {pkg.nights}n
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-lg font-semibold tabular-nums text-emerald-700">
            OMR {pkg.price.toLocaleString()}
            <span className="ml-1 text-xs font-normal text-neutral-500">/ traveler</span>
          </span>
          <button className="text-sm font-medium text-emerald-700 transition-all group-hover:underline">
            View →
          </button>
        </div>
      </div>
    </motion.li>
  );
}

/* -------------------- Live Booking Ticker -------------------- */

const TICKER = [
  { who: "Family of 4 in Sohar",      what: "10-night Mecca",     when: "2 min ago"  },
  { who: "Couple in Riyadh",          what: "Hajj 2026 deposit",  when: "8 min ago"  },
  { who: "Solo traveler in Doha",     what: "Express Umrah",      when: "14 min ago" },
  { who: "Group of 6 in Dubai",       what: "Ramadan last 10",    when: "21 min ago" },
];

function BookingTicker() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % TICKER.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="border-t border-neutral-200 bg-neutral-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
          Live activity
        </p>
        <div className="mt-3 h-12 overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={i}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0,  opacity: 1 }}
              exit={{    y: -24, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-baseline gap-2"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)]" />
              <span className="font-medium text-neutral-900">{TICKER[i]!.who}</span>
              <span className="text-neutral-600">just booked</span>
              <span className="font-medium text-neutral-900">{TICKER[i]!.what}</span>
              <span className="ml-auto text-xs text-neutral-500">{TICKER[i]!.when}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
