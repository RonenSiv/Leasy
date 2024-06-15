import { cn } from "@/lib/utils/utils";
import React from "react";
import { AiOutlineOpenAI } from "react-icons/ai";
import { Spinner } from "@/components/ui/spinner";

export const UserMessage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className={`flex gap-4 "justify-end" w-full`}>
      <div
        className={`flex flex-col p-4 border border-gray-200 bg-gray-100 rounded-xl dark:bg-gray-700 dark:border-gray-600`}
      >
        <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
          {children}
        </p>
      </div>
    </div>
  );
};

export const BotMessage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className={`flex gap-4 "justify-start" w-full`}>
      <div className={`flex flex-col p-4 rounded-xl`}>
        <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
          {children}
        </p>
      </div>
    </div>
  );
};

export function BotCard({
  children,
  showAvatar = true,
}: {
  children: React.ReactNode;
  showAvatar?: boolean;
}) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div
        className={cn(
          "flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm",
          !showAvatar && "invisible",
        )}
      >
        <AiOutlineOpenAI />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  );
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        "mt-2 flex items-center justify-center gap-2 text-xs text-gray-500"
      }
    >
      <div className={"max-w-[600px] flex-initial p-2"}>{children}</div>
    </div>
  );
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <AiOutlineOpenAI />
      </div>
      <div className="ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
        <Spinner />
      </div>
    </div>
  );
}
