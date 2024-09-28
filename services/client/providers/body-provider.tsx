"use client";
import { useEffect } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const BodyProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Apply the saved font and font size from localStorage
    const savedFont = localStorage.getItem("font") || inter.className;
    const savedFontSize = localStorage.getItem("fontSize") || "medium";

    document.body.style.fontFamily = savedFont;
    document.body.style.fontSize =
      savedFontSize === "small"
        ? "14px"
        : savedFontSize === "large"
          ? "18px"
          : "16px";
  }, []);

  return (
    <body className={`${inter.className}`} suppressHydrationWarning>
      {children}
    </body>
  );
};
