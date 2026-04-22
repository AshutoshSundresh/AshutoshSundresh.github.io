import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ashutoshsundresh.com";
  return [
    { url: base, priority: 1 },
    { url: `${base}/experience`, priority: 0.8 },
    { url: `${base}/experience/coursework`, priority: 0.6 },
    { url: `${base}/llms.txt`, priority: 0.5 },
  ];
}
