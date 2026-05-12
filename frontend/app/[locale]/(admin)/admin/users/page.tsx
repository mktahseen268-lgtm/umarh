"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, MoreVertical, UserCheck, UserX, Mail, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/motion/variants";

const USERS = [
  { id: "u1",  name: "Ahmed Al-Rashidi",  email: "ahmed@example.com",  phone: "+966501234567", country: "SA", role: "customer",    status: "active",   joined: "2024-01-15", bookings: 3  },
  { id: "u2",  name: "Fatima Hassan",     email: "fatima@example.com", phone: "+971501234567", country: "AE", role: "customer",    status: "active",   joined: "2024-02-20", bookings: 1  },
  { id: "u3",  name: "Muhammad Yusuf",    email: "myusuf@example.com", phone: "+60112345678",  country: "MY", role: "customer",    status: "active",   joined: "2024-03-10", bookings: 5  },
  { id: "u4",  name: "Sara Al-Amri",      email: "sara@example.com",   phone: "+96511234567",  country: "KW", role: "customer",    status: "suspended",joined: "2024-03-25", bookings: 2  },
  { id: "u5",  name: "Omar Al-Farouq",    email: "omar@example.com",   phone: "+966512345678", country: "SA", role: "customer",    status: "active",   joined: "2024-04-01", bookings: 0  },
  { id: "u6",  name: "Layla Khalid",      email: "layla@example.com",  phone: "+97312345678",  country: "BH", role: "customer",    status: "active",   joined: "2024-04-14", bookings: 4  },
  { id: "u7",  name: "Hassan Ibrahim",    email: "hassan@example.com", phone: "+20101234567",  country: "EG", role: "customer",    status: "active",   joined: "2024-05-02", bookings: 2  },
  { id: "u8",  name: "Noor Abdallah",     email: "noor@example.com",   phone: "+44712345678",  country: "UK", role: "customer",    status: "active",   joined: "2024-05-18", bookings: 1  },
  { id: "u9",  name: "Khalid Mansour",    email: "khalid@example.com", phone: "+966523456789", country: "SA", role: "agent",      status: "active",   joined: "2024-01-05", bookings: 0  },
  { id: "u10", name: "Amina Siddiqui",    email: "amina@example.com",  phone: "+923001234567", country: "PK", role: "customer",    status: "active",   joined: "2024-06-01", bookings: 3  },
];

const ROLE_STYLE: Record<string, string> = {
  customer:    "bg-blue-100 text-blue-700",
  agent:       "bg-purple-100 text-purple-700",
  super_admin: "bg-red-100 text-red-700",
};

const STATUS_STYLE: Record<string, string> = {
  active:    "bg-emerald-100 text-emerald-700",
  suspended: "bg-red-100 text-red-700",
  pending:   "bg-amber-100 text-amber-700",
};

const STATS = [
  { label: "Total Users",    value: "12,480", sub: "+18% this month" },
  { label: "Active",         value: "11,920", sub: "95.5% of total"  },
  { label: "New This Month", value: "340",    sub: "vs 288 last month" },
  { label: "Suspended",      value: "34",     sub: "0.3% of total"  },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = USERS.filter((u) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter === "all"   || u.role   === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <p className="text-sm text-slate-500 mt-1">Manage platform users, roles, and account status.</p>
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

      {/* Table */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible"
        className="bg-white rounded-2xl shadow-sm border border-slate-100">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
            />
          </div>
          <div className="flex gap-2">
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400">
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="agent">Agent</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Country</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Bookings</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <Mail size={11} className="text-slate-400" /> {u.email}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Phone size={11} /> {u.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{u.country}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${ROLE_STYLE[u.role] ?? "bg-slate-100 text-slate-600"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[u.status] ?? "bg-slate-100 text-slate-600"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-slate-700">{u.bookings}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{u.joined}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {u.status === "active" ? (
                        <button className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1">
                          <UserX size={12} /> Suspend
                        </button>
                      ) : (
                        <button className="text-xs text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1">
                          <UserCheck size={12} /> Activate
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

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">Showing {filtered.length} of {USERS.length} users</p>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
              <ChevronLeft size={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-500 text-white text-xs font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors text-xs">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
