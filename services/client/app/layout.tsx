import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/app/components/Navbar";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import GradientCircle from "@/app/components/GradientCircle";

config.autoAddCss = false;

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
      <body className={inter.className}>
        <GradientCircle dimensions={500} position={{ x: "-3%", y: "60%" }} />
        <GradientCircle
          dimensions={1100}
          position={{ x: "40%", y: "-50%" }}
          duration={10}
          reverse
        />
        <div className="relative z-10">
          <Navbar />
          <div className="flex min-h-screen flex-col items-center justify-center">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
