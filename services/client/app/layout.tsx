import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutProvider } from "@/providers/layout-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Leasy",
  description: "Learning made easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`} suppressHydrationWarning>
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}
