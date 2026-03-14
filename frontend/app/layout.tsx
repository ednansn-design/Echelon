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
      <body className={`${inter.className} bg-slate-50 min-h-[100dvh] flex flex-col`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
