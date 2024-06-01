import React, { ReactNode } from "react";

interface CardGridProps {
  cols: number;
  children: ReactNode;
}

export const CardGrid: React.FC<CardGridProps> = ({ cols, children }) => {
  const gridColsClass = `grid md:grid-flow-col xs:grid-flow-row grid-cols-${cols} max-lg:py-5 bg-white border border-gray-200 rounded-lg shadow md:flex-row px-16 md:min-w-[600px] dark:bg-gray-800 dark:text-gray-200 dark:shadow-lg dark:border-gray-700`;

  return <div className={gridColsClass}>{children}</div>;
};
