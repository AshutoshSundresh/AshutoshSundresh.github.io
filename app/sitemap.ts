import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://ashutoshsundresh.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE_URL}/`, priority: 1 },
    { url: `${BASE_URL}/experience`, priority: 0.8 },
    { url: `${BASE_URL}/experience/coursework`, priority: 0.6 },
    { url: `${BASE_URL}/llms.txt`, priority: 0.5 },
  ];
}
