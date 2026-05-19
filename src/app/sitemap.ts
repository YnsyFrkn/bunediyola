import type { MetadataRoute } from "next";

import { getPublicCategories, getPublicPosts } from "@/lib/content";
import { getAbsoluteImageUrl, getAbsoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, posts] = await Promise.all([getPublicCategories(), getPublicPosts()]);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: getAbsoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: getAbsoluteUrl("/arama"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    {
      url: getAbsoluteUrl("/hakkimizda"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: getAbsoluteUrl("/iletisim"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: getAbsoluteUrl("/gizlilik-politikasi"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: getAbsoluteUrl("/kvkk-aydinlatma-metni"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: getAbsoluteUrl("/cerez-politikasi"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: getAbsoluteUrl("/kullanim-sartlari"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: getAbsoluteUrl("/reklam-ve-is-birligi"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: getAbsoluteUrl(`/kategori/${category.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: getAbsoluteUrl(`/yazi/${post.slug}`),
    lastModified: new Date(post.createdAt),
    changeFrequency: "weekly",
    priority: 0.9,
    images: [getAbsoluteImageUrl(post.image)],
  }));

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}
