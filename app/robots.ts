import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/admin/", "/blog/search", "/search?", "/pdf-viewer"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
