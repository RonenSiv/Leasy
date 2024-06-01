import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/app/components/Navbar/Navbar";
import { GradientCircle } from "@/app/components/ui/GradientCircle";
import Progress from "@/app/components/ui/Progress";
import { ThemeProvider } from "next-themes";

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
      <body className={`${inter.className}`}>
        <ThemeProvider attribute="class">
          <Suspense>
            <Progress />
          </Suspense>
          <GradientCircle
            dimensions={500}
            position={{ x: "-3%", y: "60%" }}
            duration={15}
          />
          <GradientCircle
            dimensions={1100}
            position={{ x: "40%", y: "-50%" }}
            duration={25}
            reverse
          />
          <div className="flex flex-col items-center justify-start h-screen  relative custom-scrollbar">
            <header>
              <Navbar />
            </header>
            <main className="flex-grow flex-1 flex flex-col items-center justify-center ">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
