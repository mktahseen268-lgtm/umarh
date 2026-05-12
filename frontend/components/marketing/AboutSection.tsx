"use client";

import Image from "next/image";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import FlightAnimation from "@/components/flight-animation";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { slideInLeft, slideInRight } from "@/lib/motion/variants";

function CountUp({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function AboutSection() {
  const t = useTranslations("home.about");
  const sectionRef = useRef<HTMLElement>(null);

  // Subtle parallax on the about image
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const imageY = useSpring(rawY, { stiffness: 80, damping: 20 });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "#f7f8fc", padding: "100px 16px" }}
    >
      {/* Plane decoration top-left — animated flight path */}
      <FlightAnimation
        variant="about"
        imageSize={420}
        duration={9}
        className="absolute z-10"
        style={{
          left: "-30px",
          top: "10px",
          width: "380px",
          height: "380px",
          opacity: 0.9,
        }}
      />

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
          <div className="relative overflow-hidden" style={{ borderRadius: "16px", height: "480px" }}>
            <motion.div style={{ y: imageY }} className="absolute inset-[-30px]">
              <Image
                src="/images/about-main.jpg"
                alt="Sacred journey to Makkah"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Right: Content */}
        <motion.div
          variants={slideInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Small label */}
          <div
            className="mb-3"
            style={{ fontSize: "20px", fontWeight: 600, color: "#0d7434" }}
          >
            {t("label")}
          </div>

          {/* Main heading — Volkhov with golden span */}
          <h2
            className="font-display mb-4"
            style={{
              fontSize: "35px",
              fontWeight: 700,
              lineHeight: "45.5px",
              color: "#222222",
            }}
          >
            {t("title")}
          </h2>

          {/* Underline */}
          <div
            className="mb-6"
            style={{ width: "100px", height: "7px", borderRadius: "7px", backgroundColor: "#0d7434" }}
          />

          {/* Description */}
          <p
            className="mb-8 leading-relaxed"
            style={{ fontSize: "16px", fontWeight: 400, color: "#0f1416" }}
          >
            {t("description")}
          </p>

          {/* Read More button */}
          <div className="mb-8">
            <a href="/about" className="btn-readmore">{t("readMore")}</a>
          </div>

          {/* Counter stats */}
          <div className="flex gap-8">
            {[
              { target: 200, suffix: "+",  label: t("customers") },
              { target: 500, suffix: "+",  label: t("places")    },
              { target: 1,   suffix: "k+", label: t("journeys")  },
            ].map(({ target, suffix, label }) => (
              <div key={label} className="text-center">
                <p style={{ fontSize: "36px", fontWeight: 600, color: "#ec9c0c" }}>
                  <CountUp target={target} />{suffix}
                </p>
                <p style={{ fontSize: "18px", fontWeight: 400, color: "#0f1416" }}>{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
