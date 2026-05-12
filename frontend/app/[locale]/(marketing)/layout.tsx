import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-[90px] lg:pt-[96px]">{children}</main>
      <Footer />
    </>
  );
}
