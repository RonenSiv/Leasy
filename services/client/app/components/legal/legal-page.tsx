import { motion } from "framer-motion";
import { useSettings } from "@/context/settings-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface LegalPageProps {
  title: string;
  content: string;
}

export function LegalPage({ title, content }: LegalPageProps) {
  const { reduceMotion } = useSettings();

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        className="text-center mb-16"
        initial={reduceMotion ? {} : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
      </motion.div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Table of Contents</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <a
                  href={`#${children?.toString().toLowerCase().replace(/\s+/g, "-")}`}
                  className="block text-primary hover:underline mb-2"
                >
                  {children}
                </a>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <Card className="max-w-4xl mx-auto">
        <CardContent className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2
                  id={children?.toString().toLowerCase().replace(/\s+/g, "-")}
                  className="scroll-mt-20"
                >
                  {children}
                </h2>
              ),
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  );
}
