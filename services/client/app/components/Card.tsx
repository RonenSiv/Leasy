import React from "react";

interface CardProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  headerSeparator?: boolean;
  footerSeparator?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  headerSeparator,
  footerSeparator,
}) => {
  return (
    <div className="p-8 bg-white border border-gray-200 rounded-lg shadow max-w-xl">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
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
