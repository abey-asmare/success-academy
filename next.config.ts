import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd46msoxdbl.ufs.sh',
      },
    ],
  },
};

export default nextConfig;
