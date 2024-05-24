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
  maxWidth?:
    | "xs"
    | "sm"
    | "md"
    | "lg "
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | undefined;
}

export const Card: React.FC<CardProps> = ({
  title,
  titleColor,
  subtitle,
  children,
  footer,
  headerSeparator,
  footerSeparator,
  maxWidth = "xl",
  className,
}) => {
  const widthClass = `max-w-${maxWidth}`;
  return (
    <div
      className={`p-8 m-8 bg-white border border-gray-200 rounded-lg shadow ${widthClass} ${className}`}
    >
      <h5
        className={`mb-2 text-2xl font-bold tracking-tight ${!titleColor ? "text-gray-900" : `text-[${titleColor}]`}`}
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
