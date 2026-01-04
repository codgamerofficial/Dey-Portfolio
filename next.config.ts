import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/music/:path*',
        destination: 'http://localhost:4000/music/:path*', // Proxy to Media Server
      },
    ];
  },
};

export default nextConfig;
