"use client";
import React from "react";
import { useTheme } from "next-themes";

interface CardProps {
  title?: React.ReactNode;
  titleColor?: string[];
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  headerSeparator?: boolean;
  footerSeparator?: boolean;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | undefined;
  bgColor?: string[];
}

const getCardWidth = (maxWidth: string | undefined) => {
  switch (maxWidth) {
    case "sm":
      return "640px";
    case "md":
      return "760px";
    case "lg":
      return "1024px";
    case "xl":
      return "1280px";
    case "2xl":
      return "1536px";
    case "3xl":
      return "1920px";
    default:
      return "1024px";
  }
};

export const Card: React.FC<CardProps> = ({
  title,
  titleColor,
  subtitle,
  children,
  footer,
  headerSeparator,
  footerSeparator,
  maxWidth,
  bgColor,
  className,
}) => {
  const width = getCardWidth(maxWidth);
  const { systemTheme, theme, setTheme } = useTheme();
  return (
    <div
      className={`p-8 m-8 border border-gray-200 rounded-lg shadow bg-white dark:bg-gray-800 dark:border-gray-700 ${className}`}
      style={{
        backgroundColor: theme === "light" ? bgColor?.[0] : bgColor?.[1],
        maxWidth: width,
      }}
    >
      <h5
        className={`mb-2 text-2xl font-bold tracking-tight dark:text-gray-200`}
        style={{ color: theme === "light" ? titleColor?.[0] : titleColor?.[1] }}
      >
        {title}
      </h5>
      {subtitle}
      {headerSeparator && (
        <hr className="border-gray-300 dark:border-gray-600" />
      )}
      {children}
      {footerSeparator && (
        <hr className="border-gray-300 dark:border-gray-600" />
      )}
      {footer}
    </div>
  );
};
