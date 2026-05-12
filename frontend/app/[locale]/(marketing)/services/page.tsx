"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { staggerContainer, staggerItem, fadeInUp, slideInLeft } from "@/lib/motion/variants";

/* ─── Reusable service cards (same as home ServicesSection) ─── */
function ServiceCards() {
  const t = useTranslations("home.services");

  const SERVICES = [
    { icon: "/images/icons/trip-guide-4.svg", heading: t("support"),        text: t("supportDesc")        },
    { icon: "/images/icons/trip-guide-1.svg", heading: t("travelGuide"),    text: t("travelGuideDesc")    },
    { icon: "/images/icons/trip-guide-2.svg", heading: t("topDestination"), text: t("topDestinationDesc") },
    { icon: "/images/icons/trip-guide-3.svg", heading: t("easyBooking"),    text: t("easyBookingDesc")    },
  ];

  return (
    <section className="relative overflow-hidden" style={{ padding: "105px 16px 74px" }}>
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
        className="flex flex-wrap justify-center lg:justify-between gap-4 mx-auto"
        style={{ maxWidth: "1140px" }}
      >
        {SERVICES.map(({ icon, heading, text }) => (
          <motion.div
            key={heading}
            variants={staggerItem}
            className="group border border-[rgba(166,170,172,0.2)] rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:bg-[#0d7434] flex-1"
            style={{ maxWidth: "270px", minWidth: "220px" }}
          >
            <div className="w-14 h-14 bg-[#f9f9f9] group-hover:bg-white/20 rounded-[10px] flex items-center justify-center mb-5 transition-colors duration-200">
              <Image src={icon} alt={heading} width={24} height={24} className="object-contain" />
            </div>
            <p className="text-[20px] font-medium leading-[30px] text-[#0f1416] group-hover:text-white transition-colors duration-200 mb-2.5">
              {heading}
            </p>
            <p className="text-[16px] font-normal leading-6 text-[#a6aaac] group-hover:text-white/80 transition-colors duration-200">
              {text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─── Why Choose Us (same as home WhyChooseUsSection) ─────── */
function WhyChooseUs() {
  const t  = useTranslations("home.whyUs");
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
          <div className="mb-5" style={{ width: "100px", height: "7px", borderRadius: "7px", backgroundColor: "#0d7434" }} />
          <p className="mb-8" style={{ fontSize: "16px", color: "#0f1416", maxWidth: "400px" }}>
            {t("subtitle")}
          </p>
          <Link href="/packages" className="btn-viewmore inline-flex">{tc("viewMore")}</Link>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-6"
        >
          {REASONS.map(({ icon, heading, text }) => (
            <motion.div key={heading} variants={staggerItem} className="flex items-start gap-5">
              <div
                className="flex-shrink-0 bg-white rounded-xl flex items-center justify-center"
                style={{ width: "56px", height: "56px", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}
              >
                <Image src={icon} alt={heading} width={32} height={32} className="object-contain" />
              </div>
              <div>
                <p style={{ fontSize: "18px", fontWeight: 500, color: "#222222", marginBottom: "4px" }}>{heading}</p>
                <p style={{ fontSize: "12px", fontWeight: 400, color: "#0f1416", lineHeight: "18px" }}>{text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── CTA Banner (same as home CtaBannerSection) ──────────── */
function CtaBanner() {
  return (
    <section
      className="relative overflow-hidden flex items-center justify-center"
      style={{ padding: "80px 16px", background: "#f7f8fc" }}
    >
      <div className="absolute left-0 bottom-0 pointer-events-none select-none opacity-60">
        <Image src="/images/left-plane-bg.png" alt="" width={220} height={220} className="object-contain" />
      </div>
      <div className="absolute right-0 top-0 pointer-events-none select-none opacity-60">
        <Image src="/images/right-plane-bg.png" alt="" width={220} height={220} className="object-contain" />
      </div>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center relative z-10"
      >
        <h2
          className="font-display mb-8 mx-auto"
          style={{ fontSize: "35px", fontWeight: 700, lineHeight: "52.5px", color: "#0f1416", maxWidth: "600px" }}
        >
          Lorem ipsum dolor sit amet consectetur.
        </h2>
        <Link href="/packages" className="btn-primary inline-flex">
          Book Now
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </motion.div>
    </section>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */
export default function ServicesPage() {
  const t = useTranslations("home.services");

  return (
    <div>
      {/* Page header — matches Angular packages-listing banner style */}
      <div
        className="mx-auto"
        style={{ maxWidth: "1140px", padding: "40px 16px 0" }}
      >
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-1.5 mb-4"
          style={{ fontSize: "16px", fontWeight: 400, color: "#05073c" }}
        >
          <Link href="/" className="hover:text-[#0d7434] transition-colors">Home</Link>
          <span className="text-[#a6aaac]">&gt;</span>
          <span>{t("title")}</span>
        </motion.div>

        {/* Page heading — left-aligned with left green underline (Angular packages-listing style) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-10"
        >
          <h1
            className="font-display relative inline-block pb-4"
            style={{ fontSize: "35px", fontWeight: 700, lineHeight: "52.5px", color: "#0f1416" }}
          >
            {t("title")}
            {/* Left-aligned green underline bar */}
            <span
              className="absolute bottom-0 start-0"
              style={{ width: "100px", height: "7px", borderRadius: "7px", backgroundColor: "#0d7434", display: "block" }}
            />
          </h1>
        </motion.div>
      </div>

      {/* Services cards — identical to homepage section */}
      <ServiceCards />

      {/* Why Choose Us — identical to homepage section */}
      <WhyChooseUs />

      {/* CTA — identical to homepage section */}
      <CtaBanner />
    </div>
  );
}
