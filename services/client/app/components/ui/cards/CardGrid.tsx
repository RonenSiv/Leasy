import React, { ReactNode } from "react";

interface CardGridProps {
  cols: number;
  children: ReactNode;
  backDrop?: boolean;
  backDropElement?: ReactNode;
  className?: string;
  stretchHorizontal?: boolean;
}

export const CardGrid: React.FC<CardGridProps> = ({
  cols,
  children,
  backDrop,
  backDropElement,
  className,
  stretchHorizontal,
}) => {
  const gridColor = `bg-white border border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:shadow-lg dark:border-gray-700 rounded-lg shadow`;
  const gridColsClass = `relative grid md:grid-flow-col xs:grid-flow-row md:grid-cols-${cols} max-md:py-5 md:flex-row md:px-16 md:min-w-[600px] ${gridColor} items-center ${stretchHorizontal ? "md:w-[90vw] justify-around" : "justify-center"} ${className}`;
  const childrenWithClass = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child as React.ReactElement, {
      className: `${child?.props.className} z-[2]`,
    });
  });
  return (
    <div className={gridColsClass}>
      {backDrop && (
        <div className="absolute inset-0 z-[1]">{backDropElement}</div>
      )}
      {backDrop ? childrenWithClass : children}
    </div>
  );
};
