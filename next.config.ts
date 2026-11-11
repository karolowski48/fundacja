import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // /polityka-prywatnosci/index.html – served correctly by Cloudflare Pages
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
