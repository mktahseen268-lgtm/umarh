"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/motion/variants";

const DEALS = [
  { img: "/images/deals/deal1.jpg", discount: 75, location: "Makkah",  tours: "100+ Tours" },
  { img: "/images/deals/deal2.jpg", discount: 70, location: "Makkah",  tours: "100+ Tours" },
  { img: "/images/deals/deal3.jpg", discount: 65, location: "Makkah",  tours: "100+ Tours" },
  { img: "/images/deals/deal4.jpg", discount: 60, location: "Madinah", tours: "100+ Tours" },
  { img: "/images/deals/deal1.jpg", discount: 65, location: "Makkah",  tours: "100+ Tours" },
];

export default function DealsSection() {
  const t = useTranslations("home.deals");
  return (
    <section className="py-[68px] px-4">
      {/* Heading */}
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

      {/* Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-5 mx-auto"
        style={{ maxWidth: "1140px" }}
      >
        {DEALS.map(({ img, discount, location, tours }, i) => (
          <motion.div
            key={i}
            variants={staggerItem}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="group relative overflow-hidden cursor-pointer flex-shrink-0 transition-shadow duration-200 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
            style={{
              maxWidth: "190px",
              width: "calc(20% - 20px)",
              minWidth: "150px",
              borderRadius: "12px",
              boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.07)",
            }}
          >
            {/* Image */}
            <div className="relative w-full overflow-hidden" style={{ height: "240px" }}>
              <Image
                src={img}
                alt={location}
                fill
                className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                sizes="190px"
              />
            </div>

            {/* Circular discount badge — entry pulse */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              whileInView={{
                scale: [0.6, 1.08, 1, 1.04, 1],
                opacity: 1,
              }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.0, ease: "easeOut", times: [0, 0.4, 0.65, 0.85, 1] }}
              className="absolute top-[50%] left-[50%] flex flex-col items-center justify-center text-white"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                backgroundColor: "#0d7434",
                padding: "18px",
                textAlign: "center",
                lineHeight: 1.2,
                transform: "translate(-50%, -70%)",
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 500 }}>UPTO</span>
              <span style={{ fontSize: "24px", fontWeight: 500 }}>{discount}%</span>
              <span style={{ fontSize: "13px", fontWeight: 500 }}>OFF</span>
            </motion.div>

            {/* Content */}
            <div className="bg-white px-3 py-3">
              <p style={{ fontSize: "18px", fontWeight: 500, color: "#05073c" }}>{location}</p>
              <p style={{ fontSize: "13px", fontWeight: 400, color: "#a6aaac" }}>{tours}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
