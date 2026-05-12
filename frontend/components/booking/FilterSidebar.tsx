"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/lib/i18n/routing";
import { Calendar, ChevronDown, ChevronUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterState {
  tourTypes: string[];
  agency: string;
  priceRange: string;
  duration: string;
  languages: string[];
  ratings: number[];
  special: string;
}

const TOUR_TYPES = ["religion", "adventure", "cultural", "food", "city", "cruises"] as const;
const PRICE_RANGES = [
  { label: "$200 – $500",  value: "200-500"  },
  { label: "$500 – $700",  value: "500-700"  },
  { label: "$700 – $900",  value: "700-900"  },
  { label: "Under $1000",  value: "0-1000"   },
  { label: "All",          value: "all"      },
] as const;
const DURATIONS = [
  { label: "2 Hours – 5 Hours",   value: "2-5"   },
  { label: "5 Hours – 10 Hours",  value: "5-10"  },
  { label: "10 Hours – 15 Hours", value: "10-15" },
  { label: "15 Hours +",          value: "15+"   },
  { label: "All",                 value: "all"   },
] as const;
const LANGUAGES = ["Arabic", "English", "Urdu", "Hindi", "African", "Chinese"] as const;
const AGENCIES = ["Travel Agency 1","Travel Agency 2","Travel Agency 3","Travel Agency 4","Travel Agency 5","Travel Agency 6"] as const;
const SPECIALS = ["Discounts","Limited Edition","50% Off"] as const;

interface SectionProps { title: string; defaultOpen?: boolean; children: React.ReactNode }

function FilterSection({ title, defaultOpen = true, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-neutral-100 pb-4 mb-4 last:border-0 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 group"
      >
        <span className="text-sm font-semibold text-neutral-800 group-hover:text-primary-700 transition-colors">
          {title}
        </span>
        {open ? <ChevronUp size={15} className="text-neutral-400" /> : <ChevronDown size={15} className="text-neutral-400" />}
      </button>
      {open && <div className="space-y-2">{children}</div>}
    </div>
  );
}

interface FilterSidebarProps {
  value: FilterState;
  onChange: (next: FilterState) => void;
  dateRange?: string;
  onDateChange?: (d: string) => void;
}

export default function FilterSidebar({ value, onChange, dateRange, onDateChange }: FilterSidebarProps) {
  const t = useTranslations("packages");
  const [showAllAgencies, setShowAllAgencies] = useState(false);

  const toggle = (field: "tourTypes" | "languages" | "ratings", v: string | number) => {
    const arr = value[field] as (string | number)[];
    const next = arr.includes(v as never) ? arr.filter((x) => x !== v) : [...arr, v];
    onChange({ ...value, [field]: next });
  };

  const visibleAgencies = showAllAgencies ? AGENCIES : AGENCIES.slice(0, 4);

  return (
    <aside className="bg-white rounded-2xl shadow-card p-5 sticky top-24">
      {/* Date */}
      <div className="mb-5 p-3 bg-accent-500 rounded-xl cursor-pointer">
        <p className="text-xs font-semibold text-primary-900 mb-1">{t("filters.whenTraveling")}</p>
        <div className="flex items-center gap-2 text-sm font-medium text-primary-900">
          <Calendar size={14} />
          <span>{dateRange ?? "February 05 – March 14"}</span>
        </div>
      </div>

      {/* Tour Type */}
      <FilterSection title={t("filters.tourType")}>
        {TOUR_TYPES.map((type) => (
          <label key={type} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={value.tourTypes.includes(type)}
              onChange={() => toggle("tourTypes", type)}
              className="w-4 h-4 rounded border-neutral-300 text-primary-700 focus:ring-primary-700 accent-primary-700"
            />
            <span className={cn(
              "text-sm transition-colors",
              value.tourTypes.includes(type) ? "text-primary-700 font-medium" : "text-neutral-600 group-hover:text-neutral-900"
            )}>
              {t(`tourTypes.${type}`)}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Travel Agency */}
      <FilterSection title={t("filters.travelAgency")}>
        {visibleAgencies.map((agency) => (
          <label key={agency} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="agency"
              value={agency}
              checked={value.agency === agency}
              onChange={() => onChange({ ...value, agency })}
              className="w-4 h-4 text-primary-700 accent-primary-700"
            />
            <span className={cn(
              "text-sm transition-colors",
              value.agency === agency ? "text-primary-700 font-medium" : "text-neutral-600 group-hover:text-neutral-900"
            )}>
              {agency}
            </span>
          </label>
        ))}
        <button
          onClick={() => setShowAllAgencies(!showAllAgencies)}
          className="text-accent-500 text-xs font-semibold hover:text-accent-600 transition-colors mt-1"
        >
          {showAllAgencies ? t("filters.seeLess") : t("filters.seeMore")}
        </button>
      </FilterSection>

      {/* Price */}
      <FilterSection title={t("filters.filterPrice")}>
        {PRICE_RANGES.map(({ label, value: v }) => (
          <label key={v} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="priceRange"
              value={v}
              checked={value.priceRange === v}
              onChange={() => onChange({ ...value, priceRange: v })}
              className="w-4 h-4 text-primary-700 accent-primary-700"
            />
            <span className={cn(
              "text-sm transition-colors",
              value.priceRange === v ? "text-primary-700 font-medium" : "text-neutral-600 group-hover:text-neutral-900"
            )}>
              {label}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Duration */}
      <FilterSection title={t("filters.duration")}>
        {DURATIONS.map(({ label, value: v }) => (
          <label key={v} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="duration"
              value={v}
              checked={value.duration === v}
              onChange={() => onChange({ ...value, duration: v })}
              className="w-4 h-4 text-primary-700 accent-primary-700"
            />
            <span className={cn(
              "text-sm transition-colors",
              value.duration === v ? "text-primary-700 font-medium" : "text-neutral-600 group-hover:text-neutral-900"
            )}>
              {label}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Language */}
      <FilterSection title={t("filters.language")}>
        {LANGUAGES.map((lang) => (
          <label key={lang} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={value.languages.includes(lang)}
              onChange={() => toggle("languages", lang)}
              className="w-4 h-4 rounded border-neutral-300 text-primary-700 accent-primary-700"
            />
            <span className={cn(
              "text-sm transition-colors",
              value.languages.includes(lang) ? "text-primary-700 font-medium" : "text-neutral-600 group-hover:text-neutral-900"
            )}>
              {lang}
            </span>
          </label>
        ))}
      </FilterSection>

      {/* Rating */}
      <FilterSection title={t("filters.rating")}>
        {[5, 4, 3, 2, 1].map((r) => (
          <label key={r} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={value.ratings.includes(r)}
              onChange={() => toggle("ratings", r)}
              className="w-4 h-4 rounded border-neutral-300 text-primary-700 accent-primary-700"
            />
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} fill={i < r ? "#F59E0B" : "#CBD5E1"} className={i < r ? "text-accent-500" : "text-neutral-300"} />
              ))}
            </div>
          </label>
        ))}
      </FilterSection>

      {/* Specials */}
      <FilterSection title={t("filters.specials")} defaultOpen={false}>
        {SPECIALS.map((s) => (
          <label key={s} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="special"
              value={s}
              checked={value.special === s}
              onChange={() => onChange({ ...value, special: s })}
              className="w-4 h-4 text-primary-700 accent-primary-700"
            />
            <span className={cn(
              "text-sm transition-colors",
              value.special === s ? "text-primary-700 font-medium" : "text-neutral-600 group-hover:text-neutral-900"
            )}>
              {s}
            </span>
          </label>
        ))}
      </FilterSection>
    </aside>
  );
}
