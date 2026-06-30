import type { NextConfig } from "next";

function getRedirectSource(source: string): string {
  try {
    return new URL(source).pathname;
  } catch {
    return source;
  }
}

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
        source: getRedirectSource(source),
        destination,
        permanent: true,
      }));
    } catch {
      return [];
    }
  },
};

export default nextConfig;
