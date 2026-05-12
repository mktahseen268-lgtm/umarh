"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/lib/i18n/routing";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ShoppingCart, Menu, X, Globe } from "lucide-react";

export default function Header() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount] = useState(0);

  const t = useTranslations("nav");

  const toggleLocale = () => {
    const next = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: next });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: t("aboutUs"),  href: "/about"   },
    { label: t("services"), href: "/services" },
    { label: t("packages"), href: "/packages" },
  ];

  return (
    <header
      dir="ltr"
      className="fixed top-0 left-0 right-0 z-[99] bg-white transition-shadow duration-300"
      style={{ boxShadow: scrolled ? "1px 1px 19px 2px rgba(0,0,0,0.11)" : "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      {/* Desktop nav */}
      <div
        className="hidden lg:flex items-center justify-between w-full"
        style={{ padding: "22px 60px" }}
      >
        {/* LEFT — Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="relative" style={{ width: "160px", height: "56px" }}>
            <Image
              src="/images/logo.svg"
              alt="Ministry of Hajj & Umrah"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* CENTER — Nav links */}
        <nav className="flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="transition-colors"
              style={{
                fontSize: "20px",
                fontWeight: 500,
                lineHeight: "30px",
                color: pathname === href ? "#0d7434" : "#0f1416",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* RIGHT — Lang, Search, Cart, Register, Sign In */}
        <div className="flex items-center gap-4">
          {/* Language switcher */}
          <button
            onClick={toggleLocale}
            aria-label="Switch language"
            className="flex items-center gap-1.5 rounded-full px-3 flex-shrink-0 transition-colors hover:bg-[#f0f0f0]"
            style={{ height: "40px", fontSize: "14px", fontWeight: 600, color: "#0d7434", border: "1px solid #0d7434" }}
          >
            <Globe size={15} />
            {locale === "en" ? "AR" : "EN"}
          </button>

          {/* Search — green circle */}
          <button
            aria-label="Search"
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{ width: "40px", height: "40px", backgroundColor: "#0d7434" }}
          >
            <Search size={17} color="white" />
          </button>

          {/* Cart — yellow circle + text */}
          <button
            className="flex items-center gap-2 rounded-full px-3 flex-shrink-0"
            style={{
              height: "40px",
              backgroundColor: "#ffca01",
              border: "none",
              fontSize: "15px",
              fontWeight: 500,
              color: "#0f1416",
            }}
          >
            <ShoppingCart size={17} color="#0f1416" />
            {t("cart")} ({cartCount})
          </button>

          {/* Register — green outline */}
          <Link
            href="/register"
            style={{
              fontSize: "16px",
              fontWeight: 400,
              color: "#0d7434",
              border: "1px solid #0d7434",
              borderRadius: "4px",
              padding: "10px 20px",
              whiteSpace: "nowrap",
            }}
          >
            {t("register")}
          </Link>

          {/* Sign In — green filled */}
          <Link
            href="/sign-in"
            style={{
              fontSize: "16px",
              fontWeight: 400,
              color: "white",
              backgroundColor: "#0d7434",
              border: "1px solid #0d7434",
              borderRadius: "4px",
              padding: "10px 20px",
              whiteSpace: "nowrap",
            }}
          >
            {t("signIn")}
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <div
        className="lg:hidden flex items-center justify-between"
        style={{ padding: "16px 16px", boxShadow: "1px 1px 19px 2px rgba(0,0,0,0.11)" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="relative" style={{ width: "130px", height: "44px" }}>
            <Image src="/images/logo.svg" alt="Umrah Platform" fill className="object-contain object-left" priority />
          </div>
        </Link>
        <button
          className="p-2 text-[#0f1416]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-[#e0e0e0] bg-white overflow-hidden"
          >
            <div className="px-4 py-5 flex flex-col gap-3">
              {navLinks.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="py-2 border-b border-[#e7e6e6]"
                  style={{ fontSize: "16px", fontWeight: 500, color: "#0f1416" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="flex gap-3 pt-2">
                <Link
                  href="/register"
                  className="flex-1 text-center py-2.5 rounded"
                  style={{ border: "1px solid #0d7434", color: "#0d7434", fontSize: "14px" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {t("register")}
                </Link>
                <Link
                  href="/sign-in"
                  className="flex-1 text-center py-2.5 rounded"
                  style={{ backgroundColor: "#0d7434", color: "white", fontSize: "14px" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {t("signIn")}
                </Link>
              </div>
              <button
                onClick={() => { toggleLocale(); setMobileOpen(false); }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded mt-1"
                style={{ border: "1px solid #0d7434", color: "#0d7434", fontSize: "14px", fontWeight: 600 }}
              >
                <Globe size={14} />
                {locale === "en" ? "Switch to Arabic (AR)" : "Switch to English (EN)"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
