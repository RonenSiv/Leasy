"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { CornerRightUp, Loader2, Paperclip } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TextareaAutosize from "react-textarea-autosize";

interface InputFormProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent | null, messageContent?: string) => void;
  isLoading: boolean;
  isUploading: boolean;
  handleFileUpload: (file: File) => void;
}

export default function InputForm({
  input,
  setInput,
  handleSubmit,
  isLoading,
  isUploading,
  handleFileUpload,
}: InputFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="mt-4">
      <div className="relative flex items-end border border-input rounded-md px-3 min-h-[40px]">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-2"
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Paperclip className="h-4 w-4" />
                )}
                <span className="sr-only">Attach file</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Attach file</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          className="hidden"
          accept=".txt,.pdf,.doc,.docx"
        />
        <TextareaAutosize
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          placeholder="Ask Leasy AI Tutor..."
          className="w-full pl-12 mr-12 resize-none overflow-y-auto bg-background py-2 px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50"
          minRows={1}
          maxRows={5}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CornerRightUp className="h-4 w-4" />
                )}
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Send message</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </form>
  );
}
