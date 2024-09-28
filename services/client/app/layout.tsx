import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { LayoutProvider } from "@/providers/layout-provider";

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
      <LayoutProvider>{children}</LayoutProvider>
    </html>
  );
}
