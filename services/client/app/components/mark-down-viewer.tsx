import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import React from "react";

export const MarkDownViewer = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      className="markdown prose max-w-full break-words whitespace-pre-wrap"
      components={{
        p: ({ children }) => (
          <p
            className="mb-4 whitespace-pre-wrap break-words"
            style={{
              overflowWrap: "break-word",
              wordBreak: "normal",
            }}
          >
            {children}
          </p>
        ),
        code: ({ children, ...props }) => (
          <code
            className={"block overflow-x-auto whitespace-pre-wrap break-words"}
            {...props}
            style={{
              overflowWrap: "break-word",
              wordBreak: "normal",
            }}
          >
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre
            className="overflow-x-auto max-w-full whitespace-pre-wrap break-words"
            style={{
              overflowWrap: "break-word",
              wordBreak: "normal",
            }}
          >
            {children}
          </pre>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};
