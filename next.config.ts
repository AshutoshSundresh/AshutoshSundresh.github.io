import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "i.postimg.cc" },
      { protocol: "https", hostname: "ashutoshsundresh.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "www.freeiconspng.com" },
      { protocol: "https", hostname: "img.freepik.com" },
      { protocol: "https", hostname: "a.ltrbxd.com" },
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "lastfm.freetls.fastly.net" },
      { protocol: "https", hostname: "lastfm-img.freetls.fastly.net" },
      { protocol: "https", hostname: "cdn-images.dzcdn.net" },
      { protocol: "https", hostname: "e-cdns-images.dzcdn.net" },
    ],
  },
};

export default nextConfig;
