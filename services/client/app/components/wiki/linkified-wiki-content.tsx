"use client";

import { useState } from "react";
import { MarkDownViewer } from "@/app/components/mark-down-viewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Spinner } from "@/app/components/spinner";
import { useLinkifiedContent } from "@/hooks/use-wiki-linkifying";

interface Props {
  summary: string;
  lectureId: string;
}

export function LinkifiedWikiContent({ summary, lectureId }: Props) {
  const [isLinkified, setIsLinkified] = useState(false);
  const { linkifiedContent, isLoading, isError } = useLinkifiedContent({
    summary,
    lectureId,
  });

  const toggleLinkification = () => {
    setIsLinkified(!isLinkified);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return <div>Error loading content</div>;
  }

  return (
    <div className="relative">
      <div className="sticky top-0 z-10 bg-background p-2 border-b flex justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={toggleLinkification} size="sm" variant="outline">
                {isLinkified ? (
                  <ArrowLeft className="w-4 h-4 mr-2" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                {isLinkified ? "Revert" : "Find Keywords"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isLinkified
                  ? "Revert to original summary"
                  : "Find and link keywords to Wikipedia"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="mt-4">
        <MarkDownViewer>
          {isLinkified ? (linkifiedContent ?? summary) : summary}
        </MarkDownViewer>
      </div>
    </div>
  );
}
