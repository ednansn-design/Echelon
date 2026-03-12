import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter from next/font optimization
import "./globals.css";
import React from "react";
import { AuthProvider } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Echelon - Swipe. Apply. Fund Your Future.",
  description: "The Tinder for Scholarships. Match with scholarships you can actually win.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${inter.className} bg-slate-900 min-h-[100dvh] flex items-center justify-center`}>
        {/* Mobile Frame Wrapper for Demo */}
        <div className="w-full min-h-[100dvh] sm:min-h-0 sm:h-[850px] sm:max-h-[90vh] sm:w-[393px] sm:rounded-[40px] sm:shadow-2xl sm:overflow-hidden sm:border-[8px] sm:border-slate-800 bg-slate-50 relative flex flex-col transform-gpu">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
