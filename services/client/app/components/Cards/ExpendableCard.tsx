import React, { useState } from "react";
import { useTheme } from "next-themes";
import { FaCompressAlt, FaExpandAlt } from "react-icons/fa";
import { CardProps } from "@/app/components/Cards/Card";
import { getCardWidth } from "@/app/components/Cards/utils";

export const ExpendableCard: React.FC<CardProps> = ({
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
  stretchVertically,
  stretchHorizontally,
}) => {
  const width = getCardWidth(maxWidth);
  const { systemTheme, theme, setTheme } = useTheme();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div
      className={`absolute ${isFullScreen ? "inset-0 z-50" : "relative m-8"} p-8 border border-gray-200 rounded-lg shadow bg-white dark:bg-gray-800 dark:border-gray-700 overflow-y-hidden ${className}`}
      style={{
        backgroundColor: theme === "light" ? bgColor?.[0] : bgColor?.[1],
        maxWidth: !stretchVertically ? width : "100%",
        width: !stretchVertically ? undefined : "100%",
        height: !stretchHorizontally ? undefined : "100%",
        minHeight: !stretchHorizontally ? undefined : "100%",
      }}
    >
      <button
        className="absolute top-0 right-0 p-2 m-2 z-[100] text-gray-400 dark:text-gray-500 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-100 rounded-full"
        onClick={toggleFullScreen}
      >
        {isFullScreen ? <FaCompressAlt /> : <FaExpandAlt />}
      </button>
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
