import { ToasterProvider } from "@/components/providers/toaster-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import "./globals.css";
import QueryProvider from "./providers/QueryProvider";

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
    default: "Success Academy",
  },
  description: "Explore Success Academy’s online courses.Flexible, engaging learning for University and pre-university students to achieve your academic success.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth md:scroll-auto">
       
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
