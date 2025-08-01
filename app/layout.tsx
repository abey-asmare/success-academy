import { ToasterProvider } from "@/components/providers/toaster-provider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Success Academy",
  description: "Your Shortcut to success.",
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
        <ToasterProvider/>
        <QueryProvider>
          {children}
        </QueryProvider>
        </main>
      </body>
    </html>
    </ClerkProvider>
  );
}
