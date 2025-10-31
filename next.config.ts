import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d46msoxdbl.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "439a0p1xyg.ufs.sh",
      },
    ],
  },
  allowedDevOrigins: [
    "http://localhost:3000",
    "https://success-academy.vercel.app",
    "https://unified-mole-badly.ngrok-free.app",
    "unified-mole-badly.ngrok-free.app",
    "passage-knee-keywords-comedy.trycloudflare.com",
    // 'https://vanguard-gules.vercel.app'

  ],
  // to use caching behavior (use cache and unsable_cache) it has to be enabled
  cacheComponents: true,
}

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "success-academy",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
