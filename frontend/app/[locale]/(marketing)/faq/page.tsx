"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { Search, ChevronDown, Heart, Share2 } from "lucide-react";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion/variants";
import AirplaneDecoration, { StarDecoration } from "@/components/shared/AirplaneDecoration";
import ReviewsSection from "@/components/marketing/ReviewsSection";

type Category = "booking" | "renting" | "locations" | "hosts" | "prices" | "billing";

const CATEGORIES: Category[] = ["booking", "renting", "locations", "hosts", "prices", "billing"];

const FAQS: Record<Category, Array<{ q: string; a: string | null }>> = {
  booking: [
    { q: "How many apartments do you have in this location?", a: null },
    { q: "Do we have a parking space?", a: null },
    {
      q: "How can we cancel a booking?",
      a: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Imperdiet tempus felis vitae sit est quisque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Imperdiet tempus felis vitae sit est quisque.",
    },
    { q: "Do you accept groups of 5 people?", a: null },
  ],
  renting:    [{ q: "What documents do I need to rent?", a: null }],
  locations:  [{ q: "Which cities are available?", a: null }],
  hosts:      [{ q: "How do I become a host?", a: null }],
  prices:     [{ q: "Are prices inclusive of tax?", a: null }],
  billing:    [{ q: "How can I get an invoice?", a: null }],
};

function AccordionItem({ q, a, defaultOpen = false }: { q: string; a: string | null; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-neutral-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-left group"
        aria-expanded={open}
      >
        <span className="text-neutral-800 font-medium text-sm pr-4 group-hover:text-primary-700 transition-colors">
          {q}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={18} className="text-neutral-400 flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-neutral-500 leading-relaxed pr-8">
              {a ?? "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Imperdiet tempus felis vitae sit est quisque."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  const t = useTranslations("faq");
  const [activeCategory, setActiveCategory] = useState<Category>("booking");

  return (
    <div className="min-h-screen">
      {/* Hero CTA Banner */}
      <section className="relative py-20 bg-accent-50 overflow-hidden">
        <AirplaneDecoration className="top-8 right-12" speed={0.2} />
        <StarDecoration className="absolute bottom-8 left-16" />

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Kaaba image */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="relative h-72 lg:h-80"
            >
              <Image
                src="/images/faq-kaaba.jpg"
                alt="Jabal Arafat"
                fill
                className="object-contain drop-shadow-2xl"
                sizes="50vw"
              />
            </motion.div>

            {/* Info */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.h2 variants={staggerItem} className="font-display text-3xl lg:text-4xl font-bold text-neutral-900 mb-3">
                Jabal Arafat
              </motion.h2>
              <motion.p variants={staggerItem} className="text-neutral-500 leading-relaxed mb-6">
                Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
              </motion.p>
              <motion.div variants={staggerItem} className="flex items-center gap-3">
                <Link href="/packages" className="btn-primary">Explore</Link>
                <button className="w-11 h-11 rounded-full border-2 border-neutral-300 flex items-center justify-center hover:border-primary-700 transition-colors">
                  <Heart size={16} />
                </button>
                <button className="w-11 h-11 rounded-full border-2 border-neutral-300 flex items-center justify-center hover:border-primary-700 transition-colors">
                  <Share2 size={16} />
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-neutral-900 mb-2">
              {t("title")}
            </h2>
            <div className="w-12 h-1 bg-primary-700 rounded-full mx-auto mb-3" />
            <p className="text-neutral-500">{t("subtitle")}</p>
          </motion.div>

          {/* Search */}
          <div className="relative mb-8">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search questions..."
              className="w-full border border-neutral-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-700"
            />
          </div>

          {/* Categories */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-4"
          >
            <p className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
              <Search size={15} className="text-primary-700" />
              {t("browseCommon")}
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <motion.button
                  key={cat}
                  variants={staggerItem}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-primary-700 text-white shadow-green"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {t(`categories.${cat}`)}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* FAQ items */}
          <motion.div
            key={activeCategory}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-card p-6"
          >
            {(FAQS[activeCategory] ?? []).map((faq, i) => (
              <AccordionItem key={i} q={faq.q} a={faq.a} defaultOpen={faq.a !== null} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trending CTA + Featured Trips */}
      <TrendingFaqBanner />

      <ReviewsSection />
    </div>
  );
}

function TrendingFaqBanner() {
  return (
    <section className="bg-primary-900 py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left: blob image */}
          <div className="relative">
            <div className="w-64 h-64 mx-auto rounded-full overflow-hidden border-8 border-accent-500/30 relative">
              <Image src="/images/destinations/jabal-arafat.jpg" alt="Jabal Arafat" fill className="object-cover" sizes="256px" />
            </div>
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-accent-500 rounded-full opacity-30 blur-xl" />
          </div>
          {/* Right */}
          <div>
            <span className="text-xs font-semibold text-accent-400 uppercase tracking-widest mb-2 block">Trending Now</span>
            <h3 className="font-display text-2xl font-bold text-white mb-1">Jabal Arafat</h3>
            <div className="flex items-center gap-1 text-yellow-400 text-sm mb-4">
              {"★★★★★"} <span className="text-neutral-300 ml-1">4.9 (300 reviews)</span>
            </div>
            <p className="text-neutral-300 text-sm mb-6 leading-relaxed max-w-md">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
            </p>
            <div className="flex items-center gap-3">
              <Link href="/destinations/jabal-arafat" className="btn-primary">Explore</Link>
              <button className="w-11 h-11 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:border-accent-500 transition-colors"><Heart size={16}/></button>
              <button className="w-11 h-11 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:border-accent-500 transition-colors"><Share2 size={16}/></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
