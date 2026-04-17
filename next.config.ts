import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd39uw1u176mxxs.cloudfront.net',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
