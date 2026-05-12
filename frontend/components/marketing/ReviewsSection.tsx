"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion/variants";

const REVIEWS = [
  {
    id: "1",
    name: "Hosam Hesham",
    title: "Traveler",
    avatar: "/images/avatars/r1.jpg",
    heading: "Excellent Service!",
    text: "I had an amazing experience with this company. The service was top-notch, and the staff was incredibly friendly. I highly recommend them!",
  },
  {
    id: "2",
    name: "Fatima Hassan",
    title: "Umrah Pilgrim · UAE",
    avatar: "/images/avatars/r2.jpg",
    heading: "Wonderful Journey!",
    text: "Everything was perfectly organised. Our hotel was steps from the Haram and the guide was incredibly knowledgeable about all the Ziyarah sites.",
  },
  {
    id: "3",
    name: "Muhammad Yusuf",
    title: "Family Package · Malaysia",
    avatar: "/images/avatars/r3.jpg",
    heading: "Highly Recommended!",
    text: "Booking through this platform was the best decision we made. The process was smooth from start to finish, and customer support was always available.",
  },
  {
    id: "4",
    name: "Sara Al-Amri",
    title: "VIP Umrah · Kuwait",
    avatar: "/images/avatars/r4.jpg",
    heading: "Beyond Expectations!",
    text: "The VIP package exceeded all expectations. Haram-view room, dedicated bilingual guide, and seamless visa processing. Truly spiritual and comfortable.",
  },
];

const MINI_REVIEWS = [
  { name: "Hosam Hesham",   text: "Wow, what a fun vacation with Oelinken, guided by professional people", avatar: "/images/avatars/r1.jpg" },
  { name: "Ahmed Rashidi",  text: "Wow, what a fun vacation with Oelinken, guided by professional people", avatar: "/images/avatars/r2.jpg" },
  { name: "Noor Abdallah",  text: "Wow, what a fun vacation with Oelinken, guided by professional people", avatar: "/images/avatars/r3.jpg" },
  { name: "Omar Al-Farouq", text: "Wow, what a fun vacation with Oelinken, guided by professional people", avatar: "/images/avatars/r4.jpg" },
];

export default function ReviewsSection() {
  const t = useTranslations("home.reviews");
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + REVIEWS.length) % REVIEWS.length);
  const next = () => setCurrent((c) => (c + 1) % REVIEWS.length);

  const review = REVIEWS[current]!;

  return (
    <section
      className="relative overflow-hidden"
      style={{ padding: "80px 16px" }}
    >
      {/* Plane decorations */}
      <div className="absolute left-0 top-1/4 opacity-10 pointer-events-none select-none">
        <Image src="/images/left-plane-bg.png" alt="" width={180} height={180} className="object-contain" />
      </div>
      <div className="absolute right-0 top-1/4 opacity-10 pointer-events-none select-none">
        <Image src="/images/right-plane-bg.png" alt="" width={180} height={180} className="object-contain" />
      </div>

      {/* Section heading */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="section-title">{t("title")}</h2>
      </motion.div>

      {/* Central carousel */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mx-auto mb-12"
        style={{ maxWidth: "600px", textAlign: "center" }}
      >
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Avatar with quotes icon */}
              <div className="relative w-[132px] mx-auto mb-6 p-[10px]">
                <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden ring-4 ring-[#0d7434]/20">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                {/* Quotes decoration */}
                <div className="absolute -bottom-2 right-0 w-8 h-8 rounded-full bg-[#0d7434] flex items-center justify-center">
                  <span className="text-white text-lg font-bold leading-none" style={{ fontFamily: "serif" }}>&ldquo;</span>
                </div>
              </div>

              {/* Heading */}
              <p className="mb-3" style={{ fontSize: "18px", fontWeight: 600, color: "#ffb127" }}>
                {review.heading}
              </p>

              {/* Review text */}
              <p
                className="mb-5 mx-auto"
                style={{ fontSize: "19px", fontWeight: 400, lineHeight: "30.4px", color: "#05073c", maxWidth: "480px" }}
              >
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Name & title */}
              <p style={{ fontSize: "16.75px", fontWeight: 500, color: "#0d7434" }}>{review.name}</p>
              <p style={{ fontSize: "15px", fontWeight: 400, color: "#05073c" }}>{review.title}</p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation — outside AnimatePresence so it never re-mounts */}
          <div className="flex justify-center gap-3 mt-6">
            <motion.button
              onClick={prev}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-10 h-10 rounded-full border-2 border-[#e7e6e6] flex items-center justify-center hover:border-[#0d7434] hover:text-[#0d7434] transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft size={18} />
            </motion.button>
            <motion.button
              onClick={next}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-10 h-10 rounded-full bg-[#0d7434] flex items-center justify-center text-white hover:bg-[#0a5d2a] transition-colors"
              aria-label="Next review"
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Mini review cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-5 mx-auto"
        style={{ maxWidth: "1140px" }}
      >
        {MINI_REVIEWS.map(({ name, text, avatar }) => (
          <motion.div
            key={name}
            variants={staggerItem}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="bg-white flex-1 cursor-default"
            style={{
              minWidth: "240px",
              maxWidth: "270px",
              boxShadow: "10px 24px 54px 0px rgba(0,0,0,0.071)",
              padding: "24px",
              borderRadius: "8px",
            }}
          >
            <p
              className="mb-5"
              style={{ fontSize: "14px", fontWeight: 400, color: "#0f1416", lineHeight: "22px" }}
            >
              {text}
            </p>

            <div className="flex items-center gap-3 pt-4 border-t border-[#e7e6e6]">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image src={avatar} alt={name} fill className="object-cover" sizes="40px" />
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#0f1416" }}>{name}</p>
                {/* Star rating */}
                <div className="flex gap-0.5 mt-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <svg key={s} viewBox="0 0 16 16" fill="#F59E0B" className="w-3 h-3">
                      <path d="M8 1l1.85 3.75L14 5.5l-3 2.92.7 4.08L8 10.27l-3.7 2.23.7-4.08L2 5.5l4.15-.75L8 1z"/>
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
