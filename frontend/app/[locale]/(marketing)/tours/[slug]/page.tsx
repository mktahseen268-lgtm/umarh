"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import {
  MapPin, Star, Clock, Users, Calendar, Heart, Share2,
  CheckCircle, Shield, Smartphone, Zap, Globe, ChevronLeft, ChevronRight,
  Bell, Phone
} from "lucide-react";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/motion/variants";
import AirplaneDecoration, { StarDecoration } from "@/components/shared/AirplaneDecoration";
import { formatPrice } from "@/lib/utils";

const MOCK_PACKAGE = {
  id: "1",
  slug: "maecenas-tristique",
  title: { en: "Maecenas tristique.", ar: "باقة مكة المكرمة" },
  rating: 4.9,
  reviewCount: 300,
  destination: { city: "Makkah", name: { en: "Makkah", ar: "مكة المكرمة" } },
  images: [
    "/images/packages/detail1.jpg",
    "/images/packages/detail2.jpg",
    "/images/packages/detail3.jpg",
    "/images/packages/detail4.jpg",
    "/images/packages/detail5.jpg",
  ],
  duration: "3.5 Hours",
  language: "English – Arabic",
  numPeople: 2,
  description: {
    en: "Lorem ipsum dolor sit amet, consectetur adipiscing. Urna vitae purus semper rutrum sed faucibus. Et gravida neque neque duis nam habitant. Nisl bibendum viverra id integer libero luctus. Nulla mauris ac pellentesque eget rhoncus libero. Mattis quam ut ornare sit sed neque. Non integer ut quam nisl luctus odio ipsum ut condimentum.",
    ar: "لوريم إيبسوم دولار سيت أميت، كونسيكتيتور أديبيسسينج.",
  },
  activity: [
    "Lorem ipsum dolor sit amet consectetur.",
    "Lorem ipsum dolor sit amet consectetur.",
    "Lorem ipsum dolor sit amet consectetur.",
    "Lorem ipsum dolor sit amet consectetur.",
  ],
  price: 1000,
  currency: "USD",
  agency: {
    name: "Lorem Ipsum",
    slogan: "YOUR SLOGAN GOES HERE",
    logo: "/images/agencies/logo1.png",
  },
  meetingPoint: { lat: 21.4225, lng: 39.8262 },
};

const FEATURES: Array<{ key: string; Icon: React.ElementType; value?: string }> = [
  { key: "freeCancellation",    Icon: CheckCircle  },
  { key: "healthPrecautions",   Icon: Shield       },
  { key: "mobileTicketing",     Icon: Smartphone   },
  { key: "duration",            Icon: Clock,  value: "3.5 Hours" },
  { key: "instantConfirmation", Icon: Zap          },
  { key: "liveTourGuide",       Icon: Globe        },
];

export default function PackageDetailPage({ params }: { params: { slug: string } }) {
  const t = useTranslations("packageDetail");
  const locale = useLocale();
  const [activeImg, setActiveImg] = useState(0);
  const [guests, setGuests] = useState({ adults: 2, youth: 0, children: 0 });
  const [fromDate, setFromDate] = useState("29 Oct, 2024");
  const [toDate, setToDate] = useState("29 Oct, 2024");
  const [wishlisted, setWishlisted] = useState(false);

  const subtotal = MOCK_PACKAGE.price * (guests.adults + guests.youth * 0.7 + guests.children * 0.5);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Decorations */}
      <AirplaneDecoration className="top-20 right-8 hidden lg:block" speed={0.2} />
      <StarDecoration className="absolute top-32 right-20 hidden lg:block" />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
          <Link href="/" className="hover:text-primary-700">Home</Link>
          <span>›</span>
          <Link href="/packages" className="hover:text-primary-700">Tours</Link>
          <span>›</span>
          <span className="text-neutral-800 font-medium">
            {MOCK_PACKAGE.title[locale as "en" | "ar"] ?? MOCK_PACKAGE.title.en}
          </span>
        </div>

        {/* Title */}
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="mb-6">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-neutral-900 mb-2">
            {MOCK_PACKAGE.title[locale as "en" | "ar"] ?? MOCK_PACKAGE.title.en}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 text-sm text-neutral-500">
              <MapPin size={14} className="text-primary-700" />
              {MOCK_PACKAGE.destination.city}
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill="#F59E0B" className="text-accent-500" />
              ))}
              <span className="text-sm font-semibold text-neutral-800 ml-1">
                {MOCK_PACKAGE.rating} ({MOCK_PACKAGE.reviewCount} reviews)
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Gallery + Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div>
              <div className="relative h-80 lg:h-[420px] rounded-2xl overflow-hidden mb-2">
                <Image
                  src={MOCK_PACKAGE.images[activeImg] ?? MOCK_PACKAGE.images[0]!}
                  alt="Package"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {MOCK_PACKAGE.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImg === i ? "border-primary-700" : "border-transparent"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            </div>

            {/* Feature badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-5 bg-white rounded-2xl shadow-card">
              {FEATURES.map(({ key, Icon, value: featureVal }) => (
                <div key={key} className="flex gap-3 items-start">
                  <Icon size={18} className="text-primary-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-800">{t(key)}</p>
                    {featureVal
                      ? <p className="text-xs text-neutral-500">{featureVal}</p>
                      : <p className="text-xs text-neutral-500">{t(`${key}Desc`)}</p>
                    }
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <section className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-display text-xl font-bold text-primary-700 mb-4">{t("description")}</h2>
              <p className="text-neutral-600 leading-relaxed">
                {MOCK_PACKAGE.description[locale as "en" | "ar"] ?? MOCK_PACKAGE.description.en}
              </p>
            </section>

            {/* Activity */}
            <section className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-display text-xl font-bold text-primary-700 mb-4">{t("activity")}</h2>
              <ul className="space-y-2">
                {MOCK_PACKAGE.activity.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-neutral-600 text-sm">
                    <span className="text-primary-700 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Details row */}
            <section className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-display text-xl font-bold text-neutral-900 mb-4">{t("details")}</h2>
              <div className="flex flex-wrap gap-6 border-b border-neutral-100 pb-4">
                <div>
                  <p className="text-xs text-neutral-500 mb-0.5">{t("language")}</p>
                  <p className="text-sm font-medium text-neutral-800">English – Arabic</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-0.5">{t("duration")}</p>
                  <p className="text-sm font-medium text-neutral-800">2 Hours</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-0.5">{t("numberOfPeople")}</p>
                  <p className="text-sm font-medium text-neutral-800">2 People</p>
                </div>
              </div>
              {/* Meeting point */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-neutral-900">{t("meetingPoint")}</h3>
                  <a href="#" className="text-primary-700 text-sm font-medium hover:underline flex items-center gap-1">
                    <MapPin size={13} /> {t("openGoogleMaps")}
                  </a>
                </div>
                {/* Map placeholder */}
                <div className="h-48 bg-neutral-100 rounded-xl overflow-hidden flex items-center justify-center">
                  <div className="text-center text-neutral-400">
                    <MapPin size={32} className="mx-auto mb-2" />
                    <p className="text-sm">Makkah, Saudi Arabia</p>
                    <p className="text-xs">Interactive map loads here</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right: Booking widget + Agency card */}
          <div className="space-y-6">
            {/* Booking widget — sticky */}
            <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24">
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-4">{t("booking")}</h3>

              {/* From */}
              <div className="border border-neutral-200 rounded-xl p-3 mb-3">
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary-700" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                  <span className="font-semibold text-primary-700">{t("from")}</span>
                </div>
                <input
                  type="text"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="text-sm font-medium text-neutral-800 bg-transparent outline-none w-full"
                />
              </div>

              {/* To */}
              <div className="border border-neutral-200 rounded-xl p-3 mb-3">
                <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary-700" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                  <span className="font-semibold text-primary-700">{t("to")}</span>
                </div>
                <input
                  type="text"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="text-sm font-medium text-neutral-800 bg-transparent outline-none w-full"
                />
              </div>

              {/* Guest picker */}
              <div className="border border-neutral-200 rounded-xl p-3 mb-4">
                <p className="text-xs font-semibold text-neutral-500 mb-2 flex items-center gap-1">
                  <Users size={13} /> {t("noOfGuest")}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(["adults","youth","children"] as const).map((type) => (
                    <div key={type}>
                      <p className="text-[10px] text-neutral-400 capitalize mb-1">{type}</p>
                      <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                        <button onClick={() => setGuests(g => ({ ...g, [type]: Math.max(0, g[type] - 1) }))}
                          className="px-2 py-1 text-neutral-500 hover:text-primary-700 text-lg leading-none">−</button>
                        <span className="flex-1 text-center text-sm font-medium">{guests[type]}</span>
                        <button onClick={() => setGuests(g => ({ ...g, [type]: g[type] + 1 }))}
                          className="px-2 py-1 text-neutral-500 hover:text-primary-700 text-lg leading-none">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtotal */}
              <div className="bg-neutral-50 rounded-xl p-3 mb-4 text-center">
                <p className="text-xs text-neutral-500 mb-1">Subtotal</p>
                <p className="text-2xl font-bold text-primary-700">
                  {formatPrice(subtotal, MOCK_PACKAGE.currency)}
                </p>
              </div>

              <Link href="/checkout" className="btn-primary w-full block text-center mb-3">
                {t("confirmBooking")}
              </Link>

              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-neutral-200 rounded-xl text-sm font-medium hover:border-primary-700 transition-colors"
              >
                <Heart size={15} fill={wishlisted ? "#DC2626" : "none"} className={wishlisted ? "text-red-500" : "text-neutral-500"} />
                {t("saveWishlist")}
              </button>
            </div>

            {/* Agency card */}
            <div className="bg-white rounded-2xl shadow-card p-5">
              <h3 className="font-semibold text-sm text-neutral-700 mb-4">{t("travelAgencyDetails")}</h3>
              <div className="flex flex-col items-center mb-4">
                <div className="relative w-24 h-24 mb-2">
                  <Image src={MOCK_PACKAGE.agency.logo} alt={MOCK_PACKAGE.agency.name} fill className="object-contain" />
                </div>
                <p className="font-bold text-neutral-900">{MOCK_PACKAGE.agency.name}</p>
                <p className="text-xs text-neutral-400">{MOCK_PACKAGE.agency.slogan}</p>
              </div>
              <button className="btn-primary w-full mb-2 flex items-center justify-center gap-2">
                <Phone size={14} /> {t("contactUs")}
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-neutral-200 rounded-xl text-sm font-medium hover:border-primary-700 transition-colors mb-2">
                <Heart size={14} /> {t("addFavourite")}
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-neutral-200 rounded-xl text-sm font-medium hover:border-primary-700 transition-colors">
                <Bell size={14} /> {t("notifyMe")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
