"use client";

import { useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Info, DollarSign, Hotel, Plane, ShieldCheck,
  Map, Image as ImageIcon, Search,
  Plus, Trash2, X, ChevronRight, ChevronLeft,
  CheckCircle, AlertCircle, Loader2, Eye, Save,
  Calendar, Users, Globe, Utensils,
} from "lucide-react";
import { adminApi, type AdminCreatePackagePayload, type HotelEntryPayload, type ItineraryDayPayload } from "@/lib/api";

/* ── Section definitions ─────────────────────────────────── */
const SECTIONS = [
  { id: "general",   label: "General",    icon: Info        },
  { id: "pricing",   label: "Pricing",    icon: DollarSign  },
  { id: "hotels",    label: "Hotels",     icon: Hotel       },
  { id: "transport", label: "Transport",  icon: Plane       },
  { id: "services",  label: "Services",   icon: ShieldCheck },
  { id: "itinerary", label: "Itinerary",  icon: Map         },
  { id: "media",     label: "Media",      icon: ImageIcon   },
  { id: "seo",       label: "SEO",        icon: Search      },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

/* ── Shared field components ─────────────────────────────── */
const inputCls = "w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d7434]/25 focus:border-[#0d7434] bg-white transition-colors";
const labelCls = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";
const textareaCls = inputCls + " resize-none";

function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className={labelCls}>
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function SectionTitle({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-4 first:mt-0">
      <div className="h-px flex-1 bg-slate-100" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
      <div className="h-px flex-1 bg-slate-100" />
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-[#0d7434]" : "bg-slate-200"}`}
        style={{ height: "22px" }}
      >
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[18px]" : ""}`} />
      </div>
      <span className="text-sm text-slate-700 group-hover:text-slate-900">{label}</span>
    </label>
  );
}

function TagInput({ values, onChange, placeholder }: { values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput("");
  };
  return (
    <div className="flex flex-wrap gap-1.5 border border-slate-200 rounded-xl p-2 min-h-[44px] bg-white focus-within:ring-2 focus-within:ring-[#0d7434]/25 focus-within:border-[#0d7434]">
      {values.map(v => (
        <span key={v} className="flex items-center gap-1 bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium">
          {v}
          <button type="button" onClick={() => onChange(values.filter(x => x !== v))} className="text-slate-400 hover:text-red-500">
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
        placeholder={values.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[80px] text-sm outline-none bg-transparent placeholder:text-slate-300"
      />
    </div>
  );
}

/* ── Default form state ──────────────────────────────────── */
const defaultForm = (): AdminCreatePackagePayload => ({
  agency_id: "", title_en: "", title_ar: "", slug: "",
  summary_en: "", summary_ar: "", description_en: "", description_ar: "",
  category: "umrah", package_type: "economy", status: "draft", seasonal_tag: "",
  duration_days: 7, duration_nights: 6, start_date: null, end_date: null,
  flexible_dates: false, makkah_nights: null, madinah_nights: null,
  base_price: 0, currency: "USD", price_per_adult: null, price_per_child: null,
  price_per_infant: null, discount_type: null, discount_value: null, installment_option: false,
  airline_name: "", flight_type: "direct", flight_class: "economy",
  departure_city: "", airport_transfers: false, intercity_transport: "bus",
  includes_flights: false, includes_visa: false, meal_plan: "breakfast_only",
  ziyarat_included: false, laundry_service: false, wheelchair_assistance: false,
  ihram_provided: false, language_spoken: [], guide_languages: [],
  services_included: [], services_excluded: [],
  min_group_size: 1, max_group_size: null, max_persons: null,
  available_slots: null, booking_deadline: null,
  meta_title: "", meta_description: "", meta_keywords: [], og_image_url: "",
  image_urls: [], video_url: "",
  hotels: [], itinerary: [],
});

const defaultHotel = (): HotelEntryPayload => ({
  hotel_name: "", hotel_name_ar: "", city: "makkah", star_rating: 4,
  distance_from_haram_m: null, room_type: "double", board_basis: "breakfast_only",
  check_in_day: null, nights: null, hotel_images: [],
});

const defaultDay = (n: number): ItineraryDayPayload => ({
  day_number: n, title_en: "", title_ar: "", description_en: "", description_ar: "",
  activities: [], location: "",
});

/* ── Page ────────────────────────────────────────────────── */
export default function AddPackagePage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";

  const [section, setSection] = useState<SectionId>("general");
  const [form, setForm] = useState<AdminCreatePackagePayload>(defaultForm());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

  const set = useCallback(<K extends keyof AdminCreatePackagePayload>(key: K, value: AdminCreatePackagePayload[K]) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => { const n = { ...e }; delete n[key as string]; return n; });
  }, []);

  // Auto-generate slug from title
  const handleTitleEn = (v: string) => {
    set("title_en", v);
    if (!form.slug || form.slug === slugify(form.title_en)) {
      set("slug", slugify(v));
    }
  };

  const slugify = (s: string) => s.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();

  // Auto-calculate discounted price
  const finalPrice = (() => {
    if (!form.discount_type || !form.discount_value || !form.base_price) return form.base_price;
    if (form.discount_type === "percent") return Math.max(0, form.base_price * (1 - form.discount_value / 100));
    return Math.max(0, form.base_price - form.discount_value);
  })();

  // Hotels
  const addHotel = () => set("hotels", [...(form.hotels ?? []), defaultHotel()]);
  const removeHotel = (i: number) => set("hotels", (form.hotels ?? []).filter((_, j) => j !== i));
  const setHotel = (i: number, patch: Partial<HotelEntryPayload>) =>
    set("hotels", (form.hotels ?? []).map((h, j) => j === i ? { ...h, ...patch } : h));

  // Itinerary
  const addDay = () => set("itinerary", [...(form.itinerary ?? []), defaultDay((form.itinerary?.length ?? 0) + 1)]);
  const removeDay = (i: number) => set("itinerary", (form.itinerary ?? []).filter((_, j) => j !== i).map((d, j) => ({ ...d, day_number: j + 1 })));
  const setDay = (i: number, patch: Partial<ItineraryDayPayload>) =>
    set("itinerary", (form.itinerary ?? []).map((d, j) => j === i ? { ...d, ...patch } : d));

  // Services included list
  const [newService, setNewService] = useState("");
  const addService = (field: "services_included" | "services_excluded", val: string) => {
    if (val.trim()) set(field, [...(form[field] ?? []), val.trim()]);
  };

  // Validation
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title_en.trim()) e.title_en = "English title is required";
    if (!form.agency_id.trim()) e.agency_id = "Agency ID is required";
    if (!form.category) e.category = "Category is required";
    if (!form.duration_days || form.duration_days < 1) e.duration_days = "Duration must be at least 1 day";
    if (!form.base_price || form.base_price <= 0) e.base_price = "Base price must be greater than 0";
    if ((form.image_urls?.length ?? 0) === 0) e.image_urls = "At least one image is required";
    if ((form.hotels?.length ?? 0) === 0) e.hotels = "At least one hotel is required";
    return e;
  };

  const handleSave = async (asDraft = false) => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSaving(true);
    setSaveStatus("idle");
    try {
      const payload: AdminCreatePackagePayload = {
        ...form,
        status: asDraft ? "draft" : (form.status || "draft"),
      };
      await adminApi.createPackage(payload);
      setSaveStatus("saved");
      setTimeout(() => router.push(`/${locale}/admin/packages`), 1200);
    } catch (err: any) {
      const msg = err?.response?.data?.detail;
      setSaveStatus("error");
      if (typeof msg === "string") setErrors({ _global: msg });
    } finally {
      setSaving(false);
    }
  };

  const currentIdx = SECTIONS.findIndex(s => s.id === section);

  return (
    <div className="max-w-5xl mx-auto">

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#0f1416" }}>Add Package</h1>
          <p className="text-sm text-slate-500 mt-0.5">Fill in all sections to create a fully-configured package</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleSave(true)} disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50">
            <Save size={14} />
            Save Draft
          </button>
          <button onClick={() => handleSave(false)} disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: "#0d7434" }}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
            {saving ? "Saving…" : "Publish Package"}
          </button>
        </div>
      </div>

      {/* Global error / success */}
      <AnimatePresence>
        {saveStatus === "saved" && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
            <CheckCircle size={15} /> Package created successfully. Redirecting…
          </motion.div>
        )}
        {(saveStatus === "error" || errors._global) && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            <AlertCircle size={15} /> {errors._global || "Failed to save. Check required fields."}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-5">

        {/* ── Sidebar nav ── */}
        <nav className="flex-shrink-0 w-44 flex flex-col gap-1">
          {SECTIONS.map(({ id, label, icon: Icon }) => {
            const active = section === id;
            return (
              <button key={id} onClick={() => setSection(id)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-left transition-all"
                style={{
                  backgroundColor: active ? "rgba(13,116,52,0.09)" : "transparent",
                  color: active ? "#0d7434" : "#6b7280",
                  borderLeft: active ? "3px solid #0d7434" : "3px solid transparent",
                }}>
                <Icon size={15} style={{ flexShrink: 0 }} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* ── Form content ── */}
        <div className="flex-1 bg-white rounded-2xl p-6" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.07)", minHeight: "600px" }}>
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.15 }}>

              {/* ── GENERAL ── */}
              {section === "general" && (
                <div className="flex flex-col gap-4">
                  <SectionTitle label="Package Identity" />
                  <Field label="Agency ID" required>
                    <input type="text" value={form.agency_id} onChange={e => set("agency_id", e.target.value)}
                      className={inputCls} placeholder="UUID of the agency" />
                    {errors.agency_id && <p className="mt-1 text-xs text-red-500">{errors.agency_id}</p>}
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Title (English)" required>
                      <input type="text" value={form.title_en} onChange={e => handleTitleEn(e.target.value)}
                        className={inputCls} placeholder="e.g. 7-Day Umrah Economy" />
                      {errors.title_en && <p className="mt-1 text-xs text-red-500">{errors.title_en}</p>}
                    </Field>
                    <Field label="Title (Arabic)">
                      <input type="text" value={form.title_ar ?? ""} onChange={e => set("title_ar", e.target.value)}
                        className={inputCls} dir="rtl" placeholder="مثال: عمرة اقتصادية ٧ أيام" />
                    </Field>
                  </div>

                  <Field label="Slug" hint="Auto-generated from title. Must be unique.">
                    <input type="text" value={form.slug ?? ""} onChange={e => set("slug", e.target.value)}
                      className={inputCls} placeholder="umrah-economy-7-day" />
                  </Field>

                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Category" required>
                      <select value={form.category} onChange={e => set("category", e.target.value)} className={inputCls}>
                        <option value="umrah">Umrah</option>
                        <option value="hajj">Hajj</option>
                        <option value="ziyarah">Ziyarah</option>
                      </select>
                    </Field>
                    <Field label="Package Type">
                      <select value={form.package_type ?? "economy"} onChange={e => set("package_type", e.target.value)} className={inputCls}>
                        <option value="economy">Economy</option>
                        <option value="standard">Standard</option>
                        <option value="vip">VIP</option>
                        <option value="custom">Custom</option>
                      </select>
                    </Field>
                    <Field label="Status">
                      <select value={form.status ?? "draft"} onChange={e => set("status", e.target.value)} className={inputCls}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="pending_approval">Pending Review</option>
                        <option value="archived">Archived</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Seasonal Tag">
                    <select value={form.seasonal_tag ?? ""} onChange={e => set("seasonal_tag", e.target.value)} className={inputCls}>
                      <option value="">None</option>
                      <option value="ramadan">Ramadan</option>
                      <option value="hajj">Hajj Season</option>
                      <option value="off_season">Off-Season</option>
                      <option value="eid">Eid</option>
                    </select>
                  </Field>

                  <SectionTitle label="Descriptions" />

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Short Summary (English)">
                      <textarea rows={2} value={form.summary_en ?? ""} onChange={e => set("summary_en", e.target.value)}
                        className={textareaCls} placeholder="Brief overview for card display…" />
                    </Field>
                    <Field label="Short Summary (Arabic)">
                      <textarea rows={2} value={form.summary_ar ?? ""} onChange={e => set("summary_ar", e.target.value)}
                        className={textareaCls} dir="rtl" placeholder="نبذة مختصرة…" />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Full Description (English)">
                      <textarea rows={5} value={form.description_en ?? ""} onChange={e => set("description_en", e.target.value)}
                        className={textareaCls} placeholder="Detailed package description…" />
                    </Field>
                    <Field label="Full Description (Arabic)">
                      <textarea rows={5} value={form.description_ar ?? ""} onChange={e => set("description_ar", e.target.value)}
                        className={textareaCls} dir="rtl" placeholder="وصف تفصيلي للباقة…" />
                    </Field>
                  </div>

                  <SectionTitle label="Duration & Dates" />

                  <div className="grid grid-cols-4 gap-4">
                    <Field label="Total Days" required>
                      <input type="number" min={1} max={90} value={form.duration_days} onChange={e => set("duration_days", Number(e.target.value))} className={inputCls} />
                      {errors.duration_days && <p className="mt-1 text-xs text-red-500">{errors.duration_days}</p>}
                    </Field>
                    <Field label="Total Nights">
                      <input type="number" min={0} max={89} value={form.duration_nights ?? 0} onChange={e => set("duration_nights", Number(e.target.value))} className={inputCls} />
                    </Field>
                    <Field label="Makkah Nights">
                      <input type="number" min={0} value={form.makkah_nights ?? ""} onChange={e => set("makkah_nights", e.target.value ? Number(e.target.value) : null)} className={inputCls} placeholder="Optional" />
                    </Field>
                    <Field label="Madinah Nights">
                      <input type="number" min={0} value={form.madinah_nights ?? ""} onChange={e => set("madinah_nights", e.target.value ? Number(e.target.value) : null)} className={inputCls} placeholder="Optional" />
                    </Field>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Start Date">
                      <input type="date" value={form.start_date ?? ""} onChange={e => set("start_date", e.target.value || null)} className={inputCls} />
                    </Field>
                    <Field label="End Date">
                      <input type="date" value={form.end_date ?? ""} onChange={e => set("end_date", e.target.value || null)} className={inputCls} />
                    </Field>
                    <Field label="Booking Deadline">
                      <input type="date" value={form.booking_deadline ?? ""} onChange={e => set("booking_deadline", e.target.value || null)} className={inputCls} />
                    </Field>
                  </div>

                  <Toggle checked={form.flexible_dates ?? false} onChange={v => set("flexible_dates", v)} label="Flexible Dates (dates can be adjusted)" />

                  <SectionTitle label="Capacity" />
                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Min Group Size">
                      <input type="number" min={1} value={form.min_group_size ?? 1} onChange={e => set("min_group_size", Number(e.target.value))} className={inputCls} />
                    </Field>
                    <Field label="Max Group Size">
                      <input type="number" min={1} value={form.max_group_size ?? ""} onChange={e => set("max_group_size", e.target.value ? Number(e.target.value) : null)} className={inputCls} placeholder="No limit" />
                    </Field>
                    <Field label="Max Persons">
                      <input type="number" min={1} value={form.max_persons ?? ""} onChange={e => set("max_persons", e.target.value ? Number(e.target.value) : null)} className={inputCls} placeholder="Optional" />
                    </Field>
                  </div>
                  <Field label="Available Slots">
                    <input type="number" min={0} value={form.available_slots ?? ""} onChange={e => set("available_slots", e.target.value ? Number(e.target.value) : null)} className={inputCls} placeholder="Leave blank for unlimited" />
                  </Field>
                </div>
              )}

              {/* ── PRICING ── */}
              {section === "pricing" && (
                <div className="flex flex-col gap-4">
                  <SectionTitle label="Base Pricing" />
                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Base Price" required>
                      <input type="number" min={0} step="0.01" value={form.base_price || ""} onChange={e => set("base_price", Number(e.target.value))} className={inputCls} />
                      {errors.base_price && <p className="mt-1 text-xs text-red-500">{errors.base_price}</p>}
                    </Field>
                    <Field label="Currency">
                      <select value={form.currency ?? "USD"} onChange={e => set("currency", e.target.value)} className={inputCls}>
                        <option value="USD">USD</option>
                        <option value="OMR">OMR</option>
                        <option value="SAR">SAR</option>
                        <option value="GBP">GBP</option>
                        <option value="EUR">EUR</option>
                        <option value="AED">AED</option>
                      </select>
                    </Field>
                    <Field label="Final Price (calculated)">
                      <div className="flex items-center h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold" style={{ color: "#0d7434" }}>
                        {form.currency} {finalPrice.toFixed(2)}
                      </div>
                    </Field>
                  </div>

                  <SectionTitle label="Per Person Pricing" />
                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Per Adult">
                      <input type="number" min={0} step="0.01" value={form.price_per_adult ?? ""} onChange={e => set("price_per_adult", e.target.value ? Number(e.target.value) : null)} className={inputCls} placeholder="Optional" />
                    </Field>
                    <Field label="Per Child">
                      <input type="number" min={0} step="0.01" value={form.price_per_child ?? ""} onChange={e => set("price_per_child", e.target.value ? Number(e.target.value) : null)} className={inputCls} placeholder="Optional" />
                    </Field>
                    <Field label="Per Infant">
                      <input type="number" min={0} step="0.01" value={form.price_per_infant ?? ""} onChange={e => set("price_per_infant", e.target.value ? Number(e.target.value) : null)} className={inputCls} placeholder="Optional" />
                    </Field>
                  </div>

                  <SectionTitle label="Discount" />
                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Discount Type">
                      <select value={form.discount_type ?? ""} onChange={e => set("discount_type", e.target.value || null)} className={inputCls}>
                        <option value="">No Discount</option>
                        <option value="flat">Flat Amount</option>
                        <option value="percent">Percentage (%)</option>
                      </select>
                    </Field>
                    <Field label="Discount Value">
                      <input type="number" min={0} step="0.01" value={form.discount_value ?? ""} onChange={e => set("discount_value", e.target.value ? Number(e.target.value) : null)} className={inputCls} disabled={!form.discount_type} placeholder={form.discount_type === "percent" ? "e.g. 15" : "e.g. 200"} />
                    </Field>
                    <Field label="Savings">
                      <div className="flex items-center h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-emerald-600">
                        {form.base_price && form.discount_value && form.discount_type
                          ? `– ${form.currency} ${(form.base_price - finalPrice).toFixed(2)}`
                          : "—"}
                      </div>
                    </Field>
                  </div>

                  <Toggle checked={form.installment_option ?? false} onChange={v => set("installment_option", v)} label="Allow Installment Payment" />
                </div>
              )}

              {/* ── HOTELS ── */}
              {section === "hotels" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">{(form.hotels?.length ?? 0)} hotel(s) added</p>
                    <button onClick={addHotel} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all" style={{ background: "#0d7434" }}>
                      <Plus size={14} /> Add Hotel
                    </button>
                  </div>
                  {errors.hotels && <p className="text-xs text-red-500">{errors.hotels}</p>}

                  {(form.hotels ?? []).length === 0 && (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl py-12 text-center">
                      <Hotel size={28} className="text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">No hotels added yet</p>
                      <button onClick={addHotel} className="mt-3 text-sm font-semibold hover:underline" style={{ color: "#0d7434" }}>+ Add your first hotel</button>
                    </div>
                  )}

                  {(form.hotels ?? []).map((h, i) => (
                    <div key={i} className="border border-slate-200 rounded-2xl p-5 relative">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hotel {i + 1}</span>
                        <button onClick={() => removeHotel(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <Field label="Hotel Name (English)" required>
                          <input type="text" value={h.hotel_name} onChange={e => setHotel(i, { hotel_name: e.target.value })} className={inputCls} placeholder="e.g. Hilton Makkah Convention" />
                        </Field>
                        <Field label="Hotel Name (Arabic)">
                          <input type="text" value={h.hotel_name_ar ?? ""} onChange={e => setHotel(i, { hotel_name_ar: e.target.value })} className={inputCls} dir="rtl" placeholder="هيلتون مكة" />
                        </Field>
                      </div>
                      <div className="grid grid-cols-4 gap-3 mb-3">
                        <Field label="City">
                          <select value={h.city} onChange={e => setHotel(i, { city: e.target.value })} className={inputCls}>
                            <option value="makkah">Makkah</option>
                            <option value="madinah">Madinah</option>
                            <option value="jeddah">Jeddah</option>
                            <option value="mina">Mina</option>
                            <option value="arafat">Arafat</option>
                          </select>
                        </Field>
                        <Field label="Stars">
                          <select value={h.star_rating} onChange={e => setHotel(i, { star_rating: Number(e.target.value) })} className={inputCls}>
                            {[1,2,3,4,5].map(s => <option key={s} value={s}>{s} ★</option>)}
                          </select>
                        </Field>
                        <Field label="Distance to Haram (m)">
                          <input type="number" min={0} value={h.distance_from_haram_m ?? ""} onChange={e => setHotel(i, { distance_from_haram_m: e.target.value ? Number(e.target.value) : null })} className={inputCls} placeholder="e.g. 200" />
                        </Field>
                        <Field label="Nights Stay">
                          <input type="number" min={1} value={h.nights ?? ""} onChange={e => setHotel(i, { nights: e.target.value ? Number(e.target.value) : null })} className={inputCls} placeholder="e.g. 4" />
                        </Field>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <Field label="Room Type">
                          <select value={h.room_type} onChange={e => setHotel(i, { room_type: e.target.value })} className={inputCls}>
                            <option value="single">Single</option>
                            <option value="double">Double</option>
                            <option value="triple">Triple</option>
                            <option value="quad">Quad</option>
                            <option value="suite">Suite</option>
                          </select>
                        </Field>
                        <Field label="Meal Plan">
                          <select value={h.board_basis} onChange={e => setHotel(i, { board_basis: e.target.value })} className={inputCls}>
                            <option value="">None</option>
                            <option value="breakfast_only">Breakfast Only</option>
                            <option value="half_board">Half Board</option>
                            <option value="full_board">Full Board</option>
                            <option value="all_inclusive">All Inclusive</option>
                          </select>
                        </Field>
                        <Field label="Check-in Day #">
                          <input type="number" min={1} value={h.check_in_day ?? ""} onChange={e => setHotel(i, { check_in_day: e.target.value ? Number(e.target.value) : null })} className={inputCls} placeholder="e.g. 1" />
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── TRANSPORT ── */}
              {section === "transport" && (
                <div className="flex flex-col gap-4">
                  <SectionTitle label="Flights" />
                  <Toggle checked={form.includes_flights ?? false} onChange={v => set("includes_flights", v)} label="Flights Included in Package" />
                  <div className="grid grid-cols-3 gap-4">
                    <Field label="Airline Name">
                      <input type="text" value={form.airline_name ?? ""} onChange={e => set("airline_name", e.target.value)} className={inputCls} placeholder="e.g. Saudia, Emirates" />
                    </Field>
                    <Field label="Flight Type">
                      <select value={form.flight_type ?? "direct"} onChange={e => set("flight_type", e.target.value)} className={inputCls}>
                        <option value="direct">Direct</option>
                        <option value="transit">With Transit</option>
                      </select>
                    </Field>
                    <Field label="Flight Class">
                      <select value={form.flight_class ?? "economy"} onChange={e => set("flight_class", e.target.value)} className={inputCls}>
                        <option value="economy">Economy</option>
                        <option value="business">Business</option>
                        <option value="first">First Class</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Departure City">
                    <input type="text" value={form.departure_city ?? ""} onChange={e => set("departure_city", e.target.value)} className={inputCls} placeholder="e.g. Riyadh, Dubai, London" />
                  </Field>

                  <SectionTitle label="Ground Transport" />
                  <Toggle checked={form.airport_transfers ?? false} onChange={v => set("airport_transfers", v)} label="Airport Transfers Included" />
                  <Field label="Intercity Transport">
                    <select value={form.intercity_transport ?? ""} onChange={e => set("intercity_transport", e.target.value)} className={inputCls}>
                      <option value="">Not Included</option>
                      <option value="bus">Coach / Bus</option>
                      <option value="train">Haramain Train</option>
                      <option value="private">Private Vehicle</option>
                    </select>
                  </Field>
                </div>
              )}

              {/* ── SERVICES ── */}
              {section === "services" && (
                <div className="flex flex-col gap-4">
                  <SectionTitle label="Included Services" />
                  <div className="grid grid-cols-2 gap-3">
                    <Toggle checked={form.includes_visa ?? false} onChange={v => set("includes_visa", v)} label="Visa Processing Included" />
                    <Toggle checked={form.ziyarat_included ?? false} onChange={v => set("ziyarat_included", v)} label="Ziyarat Tours Included" />
                    <Toggle checked={form.ihram_provided ?? false} onChange={v => set("ihram_provided", v)} label="Ihram Provided" />
                    <Toggle checked={form.laundry_service ?? false} onChange={v => set("laundry_service", v)} label="Laundry Service Included" />
                    <Toggle checked={form.wheelchair_assistance ?? false} onChange={v => set("wheelchair_assistance", v)} label="Wheelchair Assistance Available" />
                  </div>

                  <SectionTitle label="Meals" />
                  <Field label="Default Meal Plan">
                    <select value={form.meal_plan ?? ""} onChange={e => set("meal_plan", e.target.value)} className={inputCls}>
                      <option value="">Not Included</option>
                      <option value="breakfast_only">Breakfast Only</option>
                      <option value="half_board">Half Board</option>
                      <option value="full_board">Full Board</option>
                      <option value="all_inclusive">All Inclusive</option>
                    </select>
                  </Field>

                  <SectionTitle label="Languages" />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Package Languages" hint="Press Enter to add">
                      <TagInput values={form.language_spoken ?? []} onChange={v => set("language_spoken", v)} placeholder="en, ar, ur…" />
                    </Field>
                    <Field label="Guide Languages" hint="Press Enter to add">
                      <TagInput values={form.guide_languages ?? []} onChange={v => set("guide_languages", v)} placeholder="English, Arabic…" />
                    </Field>
                  </div>

                  <SectionTitle label="Includes List" />
                  <Field label="What's Included" hint="Press Enter to add each item">
                    <TagInput values={form.services_included ?? []} onChange={v => set("services_included", v)} placeholder="e.g. Return airfare, Hotel accommodation…" />
                  </Field>

                  <SectionTitle label="Excludes List" />
                  <Field label="What's NOT Included" hint="Press Enter to add each item">
                    <TagInput values={form.services_excluded ?? []} onChange={v => set("services_excluded", v)} placeholder="e.g. Personal expenses, Laundry…" />
                  </Field>
                </div>
              )}

              {/* ── ITINERARY ── */}
              {section === "itinerary" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">{form.itinerary?.length ?? 0} day(s) planned</p>
                    <button onClick={addDay} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all" style={{ background: "#0d7434" }}>
                      <Plus size={14} /> Add Day
                    </button>
                  </div>

                  {(form.itinerary ?? []).length === 0 && (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl py-12 text-center">
                      <Map size={28} className="text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">No itinerary days added yet</p>
                      <button onClick={addDay} className="mt-3 text-sm font-semibold hover:underline" style={{ color: "#0d7434" }}>+ Add Day 1</button>
                    </div>
                  )}

                  {(form.itinerary ?? []).map((day, i) => (
                    <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
                      <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200">
                        <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: "#0d7434" }}>
                          {day.day_number}
                        </span>
                        <input type="text" value={day.title_en} onChange={e => setDay(i, { title_en: e.target.value })}
                          className="flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                          placeholder="Day title (English)" />
                        <button onClick={() => removeDay(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="p-5 flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Title (Arabic)">
                            <input type="text" value={day.title_ar ?? ""} onChange={e => setDay(i, { title_ar: e.target.value })} className={inputCls} dir="rtl" placeholder="عنوان اليوم" />
                          </Field>
                          <Field label="Location">
                            <input type="text" value={day.location ?? ""} onChange={e => setDay(i, { location: e.target.value })} className={inputCls} placeholder="e.g. Masjid al-Haram" />
                          </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Description (English)">
                            <textarea rows={3} value={day.description_en ?? ""} onChange={e => setDay(i, { description_en: e.target.value })} className={textareaCls} placeholder="What happens this day…" />
                          </Field>
                          <Field label="Description (Arabic)">
                            <textarea rows={3} value={day.description_ar ?? ""} onChange={e => setDay(i, { description_ar: e.target.value })} className={textareaCls} dir="rtl" placeholder="وصف اليوم…" />
                          </Field>
                        </div>
                        <Field label="Activities" hint="Press Enter to add">
                          <TagInput values={day.activities ?? []} onChange={v => setDay(i, { activities: v })} placeholder="Tawaf, Ziyarah, Guided tour…" />
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── MEDIA ── */}
              {section === "media" && (
                <div className="flex flex-col gap-4">
                  <SectionTitle label="Package Images" />
                  {errors.image_urls && <p className="text-xs text-red-500">{errors.image_urls}</p>}
                  <div className="flex flex-col gap-2">
                    {(form.image_urls ?? []).map((url, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input type="url" value={url} onChange={e => set("image_urls", (form.image_urls ?? []).map((u, j) => j === i ? e.target.value : u))}
                          className={inputCls} placeholder="https://…/image.jpg" />
                        {url && (
                          <div className="relative w-12 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                            <img src={url} alt="" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = "none")} />
                          </div>
                        )}
                        <button onClick={() => set("image_urls", (form.image_urls ?? []).filter((_, j) => j !== i))}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => set("image_urls", [...(form.image_urls ?? []), ""])}
                      className="self-start flex items-center gap-1.5 text-sm font-semibold hover:underline" style={{ color: "#0d7434" }}>
                      <Plus size={13} /> Add Image URL
                    </button>
                  </div>

                  {/* Image grid preview */}
                  {(form.image_urls ?? []).filter(u => u.trim()).length > 0 && (
                    <div className="mt-2">
                      <p className={labelCls}>Preview</p>
                      <div className="grid grid-cols-4 gap-2">
                        {(form.image_urls ?? []).filter(u => u.trim()).map((url, i) => (
                          <div key={i} className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200" style={{ paddingBottom: "66.67%" }}>
                            <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" onError={e => { (e.currentTarget.parentElement!.style.background = "#f1f5f9"); e.currentTarget.style.display = "none"; }} />
                            {i === 0 && <span className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/50 text-white">Cover</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <SectionTitle label="Video" />
                  <Field label="Video URL (YouTube / Vimeo embed or direct)" hint="Optional — used as background banner on detail page">
                    <input type="url" value={form.video_url ?? ""} onChange={e => set("video_url", e.target.value)} className={inputCls} placeholder="https://youtube.com/embed/…" />
                  </Field>
                </div>
              )}

              {/* ── SEO ── */}
              {section === "seo" && (
                <div className="flex flex-col gap-4">
                  <SectionTitle label="Search Engine Optimization" />
                  <Field label="Meta Title" hint="Recommended: 50–60 characters">
                    <input type="text" value={form.meta_title ?? ""} onChange={e => set("meta_title", e.target.value)} className={inputCls} placeholder={form.title_en || "Package meta title"} maxLength={120} />
                    <p className="mt-1 text-xs text-slate-400 text-right">{(form.meta_title ?? "").length}/120</p>
                  </Field>
                  <Field label="Meta Description" hint="Recommended: 150–160 characters">
                    <textarea rows={3} value={form.meta_description ?? ""} onChange={e => set("meta_description", e.target.value)} className={textareaCls} placeholder={form.summary_en || "Package meta description"} maxLength={300} />
                    <p className="mt-1 text-xs text-slate-400 text-right">{(form.meta_description ?? "").length}/300</p>
                  </Field>
                  <Field label="Keywords" hint="Press Enter to add">
                    <TagInput values={form.meta_keywords ?? []} onChange={v => set("meta_keywords", v)} placeholder="umrah, hajj, makkah package…" />
                  </Field>
                  <Field label="Open Graph Image URL">
                    <input type="url" value={form.og_image_url ?? ""} onChange={e => set("og_image_url", e.target.value)} className={inputCls} placeholder="https://…/og-image.jpg" />
                  </Field>
                  {form.og_image_url && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 max-w-xs">
                      <img src={form.og_image_url} alt="OG preview" className="w-full object-cover" style={{ maxHeight: "160px" }} onError={e => (e.currentTarget.style.display = "none")} />
                    </div>
                  )}

                  {/* SERP preview */}
                  <SectionTitle label="SERP Preview" />
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                    <p className="text-blue-600 text-base font-medium leading-tight">{form.meta_title || form.title_en || "Package Title"}</p>
                    <p className="text-green-700 text-xs mt-0.5">umrah.platform.com › packages › {form.slug || "package-slug"}</p>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed line-clamp-2">{form.meta_description || form.summary_en || "Package description will appear here…"}</p>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Section navigation */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
            <button
              onClick={() => setSection(SECTIONS[Math.max(0, currentIdx - 1)]!.id)}
              disabled={currentIdx === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span className="text-xs text-slate-400">{currentIdx + 1} / {SECTIONS.length}</span>
            <button
              onClick={() => setSection(SECTIONS[Math.min(SECTIONS.length - 1, currentIdx + 1)]!.id)}
              disabled={currentIdx === SECTIONS.length - 1}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-30"
              style={{ background: "#0d7434" }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
