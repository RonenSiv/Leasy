import * as React from "react";
import { cn } from "@/lib/utils/utils";

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

const sizeClasses = {
  xl: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  lg: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  md: "scroll-m-20 text-2xl font-semibold tracking-tight",
  sm: "scroll-m-20 text-xl font-semibold tracking-tight",
};

const Tag = ({
  tagName,
  children,
  ...props
}: {
  tagName: string;
  children: React.ReactNode;
  [key: string]: any;
}) => {
  const Tag = tagName as keyof JSX.IntrinsicElements;
  return <Tag {...props}>{children}</Tag>;
};

const Type = ({
  size,
  children,
  ...props
}: {
  size: string;
  children: React.ReactNode;
  [key: string]: any;
}) => {
  switch (size) {
    case "xs":
      return (
        <Tag tagName="h4" {...props}>
          {children}
        </Tag>
      );
    case "md":
      return (
        <Tag tagName="h3" {...props}>
          {children}
        </Tag>
      );
    case "lg":
      return (
        <Tag tagName="h2" {...props}>
          {children}
        </Tag>
      );
    case "xl":
      return (
        <Tag tagName="h1" {...props}>
          {children}
        </Tag>
      );
    default:
      return (
        <Tag tagName="h3" {...props}>
          {children}
        </Tag>
      );
  }
};

const Header = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, size = "md", ...props }) => {
    return (
      <Type size={size} {...props} className={cn(sizeClasses[size], className)}>
        {props.children}
      </Type>
    );
  },
);
Header.displayName = "Header";

export { Header };
