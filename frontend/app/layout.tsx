import type { Metadata } from "next";
import { Poppins, Volkhov, IBM_Plex_Sans_Arabic } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const volkhov = Volkhov({
  subsets: ["latin"],
  variable: "--font-volkhov",
  weight: ["400", "700"],
  display: "swap",
});

const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-ibm-arabic",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Umrah & Hajj Platform — Ministry of Hajj & Umrah",
    template: "%s | Umrah & Hajj Platform",
  },
  description:
    "Discover and book trusted Umrah and Hajj packages from licensed travel agencies. Compare prices, read reviews, and plan your sacred journey.",
  keywords: ["Umrah", "Hajj", "packages", "Saudi Arabia", "Makkah", "Madinah", "pilgrimage"],
  openGraph: {
    type: "website",
    locale: "en_GB",
    alternateLocale: "ar_SA",
    siteName: "Umrah & Hajj Platform",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env["NEXT_PUBLIC_SITE_URL"] ?? "http://localhost:3005"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const locale = headersList.get("x-next-intl-locale") ?? "ar";
  const isRtl = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isRtl ? "rtl" : "ltr"}
      className={`${poppins.variable} ${volkhov.variable} ${ibmArabic.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-white antialiased font-sans">{children}</body>
    </html>
  );
}
