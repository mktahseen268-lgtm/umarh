"use client";

import { useState } from "react";
import { Search, CheckCircle, Clock, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

const BOOKINGS = [
  { ref: "UMR00123456", customer: "Ahmed Al-Rashidi", email: "ahmed@gmail.com",  pkg: "Umrah Economy 7-Day",    date: "2024-10-29", status: "confirmed", amount: 1500 },
  { ref: "UMR00123457", customer: "Fatima Hassan",    email: "fatima@gmail.com", pkg: "VIP Hajj Package",       date: "2024-10-28", status: "pending",   amount: 4200 },
  { ref: "UMR00123458", customer: "Muhammad Yusuf",   email: "myusuf@gmail.com", pkg: "Madinah Ziyarah 5-Day",  date: "2024-10-27", status: "completed", amount: 320  },
  { ref: "UMR00123459", customer: "Sara Al-Amri",     email: "sara@gmail.com",   pkg: "Umrah Premium 10-Day",   date: "2024-10-26", status: "confirmed", amount: 2800 },
  { ref: "UMR00123460", customer: "Omar Al-Farouq",   email: "omar@gmail.com",   pkg: "Budget Umrah 5-Day",     date: "2024-10-25", status: "cancelled", amount: 890  },
  { ref: "UMR00123461", customer: "Khalid Al-Otaibi", email: "khalid@gmail.com", pkg: "Family Umrah 14-Day",    date: "2024-10-24", status: "confirmed", amount: 4200 },
  { ref: "UMR00123462", customer: "Aisha Barakah",    email: "aisha@gmail.com",  pkg: "VIP Hajj Package",       date: "2024-10-23", status: "pending",   amount: 7500 },
  { ref: "UMR00123463", customer: "Hassan Al-Sayed",  email: "hassan@gmail.com", pkg: "Luxury Ziyarah Tour",    date: "2024-10-22", status: "completed", amount: 1900 },
  { ref: "UMR00123464", customer: "Noor Al-Zaid",     email: "noor@gmail.com",   pkg: "Umrah Economy 7-Day",    date: "2024-10-21", status: "confirmed", amount: 1200 },
  { ref: "UMR00123465", customer: "Bilal Mansour",    email: "bilal@gmail.com",  pkg: "Hajj Economy Package",   date: "2024-10-20", status: "cancelled", amount: 4800 },
];

const STATUS_MAP: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  confirmed: { label: "Confirmed", color: "bg-green-100 text-green-700",  icon: CheckCircle },
  pending:   { label: "Pending",   color: "bg-amber-100 text-amber-700",  icon: Clock       },
  completed: { label: "Completed", color: "bg-blue-100 text-blue-700",    icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700",      icon: XCircle     },
};

const STATUS_FILTERS = ["all", "confirmed", "pending", "completed", "cancelled"];

export default function AgencyBookingsPage() {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");

  const filtered = BOOKINGS.filter(b => {
    const matchSearch = b.customer.toLowerCase().includes(search.toLowerCase()) ||
                        b.ref.toLowerCase().includes(search.toLowerCase()) ||
                        b.pkg.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || b.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0f1416" }}>Bookings</h2>
          <p style={{ fontSize: "12px", color: "#b0b8bc", marginTop: "2px" }}>{BOOKINGS.length} total bookings</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute top-1/2 -translate-y-1/2 left-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name, ref, or package..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none bg-white border border-neutral-200 focus:border-[#0d7434] transition-colors"
            style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
          />
        </div>
        <div className="flex gap-1.5 bg-white rounded-xl p-1 border border-neutral-100" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
              style={{
                backgroundColor: filter === f ? "#0d7434" : "transparent",
                color: filter === f ? "#fff" : "#6b7280",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.07)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #f0f2f4", backgroundColor: "#fafbfc" }}>
                {["Ref", "Customer", "Package", "Date", "Status", "Amount"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5"
                    style={{ fontSize: "10px", fontWeight: 700, color: "#b0b8bc", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const s = STATUS_MAP[b.status];
                const StatusIcon = s?.icon ?? CheckCircle;
                return (
                  <tr key={b.ref} style={{ borderBottom: "1px dashed #f3f5f6" }} className="hover:bg-[#f9fbfa] transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs" style={{ color: "#0d7434" }}>{b.ref}</td>
                    <td className="px-5 py-3.5">
                      <p style={{ fontSize: "12px", fontWeight: 600, color: "#0f1416" }}>{b.customer}</p>
                      <p style={{ fontSize: "10px", color: "#b0b8bc" }}>{b.email}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell" style={{ fontSize: "12px", color: "#6b7280", maxWidth: "160px" }}>
                      <span className="truncate block">{b.pkg}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell" style={{ fontSize: "11px", color: "#b0b8bc" }}>{b.date}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${s?.color}`}>
                        <StatusIcon size={10} />{s?.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5" style={{ fontSize: "13px", fontWeight: 700, color: "#0f1416" }}>
                      {formatPrice(b.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-14 text-center">
            <p style={{ fontSize: "13px", color: "#b0b8bc" }}>No bookings match your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
