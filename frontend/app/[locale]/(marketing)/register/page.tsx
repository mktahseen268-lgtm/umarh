"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/lib/i18n/routing";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { auth } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();

  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (form.password.length < 8) e.password = t("passwordTooShort");
    if (form.password !== form.confirmPassword) e.confirmPassword = t("passwordsMismatch");
    if (!agreed) e.agreed = "Required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setServerError("");
    setLoading(true);
    try {
      const res = await auth.register({
        first_name:   form.firstName,
        last_name:    form.lastName,
        email:        form.email,
        phone:        form.phone,
        password:     form.password,
        country_code: "",
      });
      setUser(res.data);
      router.push("/");
    } catch (err: any) {
      const msg = err?.response?.data?.detail;
      setServerError(typeof msg === "string" ? msg : "Registration failed. Please try again.");
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
        style={{ maxWidth: "520px", boxShadow: "0 8px 40px rgba(0,0,0,0.10)" }}
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
          <h1 className="text-white font-bold text-2xl mb-1">{t("createAccount")}</h1>
          <p className="text-white/70 text-sm text-center">{t("createAccountSub")}</p>
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
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <User size={17} className="absolute top-1/2 -translate-y-1/2 text-[#a6aaac]" style={{ insetInlineStart: "14px" }} />
                <input
                  type="text"
                  value={form.firstName}
                  onChange={set("firstName")}
                  placeholder={t("firstName")}
                  className="w-full border border-[#e7e6e6] rounded-xl py-3 text-sm outline-none focus:border-[#0d7434] transition-colors placeholder:text-[#a6aaac]"
                  style={{ paddingInlineStart: "42px", paddingInlineEnd: "14px" }}
                />
                {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
              </div>
              <div className="relative">
                <User size={17} className="absolute top-1/2 -translate-y-1/2 text-[#a6aaac]" style={{ insetInlineStart: "14px" }} />
                <input
                  type="text"
                  value={form.lastName}
                  onChange={set("lastName")}
                  placeholder={t("lastName")}
                  className="w-full border border-[#e7e6e6] rounded-xl py-3 text-sm outline-none focus:border-[#0d7434] transition-colors placeholder:text-[#a6aaac]"
                  style={{ paddingInlineStart: "42px", paddingInlineEnd: "14px" }}
                />
                {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <Mail size={17} className="absolute top-1/2 -translate-y-1/2 text-[#a6aaac]" style={{ insetInlineStart: "14px" }} />
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder={t("email")}
                className="w-full border border-[#e7e6e6] rounded-xl py-3 text-sm outline-none focus:border-[#0d7434] transition-colors placeholder:text-[#a6aaac]"
                style={{ paddingInlineStart: "42px", paddingInlineEnd: "14px" }}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone size={17} className="absolute top-1/2 -translate-y-1/2 text-[#a6aaac]" style={{ insetInlineStart: "14px" }} />
              <input
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder={t("phone")}
                className="w-full border border-[#e7e6e6] rounded-xl py-3 text-sm outline-none focus:border-[#0d7434] transition-colors placeholder:text-[#a6aaac]"
                style={{ paddingInlineStart: "42px", paddingInlineEnd: "14px" }}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={17} className="absolute top-1/2 -translate-y-1/2 text-[#a6aaac]" style={{ insetInlineStart: "14px" }} />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
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
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div className="relative">
              <Lock size={17} className="absolute top-1/2 -translate-y-1/2 text-[#a6aaac]" style={{ insetInlineStart: "14px" }} />
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
                placeholder={t("confirmPassword")}
                className="w-full border border-[#e7e6e6] rounded-xl py-3 text-sm outline-none focus:border-[#0d7434] transition-colors placeholder:text-[#a6aaac]"
                style={{ paddingInlineStart: "42px", paddingInlineEnd: "42px" }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute top-1/2 -translate-y-1/2 text-[#a6aaac] hover:text-[#0d7434]"
                style={{ insetInlineEnd: "14px" }}
              >
                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Agree terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 accent-[#0d7434] w-4 h-4 flex-shrink-0 cursor-pointer"
              />
              <span className="text-sm text-[#0f1416]">{t("agreeTerms")}</span>
            </label>
            {errors.agreed && <p className="text-xs text-red-500 -mt-2">You must agree to continue.</p>}

            {serverError && (
              <p className="text-sm text-red-500 text-center -mt-1">{serverError}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary justify-center w-full py-3.5 text-base"
              style={{ borderRadius: "12px" }}
            >
              {loading ? t("registering") : t("register")}
            </button>
          </form>

          {/* Sign in link */}
          <p className="text-center text-sm text-[#a6aaac] mt-6">
            {t("hasAccount")}{" "}
            <Link href="/sign-in" className="text-[#0d7434] font-semibold hover:underline">
              {t("signIn")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
