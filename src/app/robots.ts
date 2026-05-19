import type { MetadataRoute } from "next";

import { getAbsoluteUrl, getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/profil", "/login", "/giris", "/kayit", "/reset-password"],
    },
    sitemap: getAbsoluteUrl("/sitemap.xml"),
    host: getSiteUrl(),
  };
}
