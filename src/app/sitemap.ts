import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.brand.url, lastModified: new Date(site.lastUpdated), changeFrequency: "weekly", priority: 1 },
  ];
}
