import React from "react";

export const SettingsCard = ({
  prefix,
  title,
  isSelected = false,
  onClick,
}: {
  prefix?: React.ReactNode;
  title: string;
  isSelected?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div
      className="relative flex items-center gap-2 rounded-lg  px-2 py-2 hover:bg-accent hover:cursor-pointer transition-colors duration-200"
      onClick={onClick}
    >
      {isSelected && (
        <div className="absolute z-[100] -left-2 w-1 h-1/2 rounded-lg bg-link-hover"></div>
      )}
      {prefix}
      <span>{title}</span>
    </div>
  );
};
