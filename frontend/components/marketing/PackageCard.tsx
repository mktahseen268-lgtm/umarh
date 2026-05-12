"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { MapPin, Star, Clock, Heart } from "lucide-react";
import { useState } from "react";
import { staggerItem } from "@/lib/motion/variants";
import { cn, formatPrice } from "@/lib/utils";
import type { Package } from "@/lib/api";

interface PackageCardProps {
  pkg: Package;
  className?: string;
}

export default function PackageCard({ pkg, className }: PackageCardProps) {
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [saved, setSaved] = useState(false);

  const title = pkg.title[locale] ?? pkg.title["en"] ?? "";
  const hasDiscount = !!pkg.discounted_price && pkg.discounted_price < pkg.base_price;

  return (
    <motion.div
      layout
      variants={staggerItem}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
      whileHover={!reduce ? { y: -4 } : undefined}
      transition={{
        layout:  { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
        default: { type: "spring", stiffness: 300, damping: 26 },
      }}
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden shadow-card",
        "transition-shadow duration-200 hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)]",
        className,
      )}
    >
      <Link href={`/packages/${pkg.slug}`} className="block">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={pkg.images[0]?.url ?? "/images/placeholder-package.jpg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Discount badge — entrance pulse, then static */}
          {hasDiscount && (
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={
                reduce
                  ? { scale: 1, opacity: 1 }
                  : { scale: [0.7, 1.08, 1, 1.04, 1], opacity: 1 }
              }
              transition={{ duration: 1.2, ease: "easeOut", times: [0, 0.4, 0.65, 0.85, 1] }}
              className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm"
            >
              SALE
            </motion.div>
          )}

          {/* Wishlist heart */}
          <motion.button
            type="button"
            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSaved((s) => !s);
            }}
            whileTap={!reduce ? { scale: 0.85 } : undefined}
            className="absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-full bg-white/95 backdrop-blur shadow-card hover:bg-white transition-colors z-10"
          >
            <motion.span
              animate={saved && !reduce ? { scale: [1, 1.4, 1] } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
              className="inline-flex"
            >
              <Heart
                size={16}
                className={cn(
                  "transition-colors",
                  saved ? "fill-accent-500 text-accent-500" : "text-neutral-700",
                )}
              />
            </motion.span>
          </motion.button>

          {/* Agency logo overlay */}
          {pkg.agency?.logo_url && (
            <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full overflow-hidden bg-white shadow-card">
              <Image
                src={pkg.agency.logo_url}
                alt={pkg.agency.trade_name}
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Location */}
          <div className="flex items-center gap-1 text-neutral-500 text-xs mb-1.5">
            <MapPin size={11} />
            <span>{pkg.destination.city}</span>
          </div>

          {/* Title */}
          <h3 className="font-display font-semibold text-neutral-900 text-sm leading-tight mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <Star size={13} fill="#F59E0B" className="text-accent-500" />
            <span className="text-sm font-semibold text-neutral-800">
              {pkg.rating.toFixed(1)}
            </span>
            <span className="text-xs text-neutral-400">
              ({pkg.review_count})
            </span>
          </div>

          {/* Duration + Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-neutral-500 text-xs">
              <Clock size={11} />
              <span>{pkg.duration_days} Days</span>
            </div>
            <div className="text-right">
              {hasDiscount && (
                <p className="text-xs text-neutral-400 line-through leading-none">
                  {formatPrice(pkg.base_price, pkg.currency)}
                </p>
              )}
              <p className="text-sm font-bold text-accent-500">
                From {formatPrice(pkg.discounted_price ?? pkg.base_price, pkg.currency)}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
