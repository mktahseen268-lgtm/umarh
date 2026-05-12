"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, Search, Edit2, Eye, Trash2,
  Clock, ToggleLeft, ToggleRight, X,
} from "lucide-react";

type Package = {
  id: number;
  title_en: string;
  title_ar: string;
  category: string;
  duration_days: number;
  duration_nights: number;
  base_price: number;
  currency: string;
  status: string;
  bookings: number;
  agency_name: string;
};

const INITIAL_PACKAGES: Package[] = [
  { id: 1, title_en: "Umrah Economy 7-Day",    title_ar: "عمرة اقتصادية ٧ أيام",   category: "umrah",   duration_days: 7,  duration_nights: 6,  base_price: 1200, currency: "USD", status: "published", bookings: 142, agency_name: "Al-Noor Travel" },
  { id: 2, title_en: "Umrah Premium 10-Day",   title_ar: "عمرة بريميوم ١٠ أيام",   category: "umrah",   duration_days: 10, duration_nights: 9,  base_price: 2800, currency: "USD", status: "published", bookings: 87,  agency_name: "Al-Noor Travel" },
  { id: 3, title_en: "VIP Hajj Package",       title_ar: "باقة حج VIP",             category: "hajj",    duration_days: 21, duration_nights: 20, base_price: 7500, currency: "USD", status: "published", bookings: 34,  agency_name: "Al-Noor Travel" },
  { id: 4, title_en: "Madinah Ziyarah 5-Day",  title_ar: "زيارة المدينة ٥ أيام",    category: "ziyarah", duration_days: 5,  duration_nights: 4,  base_price: 450,  currency: "USD", status: "published", bookings: 210, agency_name: "Al-Noor Travel" },
  { id: 5, title_en: "Budget Umrah 5-Day",     title_ar: "عمرة اقتصادية ٥ أيام",   category: "umrah",   duration_days: 5,  duration_nights: 4,  base_price: 890,  currency: "USD", status: "published", bookings: 63,  agency_name: "Al-Noor Travel" },
  { id: 6, title_en: "Family Umrah 14-Day",    title_ar: "عمرة عائلية ١٤ يوماً",   category: "umrah",   duration_days: 14, duration_nights: 13, base_price: 4200, currency: "USD", status: "draft",     bookings: 28,  agency_name: "Al-Noor Travel" },
  { id: 7, title_en: "Hajj Economy Package",   title_ar: "باقة حج اقتصادية",        category: "hajj",    duration_days: 18, duration_nights: 17, base_price: 4800, currency: "USD", status: "draft",     bookings: 19,  agency_name: "Al-Noor Travel" },
  { id: 8, title_en: "Luxury Ziyarah Tour",    title_ar: "جولة الزيارة الفاخرة",   category: "ziyarah", duration_days: 7,  duration_nights: 6,  base_price: 1900, currency: "USD", status: "pending_approval", bookings: 0, agency_name: "Al-Noor Travel" },
];

const STATUS_STYLE: Record<string, string> = {
  published:        "bg-emerald-100 text-emerald-700",
  draft:            "bg-amber-100 text-amber-700",
  pending_approval: "bg-blue-100 text-blue-700",
  rejected:         "bg-red-100 text-red-700",
  archived:         "bg-slate-100 text-slate-500",
};

const TYPE_COLOR: Record<string, string> = {
  umrah:   "bg-blue-100 text-blue-700",
  hajj:    "bg-purple-100 text-purple-700",
  ziyarah: "bg-amber-100 text-amber-700",
};

/* ── Section divider ──────────────────────────────────────── */
function SectionTitle({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mt-2 mb-1">
      <div className="h-px flex-1 bg-slate-100" />
      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
      <div className="h-px flex-1 bg-slate-100" />
    </div>
  );
}

/* ── Package Modal ────────────────────────────────────────── */
function PackageModal({
  pkg,
  onClose,
  onSave,
}: {
  pkg?: Package | null;
  onClose: () => void;
  onSave: (data: Omit<Package, "id" | "bookings" | "agency_name">) => void;
}) {
  const isEdit = !!pkg;

  const [form, setForm] = useState({
    title_en:        pkg?.title_en        ?? "",
    title_ar:        pkg?.title_ar        ?? "",
    summary_en:      "",
    summary_ar:      "",
    description_en:  "",
    description_ar:  "",
    category:        pkg?.category        ?? "umrah",
    duration_days:   pkg?.duration_days   ?? 7,
    duration_nights: pkg?.duration_nights ?? 6,
    base_price:      pkg?.base_price      ?? 0,
    currency:        pkg?.currency        ?? "USD",
    includes_visa:    false,
    includes_flights: false,
    meal_plan:       "",
    departure_city:  "",
    min_group_size:  1,
    max_group_size:  "" as string | number,
    status:          pkg?.status          ?? "draft",
  });
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [error, setError] = useState("");

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm(f => ({ ...f, [field]: e.target.value }));

  const setCheck = (field: "includes_visa" | "includes_flights") => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setForm(f => ({ ...f, [field]: e.target.checked }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title_en.trim()) { setError("English title is required."); return; }
    if (Number(form.base_price) <= 0) { setError("Price must be greater than 0."); return; }
    setError("");
    onSave({
      title_en:        form.title_en.trim(),
      title_ar:        form.title_ar.trim(),
      category:        form.category,
      duration_days:   Number(form.duration_days),
      duration_nights: Number(form.duration_nights),
      base_price:      Number(form.base_price),
      currency:        form.currency,
      status:          form.status,
    });
  };

  const inputCls = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d7434]/25 focus:border-[#0d7434]";
  const textareaCls = inputCls + " resize-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full flex flex-col"
        style={{ maxWidth: "600px", maxHeight: "90vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <h2 className="font-bold text-slate-900">{isEdit ? "Edit Package" : "Add Package"}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-3">

            <SectionTitle label="Basic Info" />

            {/* Titles */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Title (English) *</label>
                <input type="text" value={form.title_en} onChange={set("title_en")} className={inputCls} placeholder="e.g. 7-Day Umrah" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Title (Arabic)</label>
                <input type="text" value={form.title_ar} onChange={set("title_ar")} className={inputCls} dir="rtl" placeholder="مثال: عمرة ٧ أيام" />
              </div>
            </div>

            {/* Category + Duration + Status */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                <select value={form.category} onChange={set("category")} className={inputCls}>
                  <option value="umrah">Umrah</option>
                  <option value="hajj">Hajj</option>
                  <option value="ziyarah">Ziyarah</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Duration (Days)</label>
                <input type="number" min={1} max={90} value={form.duration_days} onChange={set("duration_days")} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Duration (Nights)</label>
                <input type="number" min={0} max={89} value={form.duration_nights} onChange={set("duration_nights")} className={inputCls} />
              </div>
            </div>

            {/* Price + Currency + Status */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Base Price *</label>
                <input type="number" min={0} step="0.01" value={form.base_price} onChange={set("base_price")} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Currency</label>
                <select value={form.currency} onChange={set("currency")} className={inputCls}>
                  <option value="USD">USD</option>
                  <option value="SAR">SAR</option>
                  <option value="GBP">GBP</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                <select value={form.status} onChange={set("status")} className={inputCls}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="pending_approval">Pending Review</option>
                </select>
              </div>
            </div>

            <SectionTitle label="Details" />

            {/* Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Summary (English)</label>
                <textarea rows={2} value={form.summary_en} onChange={set("summary_en")} className={textareaCls} placeholder="Brief overview..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Summary (Arabic)</label>
                <textarea rows={2} value={form.summary_ar} onChange={set("summary_ar")} className={textareaCls} dir="rtl" placeholder="نبذة مختصرة..." />
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description (English)</label>
                <textarea rows={3} value={form.description_en} onChange={set("description_en")} className={textareaCls} placeholder="Full description..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description (Arabic)</label>
                <textarea rows={3} value={form.description_ar} onChange={set("description_ar")} className={textareaCls} dir="rtl" placeholder="الوصف الكامل..." />
              </div>
            </div>

            {/* Meal plan + Departure */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Meal Plan</label>
                <select value={form.meal_plan} onChange={set("meal_plan")} className={inputCls}>
                  <option value="">No Meals</option>
                  <option value="breakfast_only">Breakfast Only</option>
                  <option value="half_board">Half Board</option>
                  <option value="full_board">Full Board</option>
                  <option value="all_inclusive">All Inclusive</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Departure City</label>
                <input type="text" value={form.departure_city} onChange={set("departure_city")} className={inputCls} placeholder="e.g. Riyadh" />
              </div>
            </div>

            {/* Group size */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Min Group Size</label>
                <input type="number" min={1} value={form.min_group_size} onChange={set("min_group_size")} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Max Group Size</label>
                <input type="number" min={1} value={form.max_group_size} onChange={set("max_group_size")} className={inputCls} placeholder="Optional" />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input type="checkbox" checked={form.includes_visa} onChange={setCheck("includes_visa")}
                  className="w-4 h-4 rounded border-slate-300 accent-[#0d7434]" />
                Includes Visa
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input type="checkbox" checked={form.includes_flights} onChange={setCheck("includes_flights")}
                  className="w-4 h-4 rounded border-slate-300 accent-[#0d7434]" />
                Includes Flights
              </label>
            </div>

            <SectionTitle label="Media" />

            {/* Image URLs */}
            <div className="flex flex-col gap-2">
              {imageUrls.map((url, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={e => setImageUrls(prev => prev.map((u, j) => j === i ? e.target.value : u))}
                    className={inputCls}
                    placeholder="https://example.com/image.jpg"
                  />
                  {imageUrls.length > 1 && (
                    <button type="button" onClick={() => setImageUrls(prev => prev.filter((_, j) => j !== i))}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0">
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setImageUrls(prev => [...prev, ""])}
                className="self-start text-xs font-semibold hover:opacity-80 transition-colors flex items-center gap-1"
                style={{ color: "#0d7434" }}>
                <Plus size={12} /> Add Image
              </button>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 flex-shrink-0 flex flex-col gap-3">
            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>
            )}
            <div className="flex gap-3">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button type="submit"
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors hover:opacity-90"
                style={{ background: "#0d7434" }}>
                {isEdit ? "Save Changes" : "Create Package"}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function AgencyPackagesPage() {
  const [packages, setPackages] = useState<Package[]>(INITIAL_PACKAGES);
  const [search, setSearch]     = useState("");
  const [typeFilter, setTypeFilter]     = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal] = useState<{ open: boolean; pkg: Package | null }>({ open: false, pkg: null });

  const filtered = packages.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.title_en.toLowerCase().includes(q) || p.title_ar.includes(q);
    const matchType   = typeFilter   === "all" || p.category === typeFilter;
    const matchStatus = statusFilter === "all" || p.status   === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const openNew  = () => setModal({ open: true, pkg: null });
  const openEdit = (pkg: Package) => setModal({ open: true, pkg });
  const closeModal = () => setModal({ open: false, pkg: null });

  const handleSave = (data: Omit<Package, "id" | "bookings" | "agency_name">) => {
    if (modal.pkg) {
      setPackages(prev => prev.map(p => p.id === modal.pkg!.id ? { ...p, ...data } : p));
    } else {
      const newId = Math.max(...packages.map(p => p.id)) + 1;
      setPackages(prev => [{ id: newId, bookings: 0, agency_name: "Al-Noor Travel", ...data }, ...prev]);
    }
    closeModal();
  };

  const toggleStatus = (pkg: Package) => {
    const next = pkg.status === "published" ? "archived" : "published";
    setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, status: next } : p));
  };

  const handleDelete = (id: number) => setPackages(prev => prev.filter(p => p.id !== id));

  return (
    <div>
      {modal.open && (
        <PackageModal pkg={modal.pkg} onClose={closeModal} onSave={handleSave} />
      )}

      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#0f1416" }}>Packages</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your Umrah & Hajj packages</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-all"
          style={{ background: "#0d7434" }}
        >
          <Plus size={15} /> Add Package
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Packages", value: packages.length },
          { label: "Published",      value: packages.filter(p => p.status === "published").length },
          { label: "Drafts",         value: packages.filter(p => p.status === "draft").length },
          { label: "Total Bookings", value: packages.reduce((s, p) => s + p.bookings, 0) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-slate-100"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <p className="text-2xl font-bold" style={{ color: "#0f1416" }}>{value.toLocaleString()}</p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-100 mb-4 p-4 flex flex-col sm:flex-row gap-3"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search packages..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0d7434]/25 focus:border-[#0d7434]"
          />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0d7434]/25 focus:border-[#0d7434]">
          <option value="all">All Types</option>
          <option value="umrah">Umrah</option>
          <option value="hajj">Hajj</option>
          <option value="ziyarah">Ziyarah</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0d7434]/25 focus:border-[#0d7434]">
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="pending_approval">Pending</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Package cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm">No packages found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              {/* Card banner */}
              <div className="h-32 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #0a2e18 0%, #163d24 100%)" }}>
                <div className="flex flex-col items-center gap-1">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${TYPE_COLOR[p.category] ?? "bg-slate-100 text-slate-600"}`}>
                    {p.category}
                  </span>
                  <p className="text-white font-bold text-sm text-center px-4 leading-tight mt-1">
                    {p.title_en}
                  </p>
                  <p className="text-white/50 text-[11px]">{p.title_ar}</p>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={11} /> {p.duration_days}d / {p.duration_nights}n</span>
                    <span>{p.currency} {p.base_price.toLocaleString()}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[p.status] ?? "bg-slate-100 text-slate-600"}`}>
                    {p.status === "pending_approval" ? "pending" : p.status}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1 text-xs font-medium border border-slate-200 text-slate-600 rounded-xl py-2 hover:bg-slate-50 transition-colors">
                    <Eye size={12} /> View
                  </button>
                  <button onClick={() => openEdit(p)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-medium rounded-xl py-2 hover:opacity-90 transition-colors"
                    style={{ border: "1px solid #bbf7d0", color: "#0d7434" }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f0fdf4")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                    <Edit2 size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)}
                    className="px-3 flex items-center justify-center text-xs font-medium border border-red-100 text-red-500 rounded-xl py-2 hover:bg-red-50 transition-colors">
                    <Trash2 size={12} />
                  </button>
                  <button onClick={() => toggleStatus(p)}
                    className="px-3 flex items-center justify-center text-xs font-medium border border-slate-200 text-slate-400 rounded-xl py-2 hover:bg-slate-50 transition-colors">
                    {p.status === "published"
                      ? <ToggleRight size={14} style={{ color: "#0d7434" }} />
                      : <ToggleLeft size={14} />
                    }
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
