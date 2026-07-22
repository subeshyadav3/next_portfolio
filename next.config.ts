import type { NextConfig } from "next";

function getRedirectSource(source: string): string {
  try {
    return new URL(source).pathname;
  } catch {
    return source;
  }
}

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://upload-widget.cloudinary.com https://*.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
  img-src 'self' blob: data: https:;
  font-src 'self' data: https://cdn.jsdelivr.net;
  frame-src 'self' https://www.youtube-nocookie.com https://upload-widget.cloudinary.com https://widget.cloudinary.com https://res.cloudinary.com;
  object-src 'self' https://res.cloudinary.com;
  connect-src 'self' https://api.cloudinary.com https://*.google-analytics.com https://*.googletagmanager.com;
  worker-src 'self' blob:;
  media-src 'self' https:;
`;

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
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ];
  },
  async redirects() {
    try {
      const redirects = require("./lib/blog/redirects.json") as Record<string, string>;
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
