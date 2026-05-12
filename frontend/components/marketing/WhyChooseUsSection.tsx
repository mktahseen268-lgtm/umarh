"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { staggerContainer, staggerItem, slideInLeft } from "@/lib/motion/variants";

export default function WhyChooseUsSection() {
  const t = useTranslations("home.whyUs");
  const tc = useTranslations("common");

  const REASONS = [
    { icon: "/images/icons/trip-guide-1.svg", heading: t("agency"),   text: t("agencyDesc")   },
    { icon: "/images/icons/trip-guide-3.svg", heading: t("price"),    text: t("priceDesc")    },
    { icon: "/images/icons/trip-guide-2.svg", heading: t("coverage"), text: t("coverageDesc") },
  ];

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#f7f8fc", padding: "80px 16px" }}
    >
      {/* Plane decorations */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none select-none">
        <Image src="/images/left-plane-bg.png" alt="" width={180} height={180} className="object-contain" />
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none select-none">
        <Image src="/images/right-plane-bg.png" alt="" width={180} height={180} className="object-contain" />
      </div>

      <div
        className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mx-auto"
        style={{ maxWidth: "1140px" }}
      >
        {/* Left: content */}
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2
            className="font-display mb-2"
            style={{ fontSize: "35px", fontWeight: 700, lineHeight: "52.5px", color: "#0f1416" }}
          >
            {t("title")}
          </h2>
          <div
            className="mb-5"
            style={{ width: "100px", height: "7px", borderRadius: "7px", backgroundColor: "#0d7434" }}
          />
          <p className="mb-8" style={{ fontSize: "16px", color: "#0f1416", maxWidth: "400px" }}>
            {t("subtitle")}
          </p>
          <a href="/packages" className="btn-viewmore inline-flex">{tc("viewMore")}</a>
        </motion.div>

        {/* Right: 3 reason cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-6"
        >
          {REASONS.map(({ icon, heading, text }) => (
            <motion.div
              key={heading}
              variants={staggerItem}
              className="flex items-start gap-5"
            >
              <div
                className="flex-shrink-0 bg-white rounded-xl flex items-center justify-center"
                style={{ width: "56px", height: "56px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}
              >
                <Image src={icon} alt={heading} width={32} height={32} className="object-contain" />
              </div>
              <div>
                <p style={{ fontSize: "18px", fontWeight: 500, color: "#222222", marginBottom: "4px" }}>
                  {heading}
                </p>
                <p style={{ fontSize: "12px", fontWeight: 400, color: "#0f1416", lineHeight: "18px" }}>
                  {text}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
