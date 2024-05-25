import React from "react";

interface CardProps {
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

  return (
    <div
      className={`p-8 m-8 border border-gray-200 rounded-lg shadow bg-white ${className}`}
      style={{
        backgroundColor: bgColor,
        maxWidth: width,
      }}
    >
      <h5
        className={`mb-2 text-2xl font-bold tracking-tight `}
        style={{ color: titleColor }}
      >
        {title}
      </h5>
      {subtitle}
      {headerSeparator && <hr />}
      {children}
      {footerSeparator && <hr />}
      {footer}
    </div>
  );
};
