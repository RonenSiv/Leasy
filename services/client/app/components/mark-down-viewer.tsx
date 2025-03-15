"use client";

import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import { useEffect } from "react";
import "katex/dist/katex.min.css";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export const MarkDownViewer = ({ children }: { children: string }) => {
  // Load KaTeX styles
  useEffect(() => {
    // This is just to ensure the KaTeX styles are loaded
    const link = document.createElement("link");
    if (!document.querySelector('link[href*="katex"]')) {
      link.rel = "stylesheet";
      link.href =
        "https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css";
      document.head.appendChild(link);
    }
    return () => {
      // Clean up is optional since we're checking if it already exists
    };
  }, []);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      className="markdown prose prose-sm max-w-full break-words whitespace-pre-wrap [&>*]:my-0 [&>*+*]:mt-3"
      components={{
        p: ({ children }) => (
          <p
            className="my-0 whitespace-pre-wrap break-words"
            style={{
              overflowWrap: "break-word",
              wordBreak: "normal",
              lineHeight: "1.3",
            }}
          >
            {children}
          </p>
        ),
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mt-4 mb-2 leading-tight">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold mt-3 mb-2 leading-tight">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-bold mt-3 mb-1 leading-tight">
            {children}
          </h3>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-5 my-1 space-y-0.5">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-5 my-1 space-y-0.5">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="my-0 leading-normal" style={{ lineHeight: "1.3" }}>
            {children}
          </li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic">
            {children}
          </blockquote>
        ),
        code: ({ children, ...props }) => (
          <code
            className="px-1 py-0.5 rounded text-sm bg-gray-100 dark:bg-gray-800"
            {...props}
          >
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="p-3 my-2 rounded bg-gray-100 dark:bg-gray-800 overflow-x-auto">
            {children}
          </pre>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};
