"use client";

import { motion } from "framer-motion";
import {
  DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight,
  CheckCircle, Clock, XCircle, Download, Filter,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/motion/variants";

const MONTHLY_REVENUE = [
  { month: "Jan", revenue: 68000,  payouts: 52000  },
  { month: "Feb", revenue: 95000,  payouts: 74000  },
  { month: "Mar", revenue: 118000, payouts: 92000  },
  { month: "Apr", revenue: 82000,  payouts: 63000  },
  { month: "May", revenue: 144000, payouts: 112000 },
  { month: "Jun", revenue: 107000, payouts: 83000  },
  { month: "Jul", revenue: 131000, payouts: 102000 },
];

const PAYOUTS = [
  { id: "po1", agency: "Haram View Travels",  amount: 42000, status: "pending",   date: "2024-07-15", ref: "PAY-001" },
  { id: "po2", agency: "Safa Marwa Tours",    amount: 18500, status: "pending",   date: "2024-07-14", ref: "PAY-002" },
  { id: "po3", agency: "Ihram Journey",       amount: 27000, status: "completed", date: "2024-07-10", ref: "PAY-003" },
  { id: "po4", agency: "Zamzam Pilgrimages",  amount: 9800,  status: "pending",   date: "2024-07-12", ref: "PAY-004" },
  { id: "po5", agency: "Haram View Travels",  amount: 31000, status: "completed", date: "2024-07-05", ref: "PAY-005" },
  { id: "po6", agency: "Meeqat Holidays",     amount: 6200,  status: "on_hold",   date: "2024-07-08", ref: "PAY-006" },
  { id: "po7", agency: "Ihram Journey",       amount: 14500, status: "pending",   date: "2024-07-13", ref: "PAY-007" },
  { id: "po8", agency: "Safa Marwa Tours",    amount: 22000, status: "completed", date: "2024-07-02", ref: "PAY-008" },
];

const STATUS_STYLE: Record<string, string> = {
  pending:   "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  on_hold:   "bg-red-100 text-red-700",
  failed:    "bg-slate-100 text-slate-600",
};

const STATS = [
  { label: "Total Revenue (MTD)", value: "$284K",  change: +9.7,  icon: DollarSign,  color: "bg-emerald-100 text-emerald-700" },
  { label: "Platform Fees (MTD)", value: "$28.4K", change: +9.7,  icon: TrendingUp,  color: "bg-blue-100 text-blue-700"       },
  { label: "Pending Payouts",     value: "$103K",  change: +4.2,  icon: Clock,       color: "bg-amber-100 text-amber-700"     },
  { label: "Completed Payouts",   value: "$742K",  change: +12.1, icon: CheckCircle, color: "bg-purple-100 text-purple-700"   },
];

export default function AdminFinancialsPage() {
  const pendingPayouts = PAYOUTS.filter((p) => p.status === "pending");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financials</h1>
          <p className="text-sm text-slate-500 mt-1">Revenue overview, agency payouts, and financial management.</p>
        </div>
        <button className="flex items-center gap-2 border border-slate-200 text-slate-600 text-sm font-medium px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors">
          <Download size={14} /> Export Report
        </button>
      </div>

      {/* KPI Stats */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible"
        className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {STATS.map(({ label, value, change, icon: Icon, color }) => (
          <motion.div key={label} variants={staggerItem}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {change >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {Math.abs(change)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Revenue Chart */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-slate-900">Revenue vs Payouts</h3>
          <span className="text-xs text-slate-400">Last 7 months</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">Platform revenue compared to agency payouts</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={MONTHLY_REVENUE}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
              tickFormatter={(v: number) => `$${v / 1000}k`} />
            <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
              formatter={(v: number) => `$${v.toLocaleString()}`} />
            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#revGrad)" name="Revenue" />
            <Area type="monotone" dataKey="payouts"  stroke="#6366f1" strokeWidth={2}   fill="url(#payGrad)" name="Payouts" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Pending Payouts */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Agency Payouts</h3>
            <p className="text-xs text-slate-400 mt-0.5">{pendingPayouts.length} pending approvals</p>
          </div>
          <button className="flex items-center gap-1.5 text-sm border border-slate-200 rounded-xl px-3 py-2 hover:bg-slate-50 transition-colors text-slate-600">
            <Filter size={13} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 font-medium">Agency</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {PAYOUTS.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600 font-semibold">{p.ref}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-700">{p.agency}</td>
                  <td className="px-4 py-3 text-sm font-bold text-slate-800">${p.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[p.status] ?? "bg-slate-100 text-slate-600"}`}>
                      {p.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">{p.date}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {p.status === "pending" && (
                        <button className="text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-colors font-semibold">
                          Release
                        </button>
                      )}
                      {p.status === "on_hold" && (
                        <button className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors font-semibold flex items-center gap-1">
                          <XCircle size={11} /> Investigate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
