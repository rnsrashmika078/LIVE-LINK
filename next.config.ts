import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "cdn.bytez.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.bytez.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: false,
  devIndicators: false,
};

export default nextConfig;
