import React from "react";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { AiOutlineEnter } from "react-icons/ai";
import TextareaAutosize from "react-textarea-autosize";

export const InputCta = () => {
  return (
    <>
      <label htmlFor="chat" className="sr-only">
        Your message
      </label>
      <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
        <HiChatBubbleLeftRight className="w-6 h-6 text-gray-400 dark:text-gray-500" />
        <TextareaAutosize
          id="chat"
          style={{ resize: "none" }}
          minRows={1}
          maxRows={3}
          className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lgbg-gray-50 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white focus:outline-none"
          placeholder="Your message..."
        />
        <button
          type="submit"
          className="text-gray-900 dark:text-white bg-gray-300 hover:bg-gray-400 focus:outline-none font-medium rounded-lg text-xs px-4 py-2 dark:bg-gray-600 dark:hover:bg-gray-500"
        >
          <AiOutlineEnter className="inline-block w-6 h-6" />
          <span className="sr-only">Send message</span>
        </button>
      </div>
    </>
  );
};
