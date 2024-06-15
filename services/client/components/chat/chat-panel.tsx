"use client";
import * as React from "react";
import { PromptForm } from "@/components/chat/prompt-form";
import { ButtonScrollToBottom } from "@/components/ui/button-scroll-to-bottom";
import { useActions, useAIState, useUIState } from "ai/rsc";
import type { AI } from "@/lib/chat/actions";
import { nanoid } from "nanoid";
import { UserMessage } from "./messages";
import { toast } from "sonner";

export interface ChatPanelProps {
  id?: string;
  title?: string;
  input: string;
  setInput: (value: string) => void;
  isAtBottom: boolean;
  scrollToBottom: () => void;
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
}: ChatPanelProps) {
  const [aiState] = useAIState();
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false);

  const exampleMessages = [
    {
      heading: "What is the main topic",
      subheading: "of this lecture?",
      message: "What is the main topic of this lecture?",
    },
    {
      heading: "Can you explain",
      subheading: "the key points of the lecture?",
      message: "Can you explain the key points of the lecture?",
    },
    {
      heading: "What are the",
      subheading: "main conclusions?",
      message: "What are the main conclusions of the lecture?",
    },
    {
      heading: "Can you provide more details",
      subheading: "about a specific section?",
      message:
        "Can you provide more details about the section on [specific topic]?",
    },
  ];

  return (
    <div className="absolute inset-x-0 bottom-1 z-[100] w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px] bg-red">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {messages.length === 0 &&
            exampleMessages.map((example, index) => (
              <div
                key={example.heading}
                className={`cursor-pointer rounded-lg border p-4 bg-secondary hover:bg-accent ${
                  index > 1 && "hidden md:block"
                }`}
                onClick={async () => {
                  try {
                    setMessages((currentMessages) => [
                      ...currentMessages,
                      {
                        id: nanoid(),
                        display: <UserMessage>{example.message}</UserMessage>,
                      },
                    ]);

                    const responseMessage = await submitUserMessage(
                      example.message,
                    );

                    setMessages((currentMessages) => [
                      ...currentMessages,
                      responseMessage,
                    ]);
                  } catch (error: any) {
                    toast.error(error.message || "An error occurred.");
                  }
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm opacity-70">{example.subheading}</div>
              </div>
            ))}
        </div>

        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm input={input} setInput={setInput} />
        </div>
      </div>
    </div>
  );
}
