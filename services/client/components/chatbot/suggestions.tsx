"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Edit3, HelpCircle, Layout } from "lucide-react";

interface SuggestionsProps {
  onSuggest: (e: React.FormEvent | null, text: string) => void;
}

const suggestions = [
  {
    icon: BookOpen,
    text: "Generate a summary of the book 'To Kill a Mockingbird'",
  },
  {
    icon: Edit3,
    text: "Create a quiz on the French Revolution",
  },
  {
    icon: HelpCircle,
    text: "Explain the key concepts of calculus",
  },
  {
    icon: Layout,
    text: "Help me understand machine learning basics",
  },
];

export default function Suggestions({ onSuggest }: SuggestionsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          className="w-full h-auto flex items-start p-4 space-x-2"
          onClick={() => onSuggest(null, suggestion.text)}
        >
          <suggestion.icon className="h-6 w-6 flex-shrink-0" />
          <div className="flex-1 text-left">
            <span className="text-sm whitespace-normal">{suggestion.text}</span>
          </div>
        </Button>
      ))}
    </div>
  );
}
