import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const mediaServerUrl = process.env.MEDIA_SERVER_URL || 'http://localhost:4000';
    return [
      {
        source: '/music/:path*',
        destination: `${mediaServerUrl}/music/:path*`, // Proxy to Media Server
      },
    ];
  },
};

export default nextConfig;
