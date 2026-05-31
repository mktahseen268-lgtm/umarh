"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Clock, Moon, Users, MapPin, Utensils, Plane, Shield,
  ChevronLeft, ChevronRight, Star, CheckCircle, XCircle,
  Calendar, Globe, ChevronDown, Heart, Share2, Phone,
} from "lucide-react";
import { packages as packagesApi, type Package } from "@/lib/api";

/* ── Mock data ────────────────────────────────────────────── */
const MOCK_NAMES = [
  "Umrah Economy 7-Day Package",
  "Umrah Premium 10-Day Package",
  "VIP Hajj Package 21-Day",
  "Madinah Ziyarah 5-Day Tour",
  "Budget Umrah 5-Day Package",
  "Family Umrah 14-Day Package",
  "Hajj Economy Package 18-Day",
  "Luxury Ziyarah Tour 7-Day",
  "Ramadan Umrah Special 10-Day",
  "Grand Hajj Deluxe 25-Day",
  "Express Umrah 4-Day Package",
  "Umrah & Madinah Combined 12-Day",
];

const MOCK_PRICES = [1200, 2800, 7500, 450, 890, 4200, 4800, 1900, 2200, 9500, 750, 3100];

const MOCK_CATEGORIES = [
  "umrah","umrah","hajj","ziyarah","umrah","umrah","hajj","ziyarah","umrah","hajj","umrah","umrah"
];

const MOCK_DAYS    = [7,10,21,5,5,14,18,7,10,25,4,12];
const MOCK_NIGHTS  = [6,9,20,4,4,13,17,6,9,24,3,11];

const ITINERARY = [
  { day: 1, title: "Arrival & Welcome",          desc: "Arrive at King Abdulaziz International Airport. Transfer to hotel in Makkah. Check-in, rest, and orientation with your group leader. Evening prayer at Masjid al-Haram." },
  { day: 2, title: "Tawaf & Sa'i",               desc: "Perform Tawaf al-Qudum (arrival circumambulation) and Sa'i between Safa and Marwa. Visit Zamzam well. Guided tour of Masjid al-Haram and its historical areas." },
  { day: 3, title: "Mina & Arafat Visit",         desc: "Guided historical tour of Mina plains and Mount Arafat. Learn about the Day of Arafah and its significance. Visit the Jamaraat area. Return to hotel for rest." },
  { day: 4, title: "Madinah Transfer",            desc: "Morning transfer by private coach to Madinah. Visit Masjid an-Nabawi and pay Salah upon the Prophet ﷺ. Explore the Rawdah al-Mutahharah. Evening visit to Quba Mosque." },
  { day: 5, title: "Madinah Ziyarah",             desc: "Full-day historical tour: Uhud mountain, Al-Baqi cemetery, Masjid al-Qiblatayn, Masjid al-Jumu'ah. Guided lectures on the history of Islam in Madinah." },
  { day: 6, title: "Free Day & Final Tawaf",      desc: "Free morning for personal worship and shopping at Makkah's markets. Afternoon return to Makkah for Tawaf al-Wada' (farewell circumambulation). Pack and prepare for departure." },
  { day: 7, title: "Departure",                   desc: "Check-out from hotel. Transfer to airport. Depart with blessed memories and a renewed spirit. Inshallah, may your Umrah be accepted." },
];

const INCLUDES = [
  "Return airfare (economy class)",
  "Airport transfers (private coach)",
  "Hotel accommodation (4-star, near Haram)",
  "Daily breakfast and dinner (full board)",
  "Umrah visa processing",
  "Guided tours in Makkah and Madinah",
  "Zamzam water (5 litre per person)",
  "Ihram attire (one set, men only)",
  "24/7 group leader support",
  "Travel insurance",
];

const EXCLUDES = [
  "Personal expenses and shopping",
  "Optional excursions not listed",
  "Laundry services",
  "Phone calls and internet (local SIM available)",
  "Tips and gratuities",
  "Anything not mentioned in the itinerary",
];

const REVIEWS = [
  { name: "Ahmed Al-Rashidi",  rating: 5, date: "October 2024", avatar: "A", text: "Alhamdulillah, an absolutely life-changing experience. The hotel was a 5-minute walk from the Haram and our guide was incredibly knowledgeable. Every detail was taken care of. Will definitely book again for Hajj." },
  { name: "Fatima Hassan",     rating: 5, date: "September 2024", avatar: "F", text: "The team was so professional and caring. This was my first Umrah and I was nervous, but from the moment we landed everything was seamless. The Rawdah visit was deeply emotional. JazakAllah khair." },
  { name: "Muhammad Yusuf",    rating: 4, date: "August 2024", avatar: "M", text: "Very well organized trip. The accommodations were excellent and the itinerary was well-paced. A couple of minor delays on day 3 but nothing that affected the overall experience. Highly recommend." },
  { name: "Sara Al-Amri",      rating: 5, date: "July 2024", avatar: "S", text: "Subhanallah, I cried the moment I saw the Kaaba for the first time. This agency made every moment special. The scholars who accompanied us added so much depth to the experience. 5 stars." },
  { name: "Khalid Al-Otaibi",  rating: 4, date: "June 2024", avatar: "K", text: "Great package for the price. The hotel was clean and comfortable. Food was good. The guides knew their history well. Only feedback is the coach could be more modern. Overall a blessed journey." },
];

const AVATAR_COLORS = ["#0d7434", "#1abc9c", "#e9c46a", "#9b7fd4", "#f4a261"];

const DEPARTURE_DATES = [
  { date: "15 Mar 2025", seats: 8  },
  { date: "02 Apr 2025", seats: 14 },
  { date: "19 Apr 2025", seats: 3  },
  { date: "10 May 2025", seats: 21 },
];

const MEAL_LABELS: Record<string, string> = {
  breakfast_only: "Breakfast Only",
  half_board: "Half Board",
  full_board: "Full Board",
  all_inclusive: "All Inclusive",
};

const CATEGORY_LABEL: Record<string, string> = {
  umrah: "Umrah", hajj: "Hajj", ziyarah: "Ziyarah",
};

const CATEGORY_COLOR: Record<string, string> = {
  umrah:   "bg-blue-100 text-blue-700",
  hajj:    "bg-purple-100 text-purple-700",
  ziyarah: "bg-amber-100 text-amber-700",
  religion: "bg-teal-100 text-teal-700",
};

function mockFromSlug(slug: string): Package {
  const num  = parseInt(slug.replace(/\D/g, "") || "1", 10);
  const idx  = Math.max(0, (num - 1) % MOCK_NAMES.length);
  const days = MOCK_DAYS[idx];
  const nights = MOCK_NIGHTS[idx];
  return {
    id: String(idx + 1),
    slug,
    title:       { en: MOCK_NAMES[idx], ar: "باقة رقم " + (idx + 1) },
    summary:     { en: "A blessed journey combining spiritual depth with seamless comfort. Guided by experienced scholars with hand-picked accommodations near the holy sites.", ar: "رحلة مباركة تجمع بين العمق الروحي والراحة الكاملة." },
    description: { en: "This carefully curated package offers pilgrims an unforgettable spiritual journey. You will be accompanied by certified Islamic scholars who bring the history of each site to life. We have partnered with 4-star hotels within walking distance of Masjid al-Haram and Masjid an-Nabawi to ensure you spend maximum time in worship.\n\nOur experienced team handles every logistical detail — from visa processing and airport transfers to daily guided tours — so you can focus entirely on your ibadah. Group sizes are intentionally kept small to ensure personalised attention and a close-knit community feel throughout the journey.", ar: "" },
    category:    MOCK_CATEGORIES[idx],
    duration_days: days,
    duration_nights: nights,
    base_price:      MOCK_PRICES[idx]!,
    discounted_price: idx % 3 === 0 ? Math.round(MOCK_PRICES[idx]! * 0.88) : undefined,
    currency:    "USD",
    images:      [
      { url: `/images/packages/pkg${(idx % 6) + 1}.jpg`, type: "cover" },
    ],
    rating:       4.8,
    review_count: 243,
    destination: { name: { en: "Makkah", ar: "مكة المكرمة" }, city: "Makkah" },
    agency: { id: "a1", slug: "agency-1", trade_name: "Al-Noor Travel & Tours", logo_url: "" },
    status:          "published",
    includes_visa:    true,
    includes_flights: idx < 6,
    meal_plan:       "full_board",
    language_spoken: ["en", "ar"],
    departure_city:  "Riyadh",
    min_group_size:  1,
    max_group_size:  20,
    guide: null,
  } as any;
}

/* ── Components ───────────────────────────────────────────── */
function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-slate-100"
      style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
      <span style={{ color: "#0d7434" }}>{icon}</span>
      <div>
        <p style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "#0f1416" }}>{value}</p>
      </div>
    </div>
  );
}

function IncludeItem({ text, included }: { text: string; included: boolean }) {
  return (
    <div className="flex items-start gap-2.5 text-sm py-1">
      {included
        ? <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
        : <XCircle    size={16} className="text-slate-300 flex-shrink-0 mt-0.5" />
      }
      <span style={{ color: included ? "#374151" : "#9ca3af" }}>{text}</span>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function PackageDetailPage() {
  const params = useParams();
  const slug   = params.slug as string;
  const locale = useLocale();

  const [pkg, setPkg]       = useState<Package | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [tab, setTab]       = useState<"overview" | "itinerary" | "includes" | "reviews">("overview");
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [selectedDate, setSelectedDate] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    packagesApi.get(slug)
      .then(res => setPkg(res.data))
      .catch(() => setPkg(mockFromSlug(slug)));
  }, [slug]);

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f0faf5" }}>
        <div className="w-8 h-8 rounded-full border-[3px] animate-spin" style={{ borderColor: "#0d7434", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const title       = pkg.title?.[locale] || pkg.title?.en || "";
  const summary     = pkg.summary?.[locale] || pkg.summary?.en || "";
  const description = pkg.description?.[locale] || pkg.description?.en || "";
  const images      = pkg.images?.length ? pkg.images : [];
  const hasImages   = images.length > 0;
  const hasDiscount = pkg.discounted_price && pkg.discounted_price < pkg.base_price;
  const displayPrice = hasDiscount ? pkg.discounted_price! : pkg.base_price;

  const itinerary = ITINERARY.slice(0, pkg.duration_days ?? 7);

  const scrollToTabs = () => tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f7f5" }}>

      {/* ── Breadcrumb ── */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <nav className="flex items-center gap-1.5 text-sm">
          <Link href={`/${locale}`} className="text-slate-400 hover:text-[#0d7434] transition-colors">Home</Link>
          <ChevronRight size={13} className="text-slate-300" />
          <Link href={`/${locale}/packages`} className="text-slate-400 hover:text-[#0d7434] transition-colors">Packages</Link>
          <ChevronRight size={13} className="text-slate-300" />
          <span className="text-slate-700 font-medium truncate max-w-[200px]">{title}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-20">

        {/* ── Image Gallery ── */}
        <div className="relative rounded-2xl overflow-hidden mb-6 mt-2" style={{ height: "420px" }}>
          {hasImages ? (
            <>
              <Image src={images[imgIdx]!.url} alt={title} fill className="object-cover" sizes="100vw" priority />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }} />
              {images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors backdrop-blur-sm">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors backdrop-blur-sm">
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-1.5">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setImgIdx(i)}
                        className={`rounded-full transition-all ${i === imgIdx ? "bg-white w-5 h-2" : "bg-white/50 w-2 h-2"}`} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #071f10 0%, #0a2e18 50%, #163d24 100%)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
            </>
          )}

          {/* Overlay text */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${CATEGORY_COLOR[pkg.category] ?? "bg-slate-100 text-slate-600"}`}>
                {CATEGORY_LABEL[pkg.category] ?? pkg.category}
              </span>
              <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1">
                <Star size={12} fill="#F59E0B" stroke="#F59E0B" />
                <span className="text-white text-xs font-bold">{pkg.rating.toFixed(1)}</span>
                <span className="text-white/60 text-xs">({pkg.review_count})</span>
              </div>
            </div>
            <h1 className="text-white font-bold text-2xl sm:text-3xl leading-tight">{title}</h1>
            <div className="flex items-center gap-1 mt-1 text-white/70 text-sm">
              <MapPin size={13} />
              <span>{pkg.destination?.city || "Makkah"}, Saudi Arabia</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => setWishlist(v => !v)}
              className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
            >
              <Heart size={16} fill={wishlist ? "#fff" : "none"} />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors">
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-5">

            {/* Quick stats pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <StatPill icon={<Clock size={16} />}    label="Duration"   value={`${pkg.duration_days} days / ${pkg.duration_nights ?? pkg.duration_days - 1} nights`} />
              <StatPill icon={<MapPin size={16} />}   label="Destination" value={pkg.destination?.city || "Makkah"} />
              <StatPill icon={<Utensils size={16} />} label="Meals"      value={MEAL_LABELS[pkg.meal_plan ?? ""] ?? "Included"} />
              <StatPill icon={<Users size={16} />}    label="Group Size" value={`${(pkg as any).min_group_size ?? 1}–${(pkg as any).max_group_size ?? 20} pax`} />
              <StatPill icon={<Globe size={16} />}    label="Languages"  value={pkg.language_spoken?.join(", ").toUpperCase() || "EN, AR"} />
              {(pkg as any).departure_city && (
                <StatPill icon={<Plane size={16} />} label="Departure" value={(pkg as any).departure_city} />
              )}
            </div>

            {/* Inclusions row */}
            <div className="flex flex-wrap gap-3">
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${pkg.includes_flights ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-50 text-slate-400 border border-slate-200"}`}>
                {pkg.includes_flights ? <CheckCircle size={15} /> : <XCircle size={15} />}
                Flights {pkg.includes_flights ? "Included" : "Not Included"}
              </div>
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ${pkg.includes_visa ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-50 text-slate-400 border border-slate-200"}`}>
                {pkg.includes_visa ? <CheckCircle size={15} /> : <XCircle size={15} />}
                Visa {pkg.includes_visa ? "Included" : "Not Included"}
              </div>
            </div>

            {/* Tabs */}
            <div ref={tabsRef} className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              {/* Tab bar */}
              <div className="flex border-b border-slate-100 overflow-x-auto">
                {(["overview", "itinerary", "includes", "reviews"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className="flex-shrink-0 px-5 py-4 text-sm font-semibold capitalize transition-all relative"
                    style={{ color: tab === t ? "#0d7434" : "#9ca3af" }}
                  >
                    {t === "includes" ? "What's Included" : t === "reviews" ? `Reviews (${REVIEWS.length})` : t.charAt(0).toUpperCase() + t.slice(1)}
                    {tab === t && (
                      <motion.div layoutId="tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                        style={{ backgroundColor: "#0d7434" }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="p-6">

                {/* Overview */}
                {tab === "overview" && (
                  <div>
                    {summary && (
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 font-medium" style={{ fontSize: "15px" }}>
                        {summary}
                      </p>
                    )}
                    {description && (
                      <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line">
                        {description}
                      </p>
                    )}
                    {/* Highlights */}
                    <div className="mt-5 grid sm:grid-cols-2 gap-2">
                      {[
                        "4-star hotel within walking distance of Haram",
                        "Certified Islamic scholar accompanying the group",
                        "Private air-conditioned coach for all transfers",
                        "All visas and documentation handled",
                        "24/7 support from a dedicated group leader",
                        "Zamzam water provided for all pilgrims",
                      ].map(h => (
                        <div key={h} className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Itinerary */}
                {tab === "itinerary" && (
                  <div className="flex flex-col gap-2">
                    {itinerary.map(({ day, title: dtitle, desc }) => (
                      <div key={day} className="border border-slate-100 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenDay(openDay === day ? null : day)}
                          className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{ backgroundColor: "#0d7434" }}>
                              {day}
                            </span>
                            <span className="font-semibold text-sm text-slate-800">{dtitle}</span>
                          </div>
                          <ChevronDown size={16} className={`text-slate-400 transition-transform ${openDay === day ? "rotate-180" : ""}`} />
                        </button>
                        {openDay === day && (
                          <div className="px-4 pb-4 pt-1 text-sm text-slate-500 leading-relaxed border-t border-slate-50">
                            {desc}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Includes */}
                {tab === "includes" && (
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <CheckCircle size={16} className="text-emerald-500" />
                        What's Included
                      </h3>
                      <div className="flex flex-col gap-1">
                        {INCLUDES.map(item => <IncludeItem key={item} text={item} included={true} />)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <XCircle size={16} className="text-slate-400" />
                        Not Included
                      </h3>
                      <div className="flex flex-col gap-1">
                        {EXCLUDES.map(item => <IncludeItem key={item} text={item} included={false} />)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews */}
                {tab === "reviews" && (
                  <div>
                    {/* Rating summary */}
                    <div className="flex items-center gap-6 mb-6 p-4 bg-slate-50 rounded-xl">
                      <div className="text-center">
                        <p className="text-5xl font-black" style={{ color: "#0d7434" }}>{pkg.rating.toFixed(1)}</p>
                        <div className="flex items-center justify-center gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={13} fill="#F59E0B" stroke="#F59E0B" />
                          ))}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{pkg.review_count} reviews</p>
                      </div>
                      <div className="flex-1 flex flex-col gap-1.5">
                        {[5,4,3,2,1].map(s => {
                          const pct = s === 5 ? 78 : s === 4 ? 15 : s === 3 ? 5 : s === 2 ? 1 : 1;
                          return (
                            <div key={s} className="flex items-center gap-2">
                              <span className="text-xs text-slate-500 w-3">{s}</span>
                              <Star size={10} fill="#F59E0B" stroke="#F59E0B" />
                              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs text-slate-400 w-8">{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {REVIEWS.map((r, idx) => (
                        <div key={r.name} className="border border-slate-100 rounded-xl p-4">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                              style={{ backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}>
                              {r.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-sm text-slate-800">{r.name}</p>
                                <span className="text-xs text-slate-400">{r.date}</span>
                              </div>
                              <div className="flex items-center gap-0.5 mt-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} size={11} fill={i < r.rating ? "#F59E0B" : "none"} stroke={i < r.rating ? "#F59E0B" : "#d1d5db"} strokeWidth={1.5} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-slate-500 leading-relaxed">{r.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* ── Right sidebar (sticky) ── */}
          <div className="lg:sticky lg:top-24 self-start flex flex-col gap-4">

            {/* Booking card */}
            <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.09)" }}>
              {/* Price */}
              <div className="mb-4">
                {hasDiscount ? (
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black" style={{ color: "#0d7434" }}>
                      {pkg.currency} {displayPrice.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-400 line-through">{pkg.currency} {pkg.base_price.toLocaleString()}</p>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                      {Math.round((1 - displayPrice / pkg.base_price) * 100)}% OFF
                    </span>
                  </div>
                ) : (
                  <p className="text-3xl font-black" style={{ color: "#0d7434" }}>
                    {pkg.currency} {displayPrice.toLocaleString()}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-0.5">per person, all taxes included</p>
              </div>

              {/* Duration + inclusions */}
              <div className="flex flex-col gap-2 mb-5 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock size={14} className="text-slate-400" />
                  {pkg.duration_days} days / {pkg.duration_nights ?? pkg.duration_days - 1} nights
                </div>
                {pkg.includes_flights && (
                  <div className="flex items-center gap-2" style={{ color: "#0d7434" }}>
                    <Plane size={14} />
                    <span className="font-medium">Flights included</span>
                  </div>
                )}
                {pkg.includes_visa && (
                  <div className="flex items-center gap-2" style={{ color: "#0d7434" }}>
                    <Shield size={14} />
                    <span className="font-medium">Visa included</span>
                  </div>
                )}
              </div>

              {/* Departure dates */}
              <div className="mb-5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Select Departure</p>
                <div className="flex flex-col gap-1.5">
                  {DEPARTURE_DATES.map(({ date, seats }, i) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(i)}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm transition-all"
                      style={{
                        borderColor:     selectedDate === i ? "#0d7434" : "#e5e7eb",
                        backgroundColor: selectedDate === i ? "rgba(13,116,52,0.04)" : "#fff",
                        color: selectedDate === i ? "#0d7434" : "#374151",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar size={13} />
                        <span className="font-medium">{date}</span>
                      </div>
                      <span className={`text-xs font-semibold ${seats <= 5 ? "text-red-500" : "text-slate-400"}`}>
                        {seats <= 5 ? `${seats} left!` : `${seats} seats`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link
                href={`/${locale}/packages/${slug}/book`}
                className="block w-full text-center py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01]"
                style={{ background: "linear-gradient(135deg, #1abc9c 0%, #0d7434 100%)" }}
              >
                Book Now
              </Link>
              <p className="text-center text-xs text-slate-400 mt-2">Free cancellation up to 30 days before</p>

              {/* Enquire */}
              <button className="w-full mt-2 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <Phone size={13} />
                Make an Enquiry
              </button>
            </div>

            {/* Agency card */}
            <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Travel Agency</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold"
                  style={{ backgroundColor: "#0d7434", fontSize: "16px" }}>
                  {pkg.agency?.trade_name?.[0] ?? "A"}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{pkg.agency?.trade_name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={10} fill="#F59E0B" stroke="#F59E0B" />
                    <span className="text-xs text-slate-500">4.9 · Verified Agency</span>
                  </div>
                </div>
              </div>
              <Link href={`/${locale}/agencies/${pkg.agency?.slug}`}
                className="mt-3 block text-center text-xs font-semibold hover:underline"
                style={{ color: "#0d7434" }}>
                View agency profile →
              </Link>
            </div>

            {/* Help box */}
            <div className="rounded-2xl p-4 text-center" style={{ background: "linear-gradient(135deg, #071f10 0%, #163d24 100%)" }}>
              <p className="text-white font-semibold text-sm mb-1">Need help choosing?</p>
              <p className="text-white/60 text-xs mb-3">Our advisors are available 24/7 to help you plan</p>
              <button className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                style={{ background: "#1abc9c", color: "#071f10" }}>
                Chat with an Advisor
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
