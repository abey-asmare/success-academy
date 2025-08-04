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
  allowedDevOrigins: ['http://localhost:3000', 'https://success-academy.vercel.app', 'https://unified-mole-badly.ngrok-free.app', 'unified-mole-badly.ngrok-free.app'],
  reactComponentAnnotation: {
    enabled: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
