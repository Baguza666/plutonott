import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  poweredByHeader: false,
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
