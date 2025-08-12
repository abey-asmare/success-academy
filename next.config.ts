import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd46msoxdbl.ufs.sh',
      },
      {
        protocol: 'https',
        hostname: '439a0p1xyg.ufs.sh'
      },
    ],
  },
  allowedDevOrigins: ['http://localhost:3000', 'https://success-academy.vercel.app', 'https://unified-mole-badly.ngrok-free.app', 'unified-mole-badly.ngrok-free.app'],
  allowedOrigins: ['http://localhost:3000', 'https://success-academy.vercel.app', 'https://unified-mole-badly.ngrok-free.app', 'unified-mole-badly.ngrok-free.app', 'https://successacademy.et'],
};

export default nextConfig;
