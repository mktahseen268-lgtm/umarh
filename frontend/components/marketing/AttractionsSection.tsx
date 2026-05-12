"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion/variants";

const ATTRACTIONS = [
  { img: "/images/deals/deal4.jpg", name: "Jabal Arafat",      text: "Up to 50% Discount on Early Booking" },
  { img: "/images/deals/deal1.jpg", name: "Masjid Al-Haram",   text: "Up to 50% Discount on Early Booking" },
  { img: "/images/deals/deal2.jpg", name: "Zamzam Well",       text: "Up to 50% Discount on Early Booking" },
  { img: "/images/deals/deal3.jpg", name: "Jabal Al-Nour",     text: "Up to 50% Discount on Early Booking" },
  { img: "/images/deals/deal4.jpg", name: "Al-Masjid Al-Nabawi", text: "Up to 50% Discount on Early Booking" },
  { img: "/images/deals/deal1.jpg", name: "Mina",              text: "Up to 50% Discount on Early Booking" },
  { img: "/images/deals/deal2.jpg", name: "Muzdalifah",        text: "Up to 50% Discount on Early Booking" },
  { img: "/images/deals/deal3.jpg", name: "Jabal Thawr",       text: "Up to 50% Discount on Early Booking" },
];

export default function AttractionsSection() {
  const t = useTranslations("home.attractions");
  return (
    <section className="relative overflow-hidden" style={{ padding: "80px 16px" }}>
      {/* Plane decorations */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none">
        <Image src="/images/left-plane-bg.png" alt="" width={180} height={180} className="object-contain" />
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none">
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
        <p className="section-subtitle">{t("subtitle")}</p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-4 mx-auto"
        style={{ maxWidth: "1140px" }}
      >
        {ATTRACTIONS.map(({ img, name, text }) => (
          <motion.div
            key={name}
            variants={staggerItem}
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="group flex items-center gap-3 bg-white cursor-pointer transition-shadow duration-200 hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)]"
            style={{
              border: "1px solid #efeeee",
              borderRadius: "8px",
              padding: "12px 16px",
              maxWidth: "305px",
              width: "100%",
              flex: "1 1 260px",
            }}
          >
            {/* Thumbnail */}
            <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: "80px", height: "64px" }}>
              <Image
                src={img}
                alt={name}
                fill
                className="object-cover transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
                sizes="80px"
              />
            </div>
            <div>
              <p style={{ fontSize: "16px", fontWeight: 500, color: "#0f1416", marginBottom: "4px" }}>{name}</p>
              <p style={{ fontSize: "12px", color: "#a6aaac" }}>{text}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
