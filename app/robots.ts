import { MetadataRoute } from "next";

const SITE_URL = "https://subeshyadav.com.np";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/search?"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
