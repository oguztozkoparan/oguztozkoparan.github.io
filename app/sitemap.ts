import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { site } from "@/lib/data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: site.url, priority: 1 },
    { url: `${site.url}/work`, priority: 0.9 },
    { url: `${site.url}/about`, priority: 0.8 },
    { url: `${site.url}/blog`, priority: 0.8 },
    { url: `${site.url}/contact`, priority: 0.7 },
    { url: `${site.url}/dos`, priority: 0.5 },
    { url: `${site.url}/games`, priority: 0.5 },
  ];

  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: post.date,
    priority: 0.6,
  }));

  return [...pages, ...posts];
}
