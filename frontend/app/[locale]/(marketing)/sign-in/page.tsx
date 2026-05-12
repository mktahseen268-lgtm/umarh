"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/lib/i18n/routing";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { auth } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export default function SignInPage() {
  const t = useTranslations("auth");
  const router = useRouter();

  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await auth.login(email, password);
      setUser(res.data);
      const roles: string[] = res.data.roles ?? [];
      if (roles.includes("agency_owner")) {
        router.push("/agency/dashboard");
      } else {
        router.push("/");
      }
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
      style={{ background: "linear-gradient(135deg, #f0faf4 0%, #fff 60%, #fffbea 100%)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-white rounded-2xl overflow-hidden"
        style={{ maxWidth: "460px", boxShadow: "0 8px 40px rgba(0,0,0,0.10)" }}
      >
        {/* Green header strip */}
        <div
          className="flex flex-col items-center justify-center py-8 px-6"
          style={{ background: "#0d7434" }}
        >
          <Link href="/">
            <div className="relative mb-3" style={{ width: "130px", height: "46px" }}>
              <Image
                src="/images/logo.svg"
                alt="Umrah Platform"
                fill
                className="object-contain brightness-0 invert"
                priority
              />
            </div>
          </Link>
          <h1 className="text-white font-bold text-2xl mb-1">{t("welcomeBack")}</h1>
          <p className="text-white/70 text-sm text-center">{t("welcomeBackSub")}</p>
        </div>

        <div className="p-8">
          {/* Social auth buttons */}
          <div className="flex flex-col gap-3 mb-6">
            {[
              { label: t("continueGoogle"),   icon: "G",  bg: "#fff",   color: "#0f1416", border: "#e0e0e0" },
              { label: t("continueFacebook"), icon: "f",  bg: "#1877F2",color: "#fff",    border: "#1877F2" },
            ].map(({ label, icon, bg, color, border }) => (
              <button
                key={label}
                type="button"
                className="flex items-center justify-center gap-3 w-full py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-85"
                style={{ backgroundColor: bg, color, border: `1px solid ${border}` }}
              >
                <span className="font-bold text-base">{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#e7e6e6]" />
            <span className="text-sm text-[#a6aaac]">{t("orEmail")}</span>
            <div className="flex-1 h-px bg-[#e7e6e6]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="relative">
              <Mail size={17} className="absolute top-1/2 -translate-y-1/2 text-[#a6aaac]" style={{ insetInlineStart: "14px" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("email")}
                className="w-full border border-[#e7e6e6] rounded-xl py-3 text-sm outline-none focus:border-[#0d7434] transition-colors placeholder:text-[#a6aaac]"
                style={{ paddingInlineStart: "42px", paddingInlineEnd: "14px" }}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={17} className="absolute top-1/2 -translate-y-1/2 text-[#a6aaac]" style={{ insetInlineStart: "14px" }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("password")}
                className="w-full border border-[#e7e6e6] rounded-xl py-3 text-sm outline-none focus:border-[#0d7434] transition-colors placeholder:text-[#a6aaac]"
                style={{ paddingInlineStart: "42px", paddingInlineEnd: "42px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-1/2 -translate-y-1/2 text-[#a6aaac] hover:text-[#0d7434]"
                style={{ insetInlineEnd: "14px" }}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end -mt-2">
              <Link
                href="/forgot-password"
                className="text-sm text-[#0d7434] hover:underline"
              >
                {t("forgotPassword")}
              </Link>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-sm text-red-500 text-center -mt-1">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary justify-center w-full py-3.5 text-base"
              style={{ borderRadius: "12px" }}
            >
              {loading ? t("signingIn") : t("signIn")}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-[#a6aaac] mt-6">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-[#0d7434] font-semibold hover:underline">
              {t("register")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
