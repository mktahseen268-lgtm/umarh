import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n/routing";
import type { Metadata } from "next";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr
      ? "منصة العمرة والحج | وزارة الحج والعمرة"
      : "Umrah & Hajj Platform | Ministry of Hajj & Umrah",
    description: isAr
      ? "اكتشف واحجز باقات العمرة والحج الموثوقة من وكالات السفر المرخصة"
      : "Discover and book trusted Umrah and Hajj packages from licensed travel agencies",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ar")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div dir={locale === "ar" ? "rtl" : "ltr"} lang={locale}>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
