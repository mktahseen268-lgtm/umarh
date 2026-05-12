"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fadeInUp } from "@/lib/motion/variants";
import { Marquee } from "@/components/shared/Motion";

const BRANDS = [
  { src: "/images/brands/brand1.svg", alt: "Brand 1" },
  { src: "/images/brands/brand2.svg", alt: "Brand 2" },
  { src: "/images/brands/brand3.svg", alt: "Brand 3" },
  { src: "/images/brands/brand4.svg", alt: "Brand 4" },
  { src: "/images/brands/brand5.svg", alt: "Brand 5" },
  { src: "/images/brands/brand6.svg", alt: "Brand 6" },
];

export default function TrustedBrandsSection() {
  const t = useTranslations("home.trusted");
  return (
    <section className="relative overflow-hidden" style={{ padding: "68px 16px" }}>
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto"
        style={{ maxWidth: "1140px" }}
      >
        <Marquee duration={28}>
          {BRANDS.map(({ src, alt }) => (
            <div
              key={alt}
              className="flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer flex-shrink-0"
            >
              <div className="relative h-10 w-28">
                <Image src={src} alt={alt} fill className="object-contain" />
              </div>
            </div>
          ))}
        </Marquee>
      </motion.div>
    </section>
  );
}
