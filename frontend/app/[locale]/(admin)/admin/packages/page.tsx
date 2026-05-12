"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search, Plus, Eye, Edit, Trash2,
  Clock, ToggleLeft, ToggleRight,
} from "lucide-react";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/motion/variants";
import { adminApi, type AdminPackage } from "@/lib/api";

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

/* ── Section header ─────────────────────────────────────────── */
function SectionTitle({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mt-2 mb-1">
      <div className="h-px flex-1 bg-slate-100" />
      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
      <div className="h-px flex-1 bg-slate-100" />
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function AdminPackagesPage() {
  const t      = useTranslations("admin.packages");
  const params = useParams<{ locale: string }>();
  const locale = params.locale ?? "en";

  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [pages, setPages]       = useState(1);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [typeFilter, setTypeFilter]     = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.packages({
        page,
        per_page: 18,
        status:   statusFilter !== "all" ? statusFilter : undefined,
        category: typeFilter   !== "all" ? typeFilter   : undefined,
        q:        search || undefined,
      });
      setPackages(res.data.items);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch { /* keep state */ } finally {
      setLoading(false);
    }
  }, [page, statusFilter, typeFilter, search]);

  useEffect(() => { load(); }, [load]);

  const toggleStatus = async (pkg: AdminPackage) => {
    const next = pkg.status === "published" ? "archived" : "published";
    try {
      await adminApi.updatePackageStatus(pkg.id, next);
      setPackages((prev) => prev.map((p) => p.id === pkg.id ? { ...p, status: next } : p));
    } catch { /* ignore */ }
  };

  const STATS = [
    { label: t("totalPackages"), value: total.toLocaleString(),  sub: "" },
    { label: t("active"),        value: packages.filter(p => p.status === "published").length.toString(), sub: "" },
    { label: t("avgRating"),     value: "4.7★", sub: "" },
    { label: t("totalBookings"), value: "—",    sub: "" },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
          <p className="text-sm text-slate-500 mt-1">{t("subtitle")}</p>
        </div>
        <Link
          href={`/${locale}/admin/packages/add`}
          className="flex items-center gap-2 bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-emerald-600 transition-colors"
        >
          <Plus size={15} /> {t("addPackage")}
        </Link>
      </div>

      {/* Stats */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible"
        className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {STATS.map(({ label, value }) => (
          <motion.div key={label} variants={staggerItem}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs font-medium text-slate-700 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Toolbar */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-4 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder={t("search")}
            className="w-full ps-9 pe-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
          />
        </div>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400">
          <option value="all">{t("allTypes")}</option>
          <option value="umrah">Umrah</option>
          <option value="hajj">Hajj</option>
          <option value="ziyarah">Ziyarah</option>
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400">
          <option value="all">{t("allStatus")}</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="pending_approval">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="archived">Archived</option>
        </select>
      </motion.div>

      {/* Package cards */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading…</div>
      ) : packages.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm">No packages found.</div>
      ) : (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible"
          className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {packages.map((p) => (
            <motion.div key={p.id} variants={staggerItem}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Placeholder banner */}
              <div className="h-32 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #0a2e18 0%, #163d24 100%)" }}>
                <div className="flex flex-col items-center gap-1">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${TYPE_COLOR[p.category] ?? "bg-slate-100 text-slate-600"}`}>
                    {p.category}
                  </span>
                  <p className="text-white font-bold text-sm text-center px-4 leading-tight mt-1">
                    {p.title?.en ?? p.title?.ar ?? "—"}
                  </p>
                  <p className="text-white/50 text-[11px]">{p.agency_name}</p>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock size={11} /> {p.duration_days}d</span>
                    <span className="flex items-center gap-1">
                      {p.currency} {p.base_price.toLocaleString()}
                    </span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[p.status] ?? "bg-slate-100 text-slate-600"}`}>
                    {p.status}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link href={`/${locale}/admin/packages/${p.id}`}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-medium border border-slate-200 text-slate-600 rounded-xl py-2 hover:bg-slate-50 transition-colors">
                    <Eye size={12} /> View
                  </Link>
                  <Link href={`/${locale}/admin/packages/${p.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-medium border border-emerald-200 text-emerald-600 rounded-xl py-2 hover:bg-emerald-50 transition-colors">
                    <Edit size={12} /> Edit
                  </Link>
                  <button className="px-3 flex items-center justify-center text-xs font-medium border border-red-100 text-red-500 rounded-xl py-2 hover:bg-red-50 transition-colors">
                    <Trash2 size={12} />
                  </button>
                  <button onClick={() => toggleStatus(p)}
                    className="px-3 flex items-center justify-center text-xs font-medium border border-slate-200 text-slate-400 rounded-xl py-2 hover:bg-slate-50 transition-colors">
                    {p.status === "published"
                      ? <ToggleRight size={14} className="text-emerald-500" />
                      : <ToggleLeft size={14} />
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-1 mt-6">
          {Array.from({ length: Math.min(pages, 8) }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${p === page ? "bg-emerald-500 text-white" : "border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
