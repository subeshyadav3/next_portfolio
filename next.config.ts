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
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://upload-widget.cloudinary.com https://*.googletagmanager.com https://pagead2.googlesyndication.com https://*.googlesyndication.com https://googleads.g.doubleclick.net https://*.google.com https://partner.googleadservices.com https://tpc.googlesyndication.com;
  style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com;
  img-src 'self' blob: data: https:;
  font-src 'self' data: https://cdn.jsdelivr.net https://fonts.gstatic.com;
  frame-src 'self' https://www.youtube-nocookie.com https://upload-widget.cloudinary.com https://widget.cloudinary.com https://res.cloudinary.com https://drive.google.com https://docs.google.com https://*.google.com https://*.googleusercontent.com https://googleads.g.doubleclick.net https://*.googlesyndication.com https://tpc.googlesyndication.com;
  object-src 'self' https://res.cloudinary.com;
  connect-src 'self' https://api.cloudinary.com https://*.google-analytics.com https://*.googletagmanager.com https://*.googleadservices.com https://*.googlesyndication.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.google.com https://drive.google.com;
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
