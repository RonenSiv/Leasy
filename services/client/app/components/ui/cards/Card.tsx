import React from "react";
import { getCardWidth } from "./utils";

export interface CardProps {
  title?: React.ReactNode;
  titleColor?: string;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  headerSeparator?: boolean;
  footerSeparator?: boolean;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | undefined;
  bgColor?: string;
  stretchVertically?: boolean;
  stretchHorizontally?: boolean;
  onExpand?: () => void;
}

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
  stretchVertically,
  stretchHorizontally,
  onExpand,
}) => {
  const width = getCardWidth(maxWidth);
  const classWithBgColor = `relative md:m-8 m-4 p-8 border border-gray-200 rounded-lg shadow ${bgColor ? bgColor : "bg-white dark:bg-gray-800 dark:border-gray-700"} overflow-y-hidden ${className}`;
  const classWithTextColor = `mb-2 text-2xl font-bold tracking-tight ${
    titleColor ? titleColor : "text-gray-900 dark:text-gray-200"
  }`;
  return (
    <div
      className={classWithBgColor}
      style={{
        maxWidth: !stretchVertically ? width : "100%",
        width: !stretchVertically ? undefined : "100%",
        height: !stretchHorizontally ? undefined : "100%",
        minHeight: !stretchHorizontally ? undefined : "100%",
      }}
    >
      {title && <h5 className={classWithTextColor}>{title}</h5>}
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
