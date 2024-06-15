import * as React from "react";

import { useActions, useUIState } from "ai/rsc";
import { toast } from "sonner";
import { UserMessage } from "./messages";
import { type AI } from "@/lib/chat/actions";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEnterSubmit } from "@/hooks/use-enter-submit";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa6";
import { PiArrowElbowDownLeft } from "react-icons/pi";
import Textarea from "react-textarea-autosize";

export function PromptForm({
  input,
  setInput,
}: {
  input: string;
  setInput: (value: string) => void;
}) {
  const router = useRouter();
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const { submitUserMessage } = useActions();
  const [_, setMessages] = useUIState<typeof AI>();

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault();

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target["message"]?.blur();
        }

        try {
          const value = input.trim();
          setInput("");
          if (!value) return;

          // Optimistically add user message UI
          setMessages((currentMessages) => [
            ...currentMessages,
            {
              id: nanoid(),
              display: <UserMessage>{value}</UserMessage>,
            },
          ]);

          // Submit and get response message
          const responseMessage = await submitUserMessage(value);
          setMessages((currentMessages) => [
            ...currentMessages,
            responseMessage,
          ]);
        } catch (error: any) {
          toast.error(error?.message || "An error occurred.");
        }
      }}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-[14px] size-8 rounded-full bg-background p-0 sm:left-4"
              onClick={() => {
                router.push("/new");
              }}
            >
              <FaPlus />
              <span className="sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm "
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoFocus={false}
          name="message"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="absolute right-0 top-[13px] sm:right-4 bg-secondary rounded-lg">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={input === ""}
                className={" bg-secondary p-0 hover:bg-accent"}
              >
                <PiArrowElbowDownLeft
                  className={"size-5 text-secondary-foreground"}
                />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  );
}
