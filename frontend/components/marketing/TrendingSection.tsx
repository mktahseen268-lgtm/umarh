"use client";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { MapPin, ThumbsUp, Share2 } from "lucide-react";
import { slideInLeft, slideInRight } from "@/lib/motion/variants";

export default function TrendingSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Subtle parallax on the trending image as user scrolls past it
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const imageY = useSpring(rawY, { stiffness: 80, damping: 20 });

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ padding: "80px 16px" }}>
      {/* Right plane */}
      <div className="absolute right-0 top-0 opacity-10 pointer-events-none select-none">
        <Image src="/images/right-plane-bg.png" alt="" width={200} height={200} className="object-contain" />
      </div>

      <div
        className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mx-auto"
        style={{ maxWidth: "1140px" }}
      >
        {/* Left: Image */}
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative rounded-2xl overflow-hidden" style={{ height: "460px" }}>
            <motion.div style={{ y: imageY }} className="absolute inset-[-30px]">
              <Image
                src="/images/destinations/dest2.jpg"
                alt="Jabal Arafat"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>
          {/* Left plane */}
          <div className="absolute -bottom-8 -left-8 opacity-30 pointer-events-none select-none">
            <Image src="/images/about-us-plane-left.png" alt="" width={120} height={120} className="object-contain" />
          </div>
        </motion.div>

        {/* Right: Content */}
        <motion.div
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Tag */}
          <span
            className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "#f0faf3", color: "#0d7434", border: "1px solid #b3e5c1" }}
          >
            Trending Now
          </span>

          {/* Heading */}
          <h2
            className="font-display mb-3"
            style={{ fontSize: "35px", fontWeight: 700, lineHeight: "45.5px", color: "#0f1416" }}
          >
            Jabal Arafat
          </h2>

          {/* Location + rating */}
          <div className="flex items-center gap-3 mb-5">
            <span className="flex items-center gap-1" style={{ fontSize: "15px", color: "#0f1416" }}>
              <MapPin size={16} className="text-[#0d7434]" /> Makkah
            </span>
            <span className="text-[#a6aaac]">|</span>
            <span className="flex items-center gap-1" style={{ fontSize: "15px", color: "#0f1416" }}>
              <span className="text-amber-500">★</span> 4.9
            </span>
            <span style={{ fontSize: "15px", color: "#a6aaac" }}>(300 reviews)</span>
          </div>

          {/* Description */}
          <p className="mb-8" style={{ fontSize: "15px", color: "#0f1416", lineHeight: "24px", maxWidth: "420px" }}>
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis
            enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <motion.a
              href="/packages"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary inline-flex"
              style={{ fontSize: "16px", padding: "14px 32px" }}
            >
              Explore
            </motion.a>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="w-10 h-10 rounded-full border border-[#e7e6e6] flex items-center justify-center hover:border-[#0d7434] transition-colors"
              >
                <ThumbsUp size={16} className="text-[#0f1416]" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="w-10 h-10 rounded-full border border-[#e7e6e6] flex items-center justify-center hover:border-[#0d7434] transition-colors"
              >
                <Share2 size={16} className="text-[#0f1416]" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
