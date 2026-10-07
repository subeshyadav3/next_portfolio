import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/blog/search", "/pdf-viewer"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
