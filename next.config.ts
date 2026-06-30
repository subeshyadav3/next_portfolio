import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blogger.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    try {
      const redirects = require("./data/redirects.json") as Record<string, string>;
      return Object.entries(redirects).map(([source, destination]) => ({
        source: new URL(source).pathname,
        destination,
        permanent: true,
      }));
    } catch {
      return [];
    }
  },
};

export default nextConfig;
