"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import FilterSidebar from "@/components/booking/FilterSidebar";
import PackageCard from "@/components/marketing/PackageCard";
import { SkeletonCardGrid } from "@/components/marketing/SkeletonCard";
import { staggerContainer, fadeInUp } from "@/lib/motion/variants";
import AirplaneDecoration, { StarDecoration } from "@/components/shared/AirplaneDecoration";
import type { Package } from "@/lib/api";

const SORT_OPTIONS = [
  { value: "featured",   label: "Featured"          },
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating",     label: "Rating"             },
];

const MOCK: Package[] = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  slug: `package-${i + 1}`,
  title: { en: "Lorem ipsum dolor sit amet", ar: "باقة رقم " + (i + 1) },
  summary: { en: "4 Days Tour", ar: "جولة ٤ أيام" },
  description: { en: "", ar: "" },
  category: "religion",
  duration_days: 4,
  duration_nights: 3,
  base_price: 189.25,
  discounted_price: i % 3 === 0 ? 150 : undefined,
  currency: "USD",
  images: [{ url: `/images/packages/pkg${(i % 6) + 1}.jpg`, type: "cover" }],
  rating: 4.8,
  review_count: 243,
  destination: { name: { en: "Makkah", ar: "مكة المكرمة" }, city: "Makkah" },
  agency: { id: "a1", slug: "agency-1", trade_name: "Agency 1", logo_url: "/images/agencies/logo1.png" },
  status: "published",
  includes_visa: true,
  includes_flights: true,
  meal_plan: "full_board",
  language_spoken: ["en", "ar"],
}));

const DEFAULT_FILTERS = {
  tourTypes: ["religion"] as string[],
  agency: "Travel Agency 1",
  priceRange: "200-500",
  duration: "2-5",
  languages: ["Arabic"] as string[],
  ratings: [5] as number[],
  special: "Discounts",
};

export default function PackagesPage() {
  const t  = useTranslations("packages");
  const tc = useTranslations("common");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const totalPages = 3;

  // Briefly show skeleton on filter/sort change so users see the system responding.
  // 320ms is short enough to feel snappy, long enough to register.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setIsLoading(true);
    const id = setTimeout(() => setIsLoading(false), 320);
    return () => clearTimeout(id);
  }, [filters, sort]);

  // Real sort drives the FLIP animation on sort change.
  const visiblePackages = useMemo(() => {
    const arr = [...MOCK];
    switch (sort) {
      case "price_asc":
        arr.sort((a, b) =>
          (a.discounted_price ?? a.base_price) - (b.discounted_price ?? b.base_price),
        );
        break;
      case "price_desc":
        arr.sort((a, b) =>
          (b.discounted_price ?? b.base_price) - (a.discounted_price ?? a.base_price),
        );
        break;
      case "rating":
        arr.sort((a, b) => b.rating - a.rating);
        break;
      // "featured" → keep the original order
    }
    return arr;
  }, [sort]);

  const handleFiltersChange = useCallback((next: typeof DEFAULT_FILTERS) => {
    setFilters(next);
    setPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 relative">
      {/* Decorations */}
      <AirplaneDecoration className="top-16 right-8 hidden lg:block" speed={0.2} />
      <StarDecoration className="absolute top-24 right-24 hidden lg:block" />

      <div className="container mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-2 text-sm text-neutral-500 mb-6"
        >
          <Link href="/" className="hover:text-primary-700 transition-colors">{tc("home")}</Link>
          <span>›</span>
          <span className="text-neutral-800 font-medium">Packages</span>
        </motion.div>

        {/* Title + Sort */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <motion.div variants={fadeInUp} initial="hidden" animate="visible">
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-neutral-900 mb-2">
              {t("title")}
            </h1>
            <div className="w-12 h-1 bg-primary-700 rounded-full" />
          </motion.div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Mobile filter button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border-2 border-primary-700 text-primary-700 rounded-lg text-sm font-medium"
            >
              <SlidersHorizontal size={15} />
              Filters
            </button>

            {/* Sort */}
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <span className="font-medium hidden sm:inline">{t("sortBy")}:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-neutral-200 rounded-lg px-3 py-2 text-sm text-neutral-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-700"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="flex gap-8">
          {/* Sidebar — desktop */}
          <div className="hidden lg:block w-56 xl:w-64 flex-shrink-0">
            <FilterSidebar value={filters} onChange={handleFiltersChange} />
          </div>

          {/* Results grid */}
          <div className="flex-1 min-w-0">
            <LayoutGroup>
              <motion.div
                layout
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {isLoading ? (
                    <SkeletonCardGrid count={visiblePackages.length} />
                  ) : (
                    visiblePackages.map((pkg) => (
                      <PackageCard key={pkg.id} pkg={pkg} />
                    ))
                  )}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="w-10 h-10 rounded-full border-2 border-neutral-200 flex items-center justify-center hover:border-primary-700 hover:text-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                    page === i + 1
                      ? "bg-primary-700 text-white shadow-green"
                      : "border-2 border-neutral-200 text-neutral-700 hover:border-primary-700 hover:text-primary-700"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 rounded-full border-2 border-neutral-200 flex items-center justify-center hover:border-primary-700 hover:text-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative ml-auto w-80 max-w-full bg-white h-full overflow-y-auto p-4 shadow-modal">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <FilterSidebar value={filters} onChange={handleFiltersChange} />
          </div>
        </div>
      )}
    </div>
  );
}
