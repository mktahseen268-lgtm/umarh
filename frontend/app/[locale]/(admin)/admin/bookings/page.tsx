"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search, Eye, Download, Calendar, Users,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/motion/variants";
import { adminApi, type AdminBooking, type AdminStats } from "@/lib/api";

const STATUS_STYLE: Record<string, string> = {
  confirmed:       "bg-emerald-100 text-emerald-700",
  pending_payment: "bg-amber-100 text-amber-700",
  pending:         "bg-amber-100 text-amber-700",
  completed:       "bg-blue-100 text-blue-700",
  cancelled:       "bg-red-100 text-red-700",
};

export default function AdminBookingsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [bRes, sRes] = await Promise.all([
        adminApi.bookings({
          page,
          per_page: 20,
          status: statusFilter !== "all" ? statusFilter : undefined,
          q: search || undefined,
        }),
        adminApi.stats(),
      ]);
      setBookings(bRes.data.items);
      setTotal(bRes.data.total);
      setPages(bRes.data.pages);
      setStats(sRes.data);
    } catch {
      // keep existing state
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => { load(); }, [load]);

  const filtered = bookings;

  const STATS = [
    { label: "Total Bookings", value: stats ? stats.total_bookings.toLocaleString() : "—",     change: 0  },
    { label: "Confirmed",      value: stats ? stats.confirmed_bookings.toLocaleString() : "—", change: 0  },
    { label: "Pending",        value: "—", change: 0 },
    { label: "Revenue",        value: stats ? `$${Math.round(stats.revenue_total / 1000)}K` : "—", change: 0 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
        <p className="text-sm text-slate-500 mt-1">View and manage all platform bookings and reservations.</p>
      </div>

      {/* Stats */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible"
        className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {STATS.map(({ label, value, change }) => (
          <motion.div key={label} variants={staggerItem}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-2xl font-bold text-slate-900">{value}</p>
            </div>
            <p className="text-xs font-medium text-slate-500">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by booking ref…"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
            />
          </div>
          <div className="flex gap-2">
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400">
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="flex items-center gap-1.5 text-sm border border-slate-200 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors text-slate-600">
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="px-4 py-3 font-medium">Ref</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Agency</th>
                <th className="px-4 py-3 font-medium">Package</th>
                <th className="px-4 py-3 font-medium">Travel Date</th>
                <th className="px-4 py-3 font-medium">Persons</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-slate-400">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-slate-400">No bookings found.</td></tr>
              ) : filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-emerald-600 font-semibold">
                    #{b.booking_ref.slice(-6)}
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-700">{b.customer_name}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{b.agency_name}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 max-w-[160px] truncate">—</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar size={11} className="text-slate-400" /> {b.start_date ? b.start_date.slice(0, 10) : "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Users size={11} className="text-slate-400" /> {b.num_adults}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-800">${b.total_amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[b.status] ?? "bg-slate-100 text-slate-600"}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400" title="View details">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">Showing {filtered.length} of {total} bookings</p>
          <div className="flex gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors">
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${p === page ? "bg-emerald-500 text-white" : "border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
