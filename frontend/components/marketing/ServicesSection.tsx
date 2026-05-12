"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/motion/variants";

export default function ServicesSection() {
  const t = useTranslations("home.services");

  const SERVICES = [
    { icon: "/images/icons/trip-guide-4.svg", heading: t("support"),       text: t("supportDesc")       },
    { icon: "/images/icons/trip-guide-1.svg", heading: t("travelGuide"),   text: t("travelGuideDesc")   },
    { icon: "/images/icons/trip-guide-2.svg", heading: t("topDestination"),text: t("topDestinationDesc")},
    { icon: "/images/icons/trip-guide-3.svg", heading: t("easyBooking"),   text: t("easyBookingDesc")   },
  ];

  return (
    <section
      className="relative overflow-hidden"
      style={{ padding: "105px 16px 74px" }}
    >
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
