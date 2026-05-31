"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line,
} from "recharts";
import AirplanePlaceholder from "@/components/admin/AirplanePlaceholder";
import { adminApi, type AdminStats } from "@/lib/api";

/* ── Dummy data ───────────────────────────────────────────── */
const CARDS = [
  {
    label: "Makkah Package",
    value: "12,480",
    unit: "Pilgrims",
    sub: "+18.2% this month",
    bg: "linear-gradient(135deg, #00c9a7 0%, #008c74 100%)",
    glow: "rgba(0,201,167,0.4)",
  },
  {
    label: "Madinah Package",
    value: "8,340",
    unit: "Bookings",
    sub: "+11.3% this month",
    bg: "linear-gradient(135deg, #94b020 0%, #5a6e14 100%)",
    glow: "rgba(110,128,32,0.38)",
  },
  {
    label: "Premium Package",
    value: "$284K",
    unit: "Revenue",
    sub: "+9.7% this month",
    bg: "linear-gradient(135deg, #9b7fd4 0%, #5a45a0 100%)",
    glow: "rgba(107,84,180,0.38)",
  },
];

const TRIPS = [
  { name: "Ahmed Al-Rashidi", email: "ahmed@gmail.com",  avatar: "/images/avatars/r1.jpg", agency: "Al-Noor Travel",     total: 24, price: "$1,500" },
  { name: "Fatima Hassan",    email: "fatima@gmail.com", avatar: "/images/avatars/r2.jpg", agency: "Barakah Tours",      total: 18, price: "$4,200" },
  { name: "Muhammad Yusuf",   email: "myusuf@gmail.com", avatar: "/images/avatars/r3.jpg", agency: "Zamzam Pilgrimages", total: 31, price: "$320"   },
  { name: "Sara Al-Amri",     email: "sara@gmail.com",   avatar: "/images/avatars/r4.jpg", agency: "Madinah Express",    total: 12, price: "$2,800" },
  { name: "Omar Al-Farouq",   email: "omar@gmail.com",   avatar: "/images/avatars/r1.jpg", agency: "Al-Noor Travel",     total: 9,  price: "$890"   },
];

const BAR_DATA = [
  { month: "Jan", v: 2.2 },
  { month: "Feb", v: 3.1 },
  { month: "Mar", v: 2.8 },
  { month: "Apr", v: 4.9 },
];

const PIE_DATA = [
  { name: "Makkah",  value: 48, color: "#1abc9c" },
  { name: "Madinah", value: 31, color: "#2d6a4f" },
  { name: "Premium", value: 21, color: "#e9c46a" },
];

const LINE_DATA = [
  { m: "Jan",  a: 2,   b: 1   },
  { m: "Feb",  a: 2.8, b: 1.5 },
  { m: "Mar",  a: 2.2, b: 3.5 },
  { m: "Apr",  a: 3.5, b: 2   },
  { m: "May",  a: 2.6, b: 4.8 },
  { m: "June", a: 3.8, b: 3.2 },
  { m: "July", a: 3.2, b: 5   },
];

import Image from "next/image";

/* ── Rounded bar shape ────────────────────────────────────── */
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

/* ── Card shell ───────────────────────────────────────────── */
function Card({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`bg-white rounded-2xl ${className}`}
      style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.07)", ...style }}
    >
      {children}
    </div>
  );
}

/* ── Dashboard ────────────────────────────────────────────── */
export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    adminApi.stats().then((r) => setStats(r.data)).catch(() => {});
  }, []);

  const cards = [
    {
      ...CARDS[0],
      value: stats ? stats.total_bookings.toLocaleString() : CARDS[0]!.value,
      unit: "Total Bookings",
    },
    {
      ...CARDS[1],
      value: stats ? stats.total_agencies.toLocaleString() : CARDS[1]!.value,
      unit: "Agencies",
    },
    {
      ...CARDS[2],
      value: stats ? `$${Math.round(stats.revenue_total / 1000)}K` : CARDS[2]!.value,
      unit: "Revenue",
    },
  ];

  return (
    <div className="space-y-5">

      {/* ── Summary Cards ── */}
      <div className="grid md:grid-cols-3 gap-5">
        {cards.map(({ label, value, unit, sub, bg, glow }) => (
          <div
            key={label}
            className="relative rounded-2xl px-6 py-5 overflow-visible
                       transition-all duration-300 hover:scale-[1.025]"
            style={{
              background: bg,
              minHeight: "114px",
              boxShadow: `0 10px 32px ${glow}`,
            }}
          >
            {/* Subtle inner circles */}
            <div className="absolute rounded-full pointer-events-none"
              style={{ width: 140, height: 140, backgroundColor: "rgba(255,255,255,0.07)", right: -30, bottom: -30 }} />
            <div className="absolute rounded-full pointer-events-none"
              style={{ width: 80, height: 80, backgroundColor: "rgba(255,255,255,0.06)", right: 14, bottom: -18 }} />

            {/* Text — leave right 110px for airplane */}
            <div className="relative z-10" style={{ paddingRight: "105px" }}>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px", marginBottom: "4px" }}>
                {label}
              </p>
              <p style={{ color: "#fff", fontSize: "32px", fontWeight: 800, lineHeight: 1.05 }}>
                {value}
              </p>
              <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "13px", marginTop: "3px" }}>
                {unit}
              </p>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "10px", marginTop: "6px" }}>
                {sub}
              </p>
            </div>

            {/* Airplane — overflows right edge */}
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

      {/* ── Middle: Latest Trips + Bar chart ── */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Latest Trips */}
        <Card className="lg:col-span-3 p-5">
          <div className="flex items-center justify-between mb-1">
            <p style={{ fontSize: "15px", fontWeight: 700, color: "#0f1416" }}>Latest Trips</p>
            <a href="/en/admin/bookings"
              style={{ fontSize: "12px", color: "#1abc9c", fontWeight: 600 }}
              className="hover:underline">
              View All
            </a>
          </div>
          <p style={{ fontSize: "11px", color: "#b0b8bc", marginBottom: "16px" }}>Overview of latest month</p>

          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #f0f2f4" }}>
                {["Members", "Agency", "Total", "Ticket Price"].map(h => (
                  <th key={h} className="text-left pb-2.5"
                    style={{ fontSize: "10px", fontWeight: 700, color: "#b0b8bc", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRIPS.map(({ name, email, avatar, agency, total, price }) => (
                <tr key={name} style={{ borderBottom: "1px dashed #f3f5f6" }}
                  className="hover:bg-[#f9fbfa] transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <Image src={avatar} alt={name} fill className="object-cover" sizes="32px" />
                      </div>
                      <div>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: "#0f1416" }}>{name}</p>
                        <p style={{ fontSize: "10px", color: "#b0b8bc" }}>{email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3" style={{ fontSize: "12px", color: "#6b7280" }}>{agency}</td>
                  <td className="py-3">
                    <span className="flex items-center justify-center rounded-full font-bold text-white"
                      style={{ width: 28, height: 28, fontSize: "11px", backgroundColor: "#1abc9c" }}>
                      {total}
                    </span>
                  </td>
                  <td className="py-3" style={{ fontSize: "13px", fontWeight: 700, color: "#0f1416" }}>
                    {price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Statistics bar chart */}
        <Card className="lg:col-span-2 p-5">
          <p style={{ fontSize: "15px", fontWeight: 700, color: "#0f1416" }}>Statistics</p>
          <p style={{ fontSize: "11px", color: "#b0b8bc", marginBottom: "20px" }}>Monthly bookings</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={BAR_DATA} barCategoryGap="40%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f4" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#b0b8bc" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#b0b8bc" }} axisLine={false} tickLine={false}
                domain={[0, 6]} ticks={[0, 1, 2, 3, 4, 5]} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "12px" }}
                cursor={false}
              />
              <Bar dataKey="v" name="Bookings" shape={<RoundedBar />}>
                {BAR_DATA.map((_, i) => (
                  <Cell key={i} fill={i >= BAR_DATA.length - 2 ? "#1abc9c" : "#1e293b"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Bottom: Donut + Line chart ── */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Flight Share donut */}
        <Card className="lg:col-span-2 p-5">
          <p style={{ fontSize: "15px", fontWeight: 700, color: "#0f1416" }}>Flight Share</p>
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
                  Flight<br />Share
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

        {/* Multi-line statistics */}
        <Card className="lg:col-span-3 p-5">
          <p style={{ fontSize: "15px", fontWeight: 700, color: "#0f1416" }}>Statistics</p>
          <p style={{ fontSize: "11px", color: "#b0b8bc", marginBottom: "20px" }}>Booking trends</p>
          <ResponsiveContainer width="100%" height={158}>
            <LineChart data={LINE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f4" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 10, fill: "#b0b8bc" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#b0b8bc" }} axisLine={false} tickLine={false}
                domain={[0, 6]} ticks={[0, 1, 2, 3, 4, 5]} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "12px" }}
              />
              <Line type="monotone" dataKey="a" stroke="#e9c46a" strokeWidth={2.2}
                dot={{ r: 3.5, fill: "#e9c46a", strokeWidth: 0 }} activeDot={{ r: 5 }} name="Series A" />
              <Line type="monotone" dataKey="b" stroke="#f4a261" strokeWidth={2.2}
                dot={{ r: 3.5, fill: "#f4a261", strokeWidth: 0 }} activeDot={{ r: 5 }} name="Series B" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

      </div>
    </div>
  );
}
