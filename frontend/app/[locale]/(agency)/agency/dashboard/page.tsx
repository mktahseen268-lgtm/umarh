"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line,
} from "recharts";
import AirplanePlaceholder from "@/components/admin/AirplanePlaceholder";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

/* ── Dummy data ───────────────────────────────────────────── */
const CARDS = [
  {
    label: "Umrah Economy",
    value: "3,240",
    unit: "Total Bookings",
    sub: "+14.2% this month",
    bg: "linear-gradient(135deg, #00c9a7 0%, #008c74 100%)",
    glow: "rgba(0,201,167,0.4)",
  },
  {
    label: "Premium Packages",
    value: "1,180",
    unit: "Active Packages",
    sub: "+8.5% this month",
    bg: "linear-gradient(135deg, #94b020 0%, #5a6e14 100%)",
    glow: "rgba(110,128,32,0.38)",
  },
  {
    label: "Agency Revenue",
    value: "$124K",
    unit: "Revenue",
    sub: "+12.5% this month",
    bg: "linear-gradient(135deg, #9b7fd4 0%, #5a45a0 100%)",
    glow: "rgba(107,84,180,0.38)",
  },
];

const RECENT_BOOKINGS = [
  { ref: "UMR00123456", customer: "Ahmed Al-Rashidi", email: "ahmed@gmail.com",  pkg: "Umrah Economy 7-Day",  date: "2024-10-29", status: "confirmed", amount: 1500 },
  { ref: "UMR00123457", customer: "Fatima Hassan",    email: "fatima@gmail.com", pkg: "VIP Hajj Package",     date: "2024-10-28", status: "pending",   amount: 4200 },
  { ref: "UMR00123458", customer: "Muhammad Yusuf",   email: "myusuf@gmail.com", pkg: "Madinah Ziyarah Tour", date: "2024-10-27", status: "completed", amount: 320  },
  { ref: "UMR00123459", customer: "Sara Al-Amri",     email: "sara@gmail.com",   pkg: "Umrah Premium 10-Day", date: "2024-10-26", status: "confirmed", amount: 2800 },
  { ref: "UMR00123460", customer: "Omar Al-Farouq",   email: "omar@gmail.com",   pkg: "Budget Umrah Package", date: "2024-10-25", status: "cancelled", amount: 890  },
];

const BAR_DATA = [
  { month: "Jan", v: 163 },
  { month: "Feb", v: 300 },
  { month: "Mar", v: 282 },
  { month: "Apr", v: 410 },
];

const PIE_DATA = [
  { name: "Umrah Packages", value: 55, color: "#1abc9c" },
  { name: "Hajj Packages",  value: 25, color: "#e9c46a" },
  { name: "Ziyarah Tours",  value: 20, color: "#9b7fd4" },
];

const LINE_DATA = [
  { m: "Jan",  a: 18,  b: 12  },
  { m: "Feb",  a: 32,  b: 20  },
  { m: "Mar",  a: 28,  b: 35  },
  { m: "Apr",  a: 15,  b: 18  },
  { m: "May",  a: 42,  b: 28  },
  { m: "June", a: 24,  b: 38  },
  { m: "July", a: 38,  b: 30  },
];

const STATUS_MAP: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  confirmed: { label: "Confirmed", color: "bg-green-100 text-green-700",  icon: CheckCircle },
  pending:   { label: "Pending",   color: "bg-amber-100 text-amber-700",  icon: Clock       },
  completed: { label: "Completed", color: "bg-blue-100 text-blue-700",    icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700",      icon: XCircle     },
};

function RoundedBar(props: any) {
  const { x, y, width, height, fill } = props;
  const r = 5;
  if (!height || height <= 0) return null;
  return (
    <path
      d={`M${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height} L${x},${y + height} Z`}
      fill={fill}
    />
  );
}

function Card({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`bg-white rounded-2xl ${className}`} style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.07)", ...style }}>
      {children}
    </div>
  );
}

export default function AgencyDashboardPage() {
  return (
    <div className="space-y-5">

      {/* ── Summary Cards ── */}
      <div className="grid md:grid-cols-3 gap-5">
        {CARDS.map(({ label, value, unit, sub, bg, glow }) => (
          <div
            key={label}
            className="relative rounded-2xl px-6 py-5 overflow-visible transition-all duration-300 hover:scale-[1.025]"
            style={{ background: bg, minHeight: "114px", boxShadow: `0 10px 32px ${glow}` }}
          >
            <div className="absolute rounded-full pointer-events-none"
              style={{ width: 140, height: 140, backgroundColor: "rgba(255,255,255,0.07)", right: -30, bottom: -30 }} />
            <div className="absolute rounded-full pointer-events-none"
              style={{ width: 80, height: 80, backgroundColor: "rgba(255,255,255,0.06)", right: 14, bottom: -18 }} />

            <div className="relative z-10" style={{ paddingRight: "105px" }}>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px", marginBottom: "4px" }}>{label}</p>
              <p style={{ color: "#fff", fontSize: "32px", fontWeight: 800, lineHeight: 1.05 }}>{value}</p>
              <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "13px", marginTop: "3px" }}>{unit}</p>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "10px", marginTop: "6px" }}>{sub}</p>
            </div>

            <AirplanePlaceholder
              variant="card"
              style={{
                position: "absolute",
                right: "-14px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "130px",
                height: "86px",
                zIndex: 20,
                filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.28))",
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Latest Bookings + Bar chart ── */}
      <div className="grid lg:grid-cols-5 gap-5">

        <Card className="lg:col-span-3 p-5">
          <div className="flex items-center justify-between mb-1">
            <p style={{ fontSize: "15px", fontWeight: 700, color: "#0f1416" }}>Latest Bookings</p>
            <a href="bookings" style={{ fontSize: "12px", color: "#1abc9c", fontWeight: 600 }} className="hover:underline">
              View All
            </a>
          </div>
          <p style={{ fontSize: "11px", color: "#b0b8bc", marginBottom: "16px" }}>Overview of latest month</p>

          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #f0f2f4" }}>
                {["Customer", "Package", "Date", "Status", "Amount"].map(h => (
                  <th key={h} className="text-left pb-2.5"
                    style={{ fontSize: "10px", fontWeight: 700, color: "#b0b8bc", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_BOOKINGS.map((b) => {
                const s = STATUS_MAP[b.status];
                const StatusIcon = s?.icon ?? CheckCircle;
                return (
                  <tr key={b.ref} style={{ borderBottom: "1px dashed #f3f5f6" }} className="hover:bg-[#f9fbfa] transition-colors">
                    <td className="py-3">
                      <div>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: "#0f1416" }}>{b.customer}</p>
                        <p style={{ fontSize: "10px", color: "#b0b8bc" }}>{b.email}</p>
                      </div>
                    </td>
                    <td className="py-3" style={{ fontSize: "12px", color: "#6b7280", maxWidth: "140px" }}>
                      <span className="truncate block">{b.pkg}</span>
                    </td>
                    <td className="py-3 hidden md:table-cell" style={{ fontSize: "11px", color: "#b0b8bc" }}>{b.date}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${s?.color}`}>
                        <StatusIcon size={10} />{s?.label}
                      </span>
                    </td>
                    <td className="py-3" style={{ fontSize: "13px", fontWeight: 700, color: "#0f1416" }}>
                      {formatPrice(b.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        <Card className="lg:col-span-2 p-5">
          <p style={{ fontSize: "15px", fontWeight: 700, color: "#0f1416" }}>Statistics</p>
          <p style={{ fontSize: "11px", color: "#b0b8bc", marginBottom: "20px" }}>Monthly bookings</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={BAR_DATA} barCategoryGap="40%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f4" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#b0b8bc" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#b0b8bc" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "12px" }} cursor={false} />
              <Bar dataKey="v" name="Bookings" shape={<RoundedBar />}>
                {BAR_DATA.map((_, i) => (
                  <Cell key={i} fill={i >= BAR_DATA.length - 2 ? "#1abc9c" : "#1e293b"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Package Mix donut + Revenue trend ── */}
      <div className="grid lg:grid-cols-5 gap-5">

        <Card className="lg:col-span-2 p-5">
          <p style={{ fontSize: "15px", fontWeight: 700, color: "#0f1416" }}>Package Mix</p>
          <p style={{ fontSize: "11px", color: "#b0b8bc", marginBottom: "16px" }}>Package distribution</p>
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0" style={{ width: 148, height: 148 }}>
              <ResponsiveContainer width={148} height={148}>
                <PieChart>
                  <Pie data={PIE_DATA} cx="50%" cy="50%"
                    innerRadius={44} outerRadius={66}
                    paddingAngle={3} dataKey="value"
                    strokeWidth={0} startAngle={90} endAngle={-270}>
                    {PIE_DATA.map(({ color }, i) => <Cell key={i} fill={color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p style={{ fontSize: "10px", color: "#b0b8bc", fontWeight: 600, textAlign: "center", lineHeight: 1.4 }}>
                  Package<br />Mix
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              {PIE_DATA.map(({ name, value, color }) => (
                <div key={name} className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#0f1416" }}>{value}%</p>
                    <p style={{ fontSize: "10px", color: "#b0b8bc" }}>{name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-3 p-5">
          <p style={{ fontSize: "15px", fontWeight: 700, color: "#0f1416" }}>Revenue Trend</p>
          <p style={{ fontSize: "11px", color: "#b0b8bc", marginBottom: "20px" }}>Monthly revenue ($K)</p>
          <ResponsiveContainer width="100%" height={158}>
            <LineChart data={LINE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f4" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 10, fill: "#b0b8bc" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#b0b8bc" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}k`} />
              <Tooltip
                formatter={(v: number) => `$${v}k`}
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "12px" }}
              />
              <Line type="monotone" dataKey="a" stroke="#1abc9c" strokeWidth={2.2}
                dot={{ r: 3.5, fill: "#1abc9c", strokeWidth: 0 }} activeDot={{ r: 5 }} name="Umrah" />
              <Line type="monotone" dataKey="b" stroke="#e9c46a" strokeWidth={2.2}
                dot={{ r: 3.5, fill: "#e9c46a", strokeWidth: 0 }} activeDot={{ r: 5 }} name="Hajj" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

      </div>
    </div>
  );
}
