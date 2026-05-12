"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion/variants";

const DESTINATIONS = [
  { img: "/images/destinations/dest1.jpg", name: "Jabal Al Nour", price: "$200/per person", rating: "5.0", reviews: "2.5k Review" },
  { img: "/images/destinations/dest2.jpg", name: "Abraj Al Bait", price: "$200/per person", rating: "5.0", reviews: "2.5k Review" },
  { img: "/images/destinations/dest3.jpg", name: "Makkah Mall",   price: "$200/per person", rating: "5.0", reviews: "2.5k Review" },
  { img: "/images/destinations/dest1.jpg", name: "Jabal Arafat",  price: "$200/per person", rating: "5.0", reviews: "2.5k Review" },
  { img: "/images/destinations/dest3.jpg", name: "Al-Masjid",     price: "$200/per person", rating: "5.0", reviews: "2.5k Review" },
];

export default function DestinationsSection() {
  const t = useTranslations("home.destinations");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <section className="px-4" style={{ padding: "68px 16px" }}>
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center mb-[50px]"
      >
        <h2 className="section-title">{t("title")}</h2>
        <p className="section-subtitle">{t("subtitle")}</p>
      </motion.div>

      <div className="relative mx-auto" style={{ maxWidth: "1140px" }}>
        {/* Scroll arrows */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center hover:bg-[#0d7434] hover:text-white transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-[#0d7434] text-white shadow-card flex items-center justify-center hover:bg-[#0a5d2a] transition-colors"
        >
          <ChevronRight size={18} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-2 scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {DESTINATIONS.map(({ img, name, price, rating, reviews }, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="group flex-shrink-0 cursor-pointer"
              style={{ width: "240px" }}
            >
              <div
                className="relative w-full rounded-xl overflow-hidden mb-4 transition-shadow duration-200 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.10)]"
                style={{ height: "220px" }}
              >
                <Image
                  src={img}
                  alt={name}
                  fill
                  className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  sizes="240px"
                />
              </div>
              <p style={{ fontSize: "20px", fontWeight: 500, lineHeight: "30px", color: "#0f1416", marginBottom: "4px" }}>
                {name}
              </p>
              <p style={{ fontSize: "14px", color: "#a6aaac", marginBottom: "8px" }}>{price}</p>
              <div className="flex items-center gap-1">
                <span className="flex items-center gap-1 text-xs font-medium bg-[#0d7434] text-white px-2 py-0.5 rounded-full">
                  ★ {rating}
                </span>
                <span style={{ fontSize: "13px", color: "#a6aaac" }}>({reviews})</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
