"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Building2 } from "lucide-react";
import { auth } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export default function AgencyLoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }

    setLoading(true);
    try {
      const res = await auth.login(email, password);
      const user = res.data;
      const roles: string[] = user.roles ?? [];
      if (!roles.includes("agency_owner")) {
        setError("This account does not have agency access.");
        return;
      }
      setUser(user);
      router.replace(`/${locale}/agency/dashboard`);
    } catch (err: any) {
      const msg = err?.response?.data?.detail;
      setError(typeof msg === "string" ? msg : "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
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
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "rgba(26,188,156,0.15)", border: "1px solid rgba(26,188,156,0.3)" }}>
            <Building2 size={28} className="text-[#1abc9c]" />
          </div>
          <h1 className="text-white font-bold text-2xl mb-1">Agency Portal</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Sign in to manage your packages and bookings
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="relative">
              <Mail size={16} className="absolute top-1/2 -translate-y-1/2" style={{ insetInlineStart: "14px", color: "rgba(255,255,255,0.3)" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Agency email"
                className="w-full rounded-xl py-3 text-sm outline-none transition-all placeholder:text-[rgba(255,255,255,0.25)] text-white"
                style={{ paddingInlineStart: "42px", paddingInlineEnd: "14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={e => (e.target.style.borderColor = "#1abc9c")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={16} className="absolute top-1/2 -translate-y-1/2" style={{ insetInlineStart: "14px", color: "rgba(255,255,255,0.3)" }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl py-3 text-sm outline-none transition-all placeholder:text-[rgba(255,255,255,0.25)] text-white"
                style={{ paddingInlineStart: "42px", paddingInlineEnd: "42px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={e => (e.target.style.borderColor = "#1abc9c")}
                onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute top-1/2 -translate-y-1/2 transition-colors"
                style={{ insetInlineEnd: "14px", color: "rgba(255,255,255,0.3)" }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-center" style={{ color: "#f87171" }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all mt-1"
              style={{ background: loading ? "rgba(26,188,156,0.5)" : "#1abc9c", color: "#071f10", cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Signing in…" : "Sign In to Agency Portal"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: "rgba(255,255,255,0.35)" }}>
          Not an agency?{" "}
          <Link href={`/${locale}/sign-in`} className="font-semibold hover:underline" style={{ color: "rgba(255,255,255,0.6)" }}>
            Customer sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
