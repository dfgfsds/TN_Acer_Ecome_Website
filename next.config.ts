import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn1.smartprix.com',
      },
      {
        protocol: 'https',
        hostname: 'test-ecomapi.justvy.in',
      }
    ],
  },
};

export default nextConfig;
