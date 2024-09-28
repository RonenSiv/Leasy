import * as React from "react";
import { cn } from "@/lib/utils/utils";

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "sm" | "md" | "lg";
  type?: "normal" | "code" | "lead" | "muted" | "quote";
  tagName?: "p" | "span" | "div";
  children: React.ReactNode;
}

const sizeClasses = {
  sm: "text-sm font-medium leading-none",
  md: "text-base font-medium",
  lg: "text-lg font-semibold",
};

const typeClasses = {
  normal: "",
  code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
  lead: "text-xl text-muted-foreground",
  muted: "text-sm text-muted-foreground",
  quote: "mt-6 border-l-2 pl-6 italic",
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
  type,
  children,
  ...props
}: {
  type: string;
  children: React.ReactNode;
  [key: string]: any;
}) => {
  switch (type) {
    case "normal":
      return (
        <Tag tagName="p" {...props}>
          {children}
        </Tag>
      );
    case "code":
      return (
        <Tag tagName="code" {...props}>
          {children}
        </Tag>
      );
    case "lead":
      return (
        <Tag tagName="p" {...props}>
          {children}
        </Tag>
      );
    case "muted":
      return (
        <Tag tagName="p" {...props}>
          {children}
        </Tag>
      );
    case "quote":
      return (
        <Tag tagName="blockquote" {...props}>
          {children}
        </Tag>
      );
  }
};

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, type = "normal", tagName = "div", size = "md", ...props }) => {
    return (
      <Tag
        tagName={tagName}
        {...props}
        className={cn(typeClasses[type], sizeClasses[size], className)}
      >
        <Type type={type} {...props}>
          {props.children}
        </Type>
      </Tag>
    );
  },
);
Text.displayName = "Text";

export { Text };
