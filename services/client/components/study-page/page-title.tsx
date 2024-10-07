import React from "react";

interface PageTitleProps {
  title: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return (
    <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-purple-600 dark:text-purple-400">
      {title}
    </h1>
  );
};

export default PageTitle;
