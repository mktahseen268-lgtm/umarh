"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion/variants";
import { FlightLeft, FlightRight } from "@/components/flight-animation";

export default function CtaBannerSection() {
  return (
    <section
      className="relative overflow-hidden flex items-center justify-center"
      style={{ padding: "80px 16px", background: "#f7f8fc" }}
    >
      {/* Left plane — animated ascending arc */}
      <FlightLeft
        imageSize={420}
        duration={9}
        ease="easeInOut"
        className="absolute z-0"
        style={{ left: 0, bottom: 0, width: 380, height: 380, opacity: 0.75 }}
      />
      {/* Right plane — animated descending arc */}
      <FlightRight
        imageSize={420}
        duration={11}
        ease="easeInOut"
        className="absolute z-0"
        style={{ right: 0, top: 0, width: 380, height: 380, opacity: 0.75 }}
      />

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center relative z-10"
      >
        <h2
          className="font-display mb-8 mx-auto"
          style={{
            fontSize: "35px",
            fontWeight: 700,
            lineHeight: "52.5px",
            color: "#0f1416",
            maxWidth: "600px",
          }}
        >
          Lorem ipsum dolor sit amet consectetur.
        </h2>
        <a href="/packages" className="btn-primary inline-flex">
          Book Now
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
