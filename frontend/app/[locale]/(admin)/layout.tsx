"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { auth } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";
import {
  LayoutDashboard, Users, Building2, Package,
  ShoppingBag, TrendingUp, Settings, LogOut,
  Bell, Menu, X,
} from "lucide-react";
import AirplanePlaceholder from "@/components/admin/AirplanePlaceholder";

const NAV_KEYS = [
  { key: "dashboard",  icon: LayoutDashboard, path: "/admin"            },
  { key: "users",      icon: Users,            path: "/admin/users"      },
  { key: "agencies",   icon: Building2,        path: "/admin/agencies"   },
  { key: "bookings",   icon: ShoppingBag,      path: "/admin/bookings"   },
  { key: "packages",   icon: Package,          path: "/admin/packages"   },
  { key: "financials", icon: TrendingUp,       path: "/admin/financials" },
  { key: "settings",   icon: Settings,         path: "/admin/settings"   },
];

const ACTIVE_USERS = [
  "/images/avatars/r1.jpg",
  "/images/avatars/r2.jpg",
  "/images/avatars/r3.jpg",
  "/images/avatars/r4.jpg",
];

/* ── Sidebar card (used on both desktop + mobile) ─────────── */
function SidebarCard({ pathname, locale }: { pathname: string; locale: string }) {
  const t = useTranslations("admin.nav");
  const router = useRouter();
  const setUserStore = useAuthStore((s) => s.setUser);

  const NAV = NAV_KEYS.map(({ key, icon, path }) => ({
    label: t(key as Parameters<typeof t>[0]),
    icon,
    href: `/${locale}${path}`,
  }));

  return (
    <aside
      className="flex flex-col h-full rounded-2xl overflow-hidden relative"
      style={{
        background: "linear-gradient(170deg, #163d24 0%, #0a2e18 55%, #071f10 100%)",
        boxShadow: "4px 0 32px rgba(0,0,0,0.22)",
      }}
    >
      {/* User profile */}
      <div className="flex flex-col items-center pt-7 pb-5 px-4">
        <div
          className="relative mb-3"
          style={{
            width: "68px", height: "68px", borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.25)",
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          }}
        >
          <Image src="/images/avatars/r1.jpg" alt="Admin" fill className="object-cover" />
        </div>
        <p style={{ color: "#fff", fontSize: "14px", fontWeight: 700, letterSpacing: "0.02em" }}>
          John Smith
        </p>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px", marginTop: "2px" }}>
          admin@umrahplatform.com
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)", margin: "0 20px 12px" }} />

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto" style={{ gap: "2px", display: "flex", flexDirection: "column" }}>
        {NAV.map(({ label, icon: Icon, href }) => {
          const active = pathname === href || (href !== "/en/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                color: active ? "#fff" : "rgba(255,255,255,0.5)",
                backgroundColor: active ? "rgba(26,188,156,0.22)" : "transparent",
                borderLeft: active ? "3px solid #1abc9c" : "3px solid transparent",
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.07)";
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              <Icon
                size={17}
                style={{ flexShrink: 0, color: active ? "#1abc9c" : "rgba(255,255,255,0.5)" }}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Active Users */}
      <div className="px-5 pb-3 mt-3">
        <p style={{
          color: "rgba(255,255,255,0.38)", fontSize: "10px", fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px",
        }}>
          Active Users
        </p>
        <div className="flex items-center">
          {ACTIVE_USERS.map((src, i) => (
            <div
              key={src}
              className="relative overflow-hidden rounded-full"
              style={{
                width: "28px", height: "28px",
                border: "2px solid #0a2e18",
                marginLeft: i === 0 ? 0 : "-7px",
                zIndex: ACTIVE_USERS.length - i,
              }}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="28px" />
            </div>
          ))}
          <span
            className="flex items-center justify-center rounded-full font-bold"
            style={{
              width: "28px", height: "28px", fontSize: "9px",
              backgroundColor: "rgba(26,188,156,0.25)",
              border: "2px solid #0a2e18",
              marginLeft: "-7px",
              color: "#1abc9c",
            }}
          >
            +50
          </span>
        </div>
      </div>

      {/* Logout button */}
      <div className="px-3 pb-3">
        <button
          onClick={async () => {
            try { await auth.logout(); } catch { /* ignore */ }
            setUserStore(null);
            router.replace(`/${locale}/admin/login`);
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          style={{ color: "rgba(255,255,255,0.5)", backgroundColor: "transparent", border: "none", cursor: "pointer" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(239,68,68,0.15)"; (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
        >
          <LogOut size={17} style={{ flexShrink: 0 }} />
          {t("logout")}
        </button>
      </div>

      {/* Wave + Back to site */}
      <div className="relative select-none pointer-events-none" style={{ height: "80px" }}>
        <svg viewBox="0 0 240 80" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" style={{ opacity: 0.2 }}>
          <path d="M0 48 Q30 14 60 44 Q90 74 120 34 Q150 -6 180 26 Q210 58 240 38 L240 80 L0 80 Z" fill="#4ade80" />
          <path d="M0 64 Q40 42 80 60 Q120 78 160 52 Q200 26 240 48 L240 80 L0 80 Z" fill="#22c55e" />
        </svg>
        <Link
          href={`/${locale}`}
          className="pointer-events-auto absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5"
          style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}
        >
          <LogOut size={12} />
          {t("backToSite")}
        </Link>
      </div>
    </aside>
  );
}

/* ── Layout ───────────────────────────────────────────────── */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) ?? "en";
  const tNav = useTranslations("admin.nav");
  const tHeader = useTranslations("admin.header");
  const setUser = useAuthStore((s) => s.setUser);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isRtl = locale === "ar";

  const NAV_RESOLVED = NAV_KEYS.map(({ key, path }) => ({
    label: tNav(key as Parameters<typeof tNav>[0]),
    href: `/${locale}${path}`,
  }));

  useEffect(() => {
    auth.me()
      .then((res) => setUser(res.data))
      .catch(() => router.replace(`/${locale}/admin/login`));
  }, []);

  return (
    /* Page shell — mint background */
    <div className="flex min-h-screen relative" style={{ backgroundColor: "#dff0e9" }}>

      {/* ── Decorative airplane — LEFT of sidebar (partially visible) ── */}
      <AirplanePlaceholder
        variant="left"
        style={{
          position: "fixed",
          left: "-55px",
          top: "32%",
          width: "220px",
          height: "140px",
          zIndex: 35,
          opacity: 0.82,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      {/* ── Decorative airplane — BOTTOM RIGHT ── */}
      <AirplanePlaceholder
        variant="right"
        style={{
          position: "fixed",
          right: "-18px",
          bottom: "-18px",
          width: "280px",
          height: "175px",
          zIndex: 5,
          opacity: 0.78,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      {/* ── Green dots decoration ── */}
      {[
        { top: "6%",  left: "38%",  size: 12, op: 0.5 },
        { top: "10%", right: "26%", size: 10, op: 0.4 },
        { top: "20%", right: "15%", size: 8,  op: 0.3 },
        { top: "55%", left: "52%",  size: 10, op: 0.35 },
        { top: "78%", left: "44%",  size: 8,  op: 0.28 },
      ].map((d, i) => (
        <div
          key={i}
          className="fixed rounded-full pointer-events-none"
          style={{
            width: d.size, height: d.size,
            backgroundColor: "#0d7434",
            opacity: d.op,
            top: d.top,
            left: (d as any).left,
            right: (d as any).right,
            zIndex: 4,
          }}
        />
      ))}

      {/* ── Desktop sidebar — floating card ── */}
      <div
        className="hidden lg:block fixed z-40"
        style={{ top: "14px", [isRtl ? "right" : "left"]: "14px", bottom: "14px", width: "234px" }}
      >
        <SidebarCard pathname={pathname} locale={locale} />
      </div>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className={`absolute inset-y-0 ${isRtl ? "right-0" : "left-0"} z-50 p-3`}
            style={{ width: "262px" }}
            onClick={e => e.stopPropagation()}
          >
            <SidebarCard pathname={pathname} locale={locale} />
          </div>
        </div>
      )}

      {/* ── Main content area ── */}
      <div
        className="flex-1 flex flex-col min-h-screen"
        style={{ [isRtl ? "marginRight" : "marginLeft"]: "262px" }}
      >
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-5 py-3"
          style={{ backgroundColor: "rgba(223,240,233,0.85)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(13,116,52,0.1)" }}
        >
          <button className="lg:hidden p-2 text-gray-600" onClick={() => setMobileOpen(true)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <p className="hidden lg:block font-bold text-gray-800" style={{ fontSize: "16px" }}>
            {NAV_RESOLVED.find(n => n.href === pathname)?.label
              ?? NAV_RESOLVED.find(n => pathname.startsWith(n.href) && n.href !== `/${locale}/admin`)?.label
              ?? tNav("dashboard")}
          </p>

          <div className="flex items-center gap-3 ms-auto">
            {/* Language switcher */}
            <div className="flex items-center gap-0.5 bg-white/60 rounded-xl p-1">
              {(["en", "ar"] as const).map((lng) => (
                <Link
                  key={lng}
                  href={pathname.replace(`/${locale}/`, `/${lng}/`)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
                  style={{
                    backgroundColor: locale === lng ? "#0d7434" : "transparent",
                    color: locale === lng ? "#fff" : "#6b7280",
                  }}
                >
                  {lng === "en" ? "EN" : "ع"}
                </Link>
              ))}
            </div>

            <button className="relative p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-white/60 transition-all">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 bg-white/60 rounded-xl px-2.5 py-1.5">
              <div className="relative overflow-hidden rounded-full flex-shrink-0" style={{ width: "32px", height: "32px" }}>
                <Image src="/images/avatars/r1.jpg" alt="Admin" fill className="object-cover" sizes="32px" />
              </div>
              <div className="hidden sm:block">
                <p style={{ fontSize: "12px", fontWeight: 700, color: "#1a1a1a" }}>{tHeader("superAdmin")}</p>
                <p style={{ fontSize: "10px", color: "#a6aaac" }}>admin@umrahplatform.com</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-6 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
