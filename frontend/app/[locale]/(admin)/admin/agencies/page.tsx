"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle, XCircle, Eye, Building2, Globe, Star, MoreVertical } from "lucide-react";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/motion/variants";
import { adminApi, type AdminAgency } from "@/lib/api";

const STATUS_STYLE: Record<string, string> = {
  pending:   "bg-amber-100 text-amber-700",
  approved:  "bg-emerald-100 text-emerald-700",
  suspended: "bg-red-100 text-red-700",
  rejected:  "bg-slate-100 text-slate-600",
};

export default function AdminAgenciesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [agencies, setAgencies] = useState<AdminAgency[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.agencies({
        page,
        per_page: 20,
        status: statusFilter !== "all" ? statusFilter : undefined,
        q: search || undefined,
      });
      setAgencies(res.data.items);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch {
      // keep whatever was loaded before
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await adminApi.updateAgencyStatus(id, status);
      setAgencies((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    } catch { /* ignore */ }
  };

  const filtered = agencies;
  const pending = agencies.filter((a) => a.status === "pending");

  const STATS = [
    { label: "Total Agencies",   value: total.toString(),                            sub: "All registered"        },
    { label: "Pending Approval", value: pending.length.toString(),                   sub: "Awaiting KYC review"   },
    { label: "Approved",         value: agencies.filter((a) => a.status === "approved").length.toString(),  sub: "Active agencies"   },
    { label: "Suspended",        value: agencies.filter((a) => a.status === "suspended").length.toString(), sub: "Under review"      },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Agencies</h1>
        <p className="text-sm text-slate-500 mt-1">Review, approve, and manage travel agency accounts.</p>
      </div>

      {/* Stats */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible"
        className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {STATS.map(({ label, value, sub }) => (
          <motion.div key={label} variants={staggerItem}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs font-medium text-slate-700 mt-0.5">{label}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Pending KYC banner */}
      {pending.length > 0 && (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible"
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold text-amber-800 text-sm mb-1">{pending.length} Agencies Awaiting KYC Approval</p>
              <p className="text-xs text-amber-600">These agencies cannot list packages until approved. Review their documents to avoid delays.</p>
            </div>
            <button
              onClick={() => setStatusFilter("pending")}
              className="flex-shrink-0 text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-colors font-semibold">
              Review Now
            </button>
          </div>
        </motion.div>
      )}

      {/* Table */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search agencies…"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
            />
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="suspended">Suspended</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="px-4 py-3 font-medium">Agency</th>
                <th className="px-4 py-3 font-medium">Country</th>
                <th className="px-4 py-3 font-medium">Packages</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Revenue</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400">No agencies found.</td></tr>
              ) : filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 size={16} className="text-emerald-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{a.trade_name}</p>
                        <p className="text-xs text-slate-400">{a.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <Globe size={11} className="text-slate-400" /> {a.country}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-700">—</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-400">—</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium text-slate-700">—</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[a.status] ?? "bg-slate-100 text-slate-600"}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{a.created_at.slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400" title="View details">
                        <Eye size={14} />
                      </button>
                      {a.status === "pending" && (
                        <>
                          <button onClick={() => updateStatus(a.id, "approved")}
                            className="text-xs bg-emerald-500 text-white px-2.5 py-1 rounded-lg hover:bg-emerald-600 transition-colors font-semibold flex items-center gap-1">
                            <CheckCircle size={11} /> Approve
                          </button>
                          <button onClick={() => updateStatus(a.id, "rejected")}
                            className="text-xs bg-red-100 text-red-600 px-2.5 py-1 rounded-lg hover:bg-red-200 transition-colors font-semibold flex items-center gap-1">
                            <XCircle size={11} /> Reject
                          </button>
                        </>
                      )}
                      {a.status === "approved" && (
                        <button onClick={() => updateStatus(a.id, "suspended")}
                          className="text-xs text-slate-500 hover:bg-slate-100 px-2 py-1 rounded-lg transition-colors">
                          Suspend
                        </button>
                      )}
                      {a.status === "suspended" && (
                        <button onClick={() => updateStatus(a.id, "approved")}
                          className="text-xs text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors">
                          Reinstate
                        </button>
                      )}
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">Showing {filtered.length} of {total} agencies</p>
          <div className="flex gap-1">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${p === page ? "bg-emerald-500 text-white" : "border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
