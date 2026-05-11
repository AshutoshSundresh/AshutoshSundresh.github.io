import type { NextConfig } from "next";

const IMMUTABLE = "public, max-age=31536000, immutable";
const LONG_LIVED = "public, max-age=86400, stale-while-revalidate=604800";

const nextConfig: NextConfig = {
  images: {
    domains: ['i.ibb.co', 'i.postimg.cc', 'ashutoshsundresh.com', 'raw.githubusercontent.com', 'www.freeiconspng.com', 'img.freepik.com', 'a.ltrbxd.com', 'image.tmdb.org', 'lastfm.freetls.fastly.net'],
  },

  async headers() {
    return [
      {
        // Next.js static chunks are content-hashed — safe to cache forever
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE }],
      },
      {
        // Self-hosted fonts are versioned by filename
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: IMMUTABLE }],
      },
      {
        // Static images — 1 day fresh, serve stale for up to 1 week while revalidating
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: LONG_LIVED }],
      },
      {
        source: "/icons/:path*",
        headers: [{ key: "Cache-Control", value: LONG_LIVED }],
      },
    ];
  },
};

export default nextConfig;
