import { ToasterProvider } from "@/components/providers/toaster-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import "./globals.css";
import QueryProvider from "./providers/QueryProvider";
import { connection } from "next/server";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - Success Academy",
    default: "Success Academy : Your shortcut to success.",
  },
  description:
    "Explore Success Academy’s online courses, The Leading Learning platform in Ethiopa. Flexible, engaging courses for University and pre-university students to achieve their academic success.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth md:scroll-auto">
      <body
        className=
        {`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <Suspense>
          <ClerkProvider>
            <main>
              <ToasterProvider />
              <UTSSR />

              <QueryProvider>
                {children}
                </QueryProvider>
            </main>
          </ClerkProvider>
        </Suspense>
      </body>
    </html>
  );
}

async function UTSSR() {
  await connection();
  return <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />;
}
