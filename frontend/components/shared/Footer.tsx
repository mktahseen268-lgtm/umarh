"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/routing";

const PAYMENT_LOGOS = [
  { src: "/images/payments/visa.svg",       alt: "Visa"       },
  { src: "/images/payments/mastercard.svg", alt: "Mastercard" },
  { src: "/images/payments/paypal.svg",     alt: "PayPal"     },
  { src: "/images/payments/applepay.svg",   alt: "Apple Pay"  },
  { src: "/images/payments/stripe.svg",     alt: "Stripe"     },
];

const CURRENCIES = ["U.S. Dollar ($)", "Saudi Riyal (SAR)", "Euro (EUR)", "British Pound (GBP)", "AED ($)"];
const LANGUAGES  = ["English (UK)", "Arabic (SA)"];

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations("footer");
  const isRtl = locale === "ar";

  return (
    <footer dir={isRtl ? "rtl" : "ltr"} style={{ maxWidth: "1920px", margin: "0 auto", width: "100%" }}>
      {/* Main footer — green background */}
      <div style={{ backgroundColor: "#0d7434", padding: "55px 16px", color: "white" }}>
        <div
          className="flex flex-col lg:flex-row justify-between gap-10 mx-auto"
          style={{ maxWidth: "1140px" }}
        >
          {/* Column 1 — Language & Currency */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10">
                <Image src="/images/logo.svg" alt="Umrah Platform" fill className="object-contain brightness-0 invert" />
              </div>
              <span style={{ fontSize: "16px", fontWeight: 700, color: "white" }}>Umrah Platform</span>
            </Link>

            <p style={{ fontSize: "17px", fontWeight: 600, lineHeight: "25.5px", marginBottom: "10px" }}>
              {t("language")}
            </p>
            <div style={{ marginBottom: "20px" }}>
              <select
                defaultValue={locale === "ar" ? LANGUAGES[1] : LANGUAGES[0]}
                className="text-white text-sm rounded px-3 py-2 outline-none"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
              >
                {LANGUAGES.map((l) => (
                  <option key={l} style={{ backgroundColor: "#0d7434" }}>{l}</option>
                ))}
              </select>
            </div>

            <p style={{ fontSize: "17px", fontWeight: 600, lineHeight: "25.5px", marginBottom: "10px" }}>
              {t("currency")}
            </p>
            <div>
              <select
                defaultValue={CURRENCIES[0]}
                className="text-white text-sm rounded px-3 py-2 outline-none"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} style={{ backgroundColor: "#0d7434" }}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Column 2 — Company */}
          <div>
            <p style={{ fontSize: "17px", fontWeight: 600, lineHeight: "25.5px", marginBottom: "20px" }}>
              {t("company")}
            </p>
            <ul>
              {[
                { label: t("aboutUs"),      href: "/about"        },
                { label: t("destinations"), href: "/destinations" },
                { label: t("services"),     href: "/services"     },
                { label: t("flights"),      href: "/packages"     },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{ fontSize: "16px", fontWeight: 400, lineHeight: "35px", color: "white", display: "block" }}
                    className="hover:opacity-75 transition-opacity"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Help */}
          <div>
            <p style={{ fontSize: "17px", fontWeight: 600, lineHeight: "25.5px", marginBottom: "20px" }}>
              {t("help")}
            </p>
            <ul>
              {[
                { label: t("contactUs"),    href: "/contact" },
                { label: t("faqs"),         href: "/faq"     },
                { label: t("terms"),        href: "/terms"   },
                { label: t("privacyPolicy"),href: "/privacy" },
                { label: t("sitemap"),      href: "/sitemap" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{ fontSize: "16px", fontWeight: 400, lineHeight: "35px", color: "white", display: "block" }}
                    className="hover:opacity-75 transition-opacity"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Payment & Social */}
          <div>
            <p style={{ fontSize: "17px", fontWeight: 600, lineHeight: "25.5px", marginBottom: "20px" }}>
              {t("payment")}
            </p>
            <div className="flex gap-1.5 flex-wrap mb-7">
              {PAYMENT_LOGOS.map(({ src, alt }) => (
                <div
                  key={alt}
                  className="bg-white rounded flex items-center justify-center overflow-hidden"
                  style={{ width: "52px", height: "32px", padding: "4px" }}
                  title={alt}
                >
                  <div className="relative w-full h-full">
                    <Image src={src} alt={alt} fill className="object-contain" />
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: "15px", fontWeight: 400, lineHeight: "15px", marginBottom: "29px" }}>
              {t("partner")}
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {[
                { label: "Twitter",   d: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                { label: "Facebook",  d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                { label: "Instagram", d: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 3.5h11a3 3 0 013 3v11a3 3 0 01-3 3h-11a3 3 0 01-3-3v-11a3 3 0 013-3z" },
              ].map(({ label, d }) => (
                <a
                  key={label}
                  href="#"
                  className="flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "white", borderRadius: "50%", width: "44px", height: "44px" }}
                  aria-label={label}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="#0d7434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d={d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar — yellow gradient */}
      <div
        className="text-center"
        style={{
          background: "linear-gradient(90deg, #ffca01 0%, #cebb10 100%)",
          fontSize: "15px",
          fontWeight: 500,
          lineHeight: "22.5px",
          padding: "19px",
          color: "#0f1416",
        }}
      >
        {t("copyright")}
      </div>
    </footer>
  );
}
