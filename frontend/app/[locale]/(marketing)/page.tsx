import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import Image from "next/image";
import HeroSection          from "@/components/marketing/HeroSection";
import ServicesSection      from "@/components/marketing/ServicesSection";
import DestinationsSection  from "@/components/marketing/DestinationsSection";
import CtaBannerSection     from "@/components/marketing/CtaBannerSection";
import DealsSection         from "@/components/marketing/DealsSection";
import AboutSection         from "@/components/marketing/AboutSection";
import PlanningSection      from "@/components/marketing/PlanningSection";
import WhyChooseUsSection   from "@/components/marketing/WhyChooseUsSection";
import TrendingSection      from "@/components/marketing/TrendingSection";
import AttractionsSection   from "@/components/marketing/AttractionsSection";
import TrustedBrandsSection from "@/components/marketing/TrustedBrandsSection";
import ReviewsSection       from "@/components/marketing/ReviewsSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.hero" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <DestinationsSection />
      <PopularThingsSection />
      <CtaBannerSection />
      <DealsSection />
      <SpecialOffersSection />
      <AboutSection />
      <PlanningSection />
      <WhyChooseUsSection />
      <TrendingSection />
      <AttractionsSection />
      <TrustedBrandsSection />
      <ReviewsSection />
    </>
  );
}

/* ── Popular Things To Do ─────────────────────────────────────────── */
function PopularThingsSection() {
  const t = useTranslations("home.things");

  const THINGS = [
    { label: t("cityTours"),    icon: "/images/icons/city-tour.svg",    href: "/packages?tour_type=city"    },
    { label: t("religionTours"),icon: "/images/icons/religion-tour.svg",href: "/packages?tour_type=religion" },
    { label: t("dayCruises"),   icon: "/images/icons/day-cruises.svg",  href: "/packages?tour_type=cruises"  },
    { label: t("busTours"),     icon: "/images/icons/bus-tours.svg",    href: "/packages?tour_type=bus"      },
    { label: t("foodTours"),    icon: "/images/icons/food-tours.svg",   href: "/packages?tour_type=food"     },
  ];

  return (
    <section className="text-center" style={{ padding: "68px 16px" }}>
      <div className="mb-[50px]">
        <h2 className="section-title">{t("title")}</h2>
        <p className="section-subtitle">{t("subtitle")}</p>
      </div>

      <div
        className="flex flex-wrap justify-center gap-6 mx-auto"
        style={{ maxWidth: "1140px" }}
      >
        {THINGS.map(({ label, icon, href }) => (
          <a
            key={label}
            href={href}
            className="flex flex-col items-center gap-2 cursor-pointer group"
            style={{ maxWidth: "120px", flex: "1 1 100px" }}
          >
            <div
              className="w-16 h-16 rounded-full bg-[#f7f8fc] flex items-center justify-center group-hover:bg-[#0d7434] transition-colors duration-200"
              style={{ border: "1px solid rgba(166,170,172,0.2)" }}
            >
              <div className="relative w-8 h-8">
                <Image src={icon} alt={label} fill className="object-contain group-hover:brightness-0 group-hover:invert transition-all" />
              </div>
            </div>
            <p style={{ fontSize: "16px", fontWeight: 500, color: "#0f1416" }}>{label}</p>
            <p style={{ fontSize: "13px", color: "#a6aaac" }}>100+ Tours</p>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ── Special Offers ───────────────────────────────────────────────── */
function SpecialOffersSection() {
  const t = useTranslations("home.offers");

  const OFFERS = [
    { img: "/images/deals/deal4.jpg", heading: "Last Day is March 13!", text: "Up to 50% Discount on Early Booking" },
    { img: "/images/deals/deal2.jpg", heading: "Last Day is March 13!", text: "Up to 50% Discount on Early Booking" },
    { img: "/images/deals/deal4.jpg", heading: "Last Day is March 13!", text: "Up to 50% Discount on Early Booking" },
    { img: "/images/deals/deal3.jpg", heading: "Last Day is March 13!", text: "Up to 50% Discount on Early Booking" },
    { img: "/images/deals/deal1.jpg", heading: "Last Day is March 13!", text: "Up to 50% Discount on Early Booking" },
    { img: "/images/deals/deal2.jpg", heading: "Last Day is March 13!", text: "Up to 50% Discount on Early Booking" },
  ];

  return (
    <section className="text-center" style={{ padding: "68px 16px" }}>
      <div className="mb-[50px]">
        <h2 className="section-title">{t("title")}</h2>
        <p className="section-subtitle">{t("subtitle")}</p>
      </div>

      <div
        className="flex flex-wrap justify-center gap-4 mx-auto"
        style={{ maxWidth: "1140px" }}
      >
        {OFFERS.map(({ img, heading, text }, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-white cursor-pointer hover:shadow-card transition-shadow"
            style={{
              maxWidth: "308px",
              width: "100%",
              flex: "1 1 260px",
              border: "1px solid #efeeee",
              borderRadius: "8px",
              padding: "15px 20px",
            }}
          >
            <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: "64px", height: "64px" }}>
              <Image src={img} alt={heading} fill className="object-cover" sizes="64px" />
            </div>
            <div className="text-start">
              <p style={{ fontSize: "16px", fontWeight: 600, color: "#0d7434", marginBottom: "4px" }}>{heading}</p>
              <p style={{ fontSize: "13px", fontWeight: 400, color: "#0f1416" }}>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
