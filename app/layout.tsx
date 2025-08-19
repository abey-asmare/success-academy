import { ToasterProvider } from "@/components/providers/toaster-provider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "./providers/QueryProvider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/";

export const metadata: Metadata = {
  title: {
    template: "%s | Success Academy",
    default: "Success Academy",
  },
  description: "Your Shortcut to success.",
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "Success Academy",
    description: "Your Shortcut to success.",
    type: "website",
    siteName: "Success Academy",
    url: baseUrl,
    images: [
      {
        url: `${baseUrl}/opengraph-image.png`,
        width: 1024,
        height: 1024,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth md:scroll-auto">
        <meta property="og:title" content="Success Academy" />
        <meta property="og:description" content="Your Shortcut to success." />
        <meta
          property="og:image"
          content={`${baseUrl}/opengraph-image.png`}
        />
        <meta property="og:url" content={baseUrl} />
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased `}
        >
          <main>
            <ToasterProvider />
          <NextSSRPlugin
          routerConfig={extractRouterConfig(ourFileRouter)}
        />
            <QueryProvider>{children}</QueryProvider>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
