"use client";

import Image from "next/image";
import FlightAnimation from "@/components/flight-animation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { CheckCircle2, Users, Globe2, ShieldCheck, Award } from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem, slideInLeft, slideInRight } from "@/lib/motion/variants";

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const duration = 1600;
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const VALUES = [
  { icon: ShieldCheck, title: "Trusted & Licensed",    desc: "All travel agencies on our platform are fully licensed and verified by the Ministry of Hajj & Umrah."  },
  { icon: Users,       title: "Pilgrim-First Service", desc: "We put pilgrims at the heart of everything — from 24/7 support to transparent pricing with no hidden fees." },
  { icon: Globe2,      title: "Global Reach",          desc: "Serving pilgrims from 80+ countries, we connect you with agencies that speak your language."             },
  { icon: Award,       title: "Quality Guaranteed",    desc: "Packages are rated by thousands of pilgrims. We only feature agencies that maintain a 4.5★ average or above." },
];

const TEAM = [
  { name: "Dr. Khalid Al-Rashidi", role: "Chief Executive Officer",      img: "/images/avatars/r1.jpg" },
  { name: "Fatima Al-Zahraa",      role: "Head of Pilgrim Experience",   img: "/images/avatars/r2.jpg" },
  { name: "Omar Siddiqui",         role: "Director of Agency Relations", img: "/images/avatars/r3.jpg" },
  { name: "Nour Al-Farouq",        role: "Chief Technology Officer",     img: "/images/avatars/r4.jpg" },
];

export default function AboutPage() {
  const t = useTranslations("home.about");

  return (
    <div>

      {/* ── Page header — Angular packages-listing style ── */}
      <div className="mx-auto" style={{ maxWidth: "1140px", padding: "40px 16px 0" }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-1.5 mb-4"
          style={{ fontSize: "16px", fontWeight: 400, color: "#05073c" }}
        >
          <Link href="/" className="hover:text-[#0d7434] transition-colors">Home</Link>
          <span className="text-[#a6aaac]">&gt;</span>
          <span>{t("label")}</span>
        </motion.div>

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
            {t("label")}
            <span
              className="absolute bottom-0 start-0"
              style={{ width: "100px", height: "7px", borderRadius: "7px", backgroundColor: "#0d7434", display: "block" }}
            />
          </h1>
        </motion.div>
      </div>

      {/* ── About section — Angular about-us-section style ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#f7f8fc", padding: "100px 16px" }}
      >
        {/* Plane decoration — animated flight path */}
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
          {/* Left — image */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden" style={{ borderRadius: "16px" }}>
              <Image
                src="/images/about-main.jpg"
                alt="Sacred journey to Makkah"
                width={560}
                height={480}
                className="w-full object-cover"
                style={{ borderRadius: "16px" }}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </motion.div>

          {/* Right — content */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="mb-3" style={{ fontSize: "20px", fontWeight: 600, color: "#0d7434" }}>
              {t("label")}
            </div>

            <h2
              className="font-display mb-4"
              style={{ fontSize: "35px", fontWeight: 700, lineHeight: "45.5px", color: "#222222" }}
            >
              {t("title").split("Booking Service")[0]}
              <span style={{ color: "#ec9c0c" }}>Booking Service</span>
            </h2>

            <div className="mb-6" style={{ width: "100px", height: "7px", borderRadius: "7px", backgroundColor: "#0d7434" }} />

            <p className="mb-8" style={{ fontSize: "16px", fontWeight: 400, color: "#0f1416", lineHeight: "27px" }}>
              {t("description")}
            </p>

            <div className="mb-8">
              <Link href="/packages" className="btn-readmore inline-flex">{t("readMore")}</Link>
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
                    <CountUp target={target} suffix={suffix} />
                  </p>
                  <p style={{ fontSize: "18px", fontWeight: 400, color: "#0f1416" }}>{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Our Values ─── */}
      <section style={{ padding: "80px 16px", background: "#fff" }}>
        <div className="mx-auto" style={{ maxWidth: "1140px" }}>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Our Values</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                variants={staggerItem}
                className="group border border-[rgba(166,170,172,0.2)] rounded-2xl p-5 cursor-default transition-all duration-200 hover:bg-[#0d7434]"
              >
                <div className="w-14 h-14 bg-[#f9f9f9] group-hover:bg-white/20 rounded-[10px] flex items-center justify-center mb-5 transition-colors duration-200">
                  <Icon size={24} className="text-[#0d7434] group-hover:text-white transition-colors duration-200" />
                </div>
                <p className="text-[18px] font-medium text-[#0f1416] group-hover:text-white transition-colors duration-200 mb-2">
                  {title}
                </p>
                <p className="text-[14px] text-[#a6aaac] group-hover:text-white/75 transition-colors duration-200 leading-5">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Team ─── */}
      <section style={{ padding: "80px 16px", background: "#f7f8fc" }}>
        <div className="mx-auto" style={{ maxWidth: "1140px" }}>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Meet Our Team</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {TEAM.map(({ name, role, img }) => (
              <motion.div
                key={name}
                variants={staggerItem}
                className="text-center"
              >
                <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-[#0d7434]/10">
                  <Image src={img} alt={name} fill className="object-cover" sizes="112px" />
                </div>
                <p style={{ fontSize: "16px", fontWeight: 600, color: "#0f1416" }}>{name}</p>
                <p style={{ fontSize: "13px", color: "#0d7434", marginTop: "4px" }}>{role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA — Angular CtaBannerSection style ─── */}
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

    </div>
  );
}
