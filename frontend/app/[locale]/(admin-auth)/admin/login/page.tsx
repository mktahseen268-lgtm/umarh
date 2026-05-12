"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) ?? "en";
  const t = useTranslations("admin.login");
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }

    setError("");
    setLoading(true);
    try {
      const res = await apiClient.post("/admin/login", { email, password });
      setUser(res.data);
      router.replace(`/${locale}/admin`);
    } catch (err: any) {
      const msg = err?.response?.data?.detail;
      setError(typeof msg === "string" ? msg : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #071f10 0%, #0a2e18 50%, #163d24 100%)" }}
    >
      {/* Subtle background circles */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute rounded-full"
          style={{ width: 480, height: 480, background: "rgba(26,188,156,0.06)", top: "-120px", right: "-120px" }} />
        <div className="absolute rounded-full"
          style={{ width: 320, height: 320, background: "rgba(26,188,156,0.04)", bottom: "-80px", left: "-80px" }} />
      </div>

      <div className="relative w-full" style={{ maxWidth: "420px" }}>
        {/* Language switcher */}
        <div className="flex justify-center gap-2 mb-5">
          {(["en", "ar"] as const).map((lng) => (
            <Link
              key={lng}
              href={`/${lng}/admin/login`}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{
                backgroundColor: locale === lng ? "rgba(26,188,156,0.25)" : "rgba(255,255,255,0.07)",
                color: locale === lng ? "#1abc9c" : "rgba(255,255,255,0.4)",
                border: locale === lng ? "1px solid rgba(26,188,156,0.4)" : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {lng === "en" ? "English" : "العربية"}
            </Link>
          ))}
        </div>

        {/* Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.5)", background: "rgba(255,255,255,0.035)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Header */}
          <div className="flex flex-col items-center pt-10 pb-6 px-8">
            <div
              className="flex items-center justify-center rounded-2xl mb-5"
              style={{ width: 58, height: 58, background: "linear-gradient(135deg, #1abc9c 0%, #0d7434 100%)", boxShadow: "0 8px 24px rgba(26,188,156,0.35)" }}
            >
              <ShieldCheck size={28} color="#fff" />
            </div>
            <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: 800, letterSpacing: "-0.01em" }}>
              {t("title")}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginTop: "4px" }}>
              {t("subtitle")}
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div className="relative">
                <Mail
                  size={16}
                  style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "14px", color: "rgba(255,255,255,0.3)" }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("email")}
                  autoComplete="username"
                  style={{
                    width: "100%", paddingLeft: "42px", paddingRight: "14px",
                    paddingTop: "12px", paddingBottom: "12px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px", color: "#fff", fontSize: "14px", outline: "none",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(26,188,156,0.6)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock
                  size={16}
                  style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "14px", color: "rgba(255,255,255,0.3)" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("password")}
                  autoComplete="current-password"
                  style={{
                    width: "100%", paddingLeft: "42px", paddingRight: "44px",
                    paddingTop: "12px", paddingBottom: "12px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px", color: "#fff", fontSize: "14px", outline: "none",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(26,188,156,0.6)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", right: "14px", color: "rgba(255,255,255,0.35)", background: "none", border: "none", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="text-sm text-center py-2.5 px-4 rounded-xl"
                  style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200"
                style={{
                  background: loading ? "rgba(26,188,156,0.5)" : "linear-gradient(135deg, #1abc9c 0%, #0d9e80 100%)",
                  color: "#fff",
                  boxShadow: loading ? "none" : "0 8px 24px rgba(26,188,156,0.3)",
                  cursor: loading ? "not-allowed" : "pointer",
                  border: "none",
                }}
              >
                {loading ? t("loading") : t("submit")}
              </button>
            </form>

            <p className="text-center mt-6" style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
              {t("restricted")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
