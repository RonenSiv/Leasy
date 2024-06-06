import React from "react";
import Image from "next/image";

interface ChatBubbleProps {
  text: string;
  from?: "agent" | "user";
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  text,
  from = "agent",
}) => {
  return (
    <div
      className={`flex gap-4 ${from === "user" ? "justify-end" : "justify-start"} w-full`}
    >
      {from === "agent" && (
        <Image
          className="w-14 h-14 rounded-full"
          src={"/oracle.svg"}
          alt="Avatar image"
          width={50}
          height={50}
        />
      )}
      <div
        className={
          from === "user"
            ? `flex flex-col p-4 border border-gray-200 bg-gray-100 rounded-xl dark:bg-gray-700 dark:border-gray-600`
            : "flex flex-col p-4 rounded-xl"
        }
      >
        <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
          {text}
        </p>
      </div>
    </div>
  );
};
