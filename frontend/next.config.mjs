import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.cloudfront.net" },
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.s3.amazonaws.com" },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    unoptimized: process.env.NODE_ENV === "development",
  },
  experimental: {
    serverActions: { allowedOrigins: ["localhost:3005"] },
  },
};

export default withNextIntl(nextConfig);
