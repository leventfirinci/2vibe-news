import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // rss-parser uses Node.js APIs (http, stream) not available in Edge Runtime
  serverExternalPackages: ["rss-parser"],
};

export default nextConfig;
