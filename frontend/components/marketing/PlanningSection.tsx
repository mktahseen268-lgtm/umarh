"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MapPin, Calendar, Star } from "lucide-react";
import { fadeInUp } from "@/lib/motion/variants";

const PACKAGES = [
  { img: "/images/packages/pkg1.jpg", name: "Package 1", location: "Makkah", days: "5 Days/4 Night", price: "$1500", rating: "4.8", reviews: "8.0K Reviews" },
  { img: "/images/packages/pkg2.jpg", name: "Package 2", location: "Makkah", days: "7 Days/6 Night", price: "$2200", rating: "4.9", reviews: "6.2K Reviews" },
  { img: "/images/packages/pkg3.jpg", name: "Package 3", location: "Makkah", days: "5 Days/4 Night", price: "$1200", rating: "4.7", reviews: "5.5K Reviews" },
  { img: "/images/packages/pkg4.jpg", name: "Package 4", location: "Madinah", days: "3 Days/2 Night", price: "$800",  rating: "4.6", reviews: "4.1K Reviews" },
  { img: "/images/packages/pkg5.jpg", name: "Package 5", location: "Makkah", days: "10 Days/9 Night", price: "$3800", rating: "4.9", reviews: "9.1K Reviews" },
  { img: "/images/packages/pkg6.jpg", name: "Package 6", location: "Makkah", days: "5 Days/4 Night", price: "$1500", rating: "4.8", reviews: "8.0K Reviews" },
];

export default function PlanningSection() {
  const t = useTranslations("home.planning");

  const TABS = [t("mostPopular"), t("specialDeals"), t("bestPrice"), t("recommendation")] as const;
  type TabType = typeof TABS[number];

  const [activeTab, setActiveTab] = useState<TabType>(t("mostPopular") as TabType);

  return (
    <section className="relative overflow-hidden" style={{ padding: "80px 16px" }}>
      {/* Plane decorations */}
      <div className="absolute left-0 bottom-0 opacity-10 pointer-events-none select-none">
        <Image src="/images/left-plane-bg.png" alt="" width={180} height={180} className="object-contain" />
      </div>
      <div className="absolute right-0 top-0 opacity-10 pointer-events-none select-none">
        <Image src="/images/right-plane-bg.png" alt="" width={180} height={180} className="object-contain" />
      </div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center mb-[50px]"
      >
        <h2 className="section-title">{t("title")}</h2>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mx-auto"
        style={{ maxWidth: "1140px" }}
      >
        <div className="flex gap-0 border-b border-[#e7e6e6] mb-8 overflow-x-auto relative">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors relative"
              style={{
                color: activeTab === tab ? "#0d7434" : "#0f1416",
                marginBottom: "-1px",
              }}
            >
              {tab}
              {activeTab === tab && (
                <motion.span
                  layoutId="planning-tab-indicator"
                  className="absolute left-2 right-2 bottom-0 h-[2px] bg-[#0d7434] rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Package cards grid */}
        <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
          {PACKAGES.map(({ img, name, location, days, price, rating, reviews }) => (
            <motion.div
              key={name}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="group bg-white cursor-pointer transition-shadow duration-200 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
              style={{
                border: "1px solid #e7e6e6",
                borderRadius: "10px",
                padding: "13px 16px 24px",
                maxWidth: "305px",
                width: "100%",
                flex: "1 1 260px",
              }}
            >
              {/* Image */}
              <div className="relative rounded-lg overflow-hidden mb-3" style={{ height: "180px" }}>
                <Image
                  src={img}
                  alt={name}
                  fill
                  className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                  sizes="305px"
                />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-1.5">
                <div className="relative w-16 h-3.5">
                  <Image src="/images/icons/rating.svg" alt="rating" fill className="object-contain" />
                </div>
                <span style={{ fontSize: "13px", color: "#a6aaac" }}>{rating} ({reviews})</span>
              </div>

              {/* Name */}
              <p style={{ fontSize: "15.88px", fontWeight: 500, color: "#0f1416", marginBottom: "8px" }}>{name}</p>

              {/* Meta */}
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center gap-1" style={{ fontSize: "11.29px", color: "#0d7434" }}>
                  <MapPin size={11} /> {location}
                </span>
                <span className="flex items-center gap-1" style={{ fontSize: "11.29px", color: "#a6aaac" }}>
                  <Calendar size={11} /> {days}
                </span>
              </div>

              {/* Price + View More */}
              <div className="flex items-center justify-between">
                <p style={{ fontSize: "15px", fontWeight: 500, color: "#0d7434" }}>
                  {price} <span style={{ fontWeight: 400, color: "#a6aaac", fontSize: "12px" }}>/per person</span>
                </p>
                <motion.a
                  href="/packages"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
                  style={{ backgroundColor: "#0d7434" }}
                >
                  View More
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
