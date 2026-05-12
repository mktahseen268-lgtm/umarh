"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "@/lib/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { Counter } from "@/components/shared/Motion";

const VIDEOS = [
  "/images/14874861_3840_2160_60fps.mp4",
  "/images/14874751_3840_2160_60fps.mp4",
];

const WORDS_EN = ["Makkah", "Madinah", "Umrah", "Hajj", "Ziyarah"];
const WORDS_AR = ["مكة المكرمة", "المدينة المنورة", "العمرة", "الحج", "الزيارة"];

const LOCATIONS_EN = [
  "Makkah, Saudi Arabia",
  "Madinah, Saudi Arabia",
  "Jeddah, Saudi Arabia",
  "Taif, Saudi Arabia",
  "Riyadh, Saudi Arabia",
  "Istanbul, Turkey",
  "Cairo, Egypt",
  "Amman, Jordan",
];
const LOCATIONS_AR = [
  "مكة المكرمة، السعودية",
  "المدينة المنورة، السعودية",
  "جدة، السعودية",
  "الطائف، السعودية",
  "الرياض، السعودية",
  "إسطنبول، تركيا",
  "القاهرة، مصر",
  "عمّان، الأردن",
];

export default function HeroSection() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("home.hero");
  const isRtl = locale === "ar";

  const WORDS = isRtl ? WORDS_AR : WORDS_EN;
  const LOCATIONS = isRtl ? LOCATIONS_AR : LOCATIONS_EN;

  const [location, setLocation] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("1");
  const [wordIndex, setWordIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setWordIndex((i) => (i + 1) % WORDS.length);
    }, 2200);
    return () => clearInterval(id);
  }, [WORDS.length]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setLocationOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleEnded = useCallback(() => {
    setVideoIndex((i) => (i + 1) % VIDEOS.length);
  }, []);

  const filteredLocations = location.length > 0
    ? LOCATIONS.filter((l) => l.toLowerCase().includes(location.toLowerCase()))
    : LOCATIONS;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("q", location);
    if (date) params.set("date", date);
    if (guests) params.set("guests", guests);
    router.push(`/packages?${params.toString()}`);
  };

  return (
    <section className="relative w-full" style={{ marginBottom: "82px" }}>
      <div
        className="relative w-full overflow-hidden"
        style={{ minHeight: "520px", maxHeight: "860px" }}
      >

        {/* ── Background video with zoom transition ──────────── */}
        <AnimatePresence mode="sync">
          <motion.video
            key={videoIndex}
            autoPlay
            muted
            playsInline
            onEnded={handleEnded}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ minHeight: "520px", maxHeight: "860px" }}
            initial={{ scale: 1.12, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <source src={VIDEOS[videoIndex]} type="video/mp4" />
          </motion.video>
        </AnimatePresence>

        {/* invisible spacer to preserve section height */}
        <div style={{ minHeight: "520px", maxHeight: "860px", visibility: "hidden" }} aria-hidden />

        {/* ── Gray overlay ──────────────────────────────────── */}
        <div className="absolute inset-0" style={{ background: "rgba(15,20,22,0.52)" }} />

        {/* ── Animated hero text ────────────────────────────── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pb-16">

          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-sm font-medium"
            style={{
              background: "rgba(255,202,1,0.18)",
              border: "1px solid rgba(255,202,1,0.45)",
              color: "#ffca01",
            }}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: "#ffca01", animation: "pulse 2s infinite" }}
            />
            {t("badge")}
          </motion.span>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-display text-white mb-4"
            style={{
              fontSize: "clamp(32px, 5vw, 62px)",
              fontWeight: 700,
              lineHeight: 1.2,
              maxWidth: "780px",
            }}
          >
            {t("titleBefore")}{" "}
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                style={{ color: "#ffca01", display: "inline-block" }}
              >
                {WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>{" "}
            {t("titleAfter")}
          </motion.h1>

          {/* Sub-heading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-white/75 mb-10"
            style={{ fontSize: "18px", maxWidth: "520px", lineHeight: "30px" }}
          >
            {t("subtitle")}
          </motion.p>

          {/* Trust badges — animated counters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-8"
          >
            {[
              { to: 200,   suffix: "+", places: 0, short: false, label: t("trustAgencies") },
              { to: 50000, suffix: "+", places: 0, short: true,  label: t("trustPilgrims") },
              { to: 4.9,   suffix: "★", places: 1, short: false, label: t("trustRating")   },
            ].map(({ to, suffix, places, short, label }) => (
              <div key={label} className="text-center">
                <p
                  style={{ fontSize: "28px", fontWeight: 700, color: "#ffca01", lineHeight: 1 }}
                  className="tabular-nums"
                >
                  <Counter to={to} suffix={suffix} places={places} short={short} duration={1600} />
                </p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", marginTop: "4px" }}>{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Book Now floating card ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute left-0 right-0 mx-auto"
          dir="ltr"
          style={{
            maxWidth: "1100px",
            width: "calc(100% - 32px)",
            bottom: "-40px",
            backgroundColor: "white",
            boxShadow: "0px 4px 21px 1px rgba(0,197,114,0.10)",
            borderRadius: "15px",
            padding: "35px 57px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          {/* Location */}
          <div
            ref={locationRef}
            className="flex items-center gap-4 flex-1 relative after:hidden lg:after:block after:absolute after:right-[-40px] after:top-0 after:bottom-0 after:my-auto after:w-px after:h-5 after:bg-[#0d7434]"
          >
            <div className="w-10 lg:w-[50px] flex-shrink-0">
              <MapPin size={28} className="text-[#0d7434]" />
            </div>
            <div className="flex-1 relative">
              <div className="text-[18px] font-medium leading-[27px] text-[#0d7434]">{t("location")}</div>
              <input
                type="text"
                value={location}
                onChange={(e) => { setLocation(e.target.value); setLocationOpen(true); }}
                onFocus={() => setLocationOpen(true)}
                placeholder={t("locationPlaceholder")}
                className="border-none outline-none text-sm text-[#0f1416] placeholder:text-[#a6aaac] w-full"
              />
              <AnimatePresence>
                {locationOpen && filteredLocations.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 bg-white shadow-lg rounded-lg overflow-hidden z-50"
                    style={{ top: "calc(100% + 8px)", border: "1px solid #e7e6e6" }}
                  >
                    {filteredLocations.map((loc) => (
                      <li
                        key={loc}
                        className="flex items-center gap-2 px-4 py-2.5 cursor-pointer hover:bg-[#f4fdf7] text-sm text-[#0f1416]"
                        onMouseDown={() => { setLocation(loc); setLocationOpen(false); }}
                      >
                        <MapPin size={14} className="text-[#0d7434] flex-shrink-0" />
                        {loc}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-4 flex-1 relative after:hidden lg:after:block after:absolute after:right-[-40px] after:top-0 after:bottom-0 after:my-auto after:w-px after:h-5 after:bg-[#0d7434]">
            <div className="w-10 lg:w-[50px] flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0d7434" strokeWidth="2" className="w-7 h-7">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <div className="text-[18px] font-medium leading-[27px] text-[#0d7434]">{t("date")}</div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="border-none outline-none text-sm text-[#0f1416] max-w-[127px] cursor-pointer"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="flex items-center gap-4 flex-1 relative after:hidden lg:after:block after:absolute after:right-[-40px] after:top-0 after:bottom-0 after:my-auto after:w-px after:h-5 after:bg-[#0d7434]">
            <div className="w-10 lg:w-[50px] flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0d7434" strokeWidth="2" className="w-7 h-7">
                <circle cx="12" cy="7" r="4" />
                <path d="M5 20a7 7 0 0 1 14 0" />
              </svg>
            </div>
            <div>
              <div className="text-[18px] font-medium leading-[27px] text-[#0d7434]">{t("guests")}</div>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="border-none outline-none text-sm text-[#0f1416] max-w-[150px] cursor-pointer bg-transparent"
              >
                {["1","2","3","4","5+"].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Book Now button */}
          <button onClick={handleSearch} className="btn-primary flex-shrink-0">
            {t("bookNow")}
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
