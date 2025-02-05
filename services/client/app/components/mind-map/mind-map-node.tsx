"use client";

import { memo } from "react";
import { Handle, Position } from "reactflow";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleIcon, StarIcon } from "lucide-react";

interface CustomMindMapNodeProps {
  data: {
    label: string;
    description?: string;
    isRoot?: boolean;
    color?: string;
    style?: React.CSSProperties;
  };
}

export const MindMapNode = memo(({ data }: CustomMindMapNodeProps) => {
  if (data.isRoot) {
    return (
      <TooltipProvider>
        <div className="relative">
          <Handle
            type="source"
            position={Position.Right}
            className="!bg-transparent !border-0"
          />
          <Handle
            type="target"
            position={Position.Left}
            className="!bg-transparent !border-0"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-primary shadow-lg border-2 border-primary-foreground/20 max-w-[300px]">
                <div className="flex items-center gap-2">
                  <StarIcon className="w-6 h-6 text-primary-foreground" />
                  <h2 className="text-xl font-bold text-primary-foreground">
                    {data.label}
                  </h2>
                  <StarIcon className="w-6 h-6 text-primary-foreground" />
                </div>
                {data.description && (
                  <p className="text-sm text-primary-foreground/80 text-center">
                    {data.description}
                  </p>
                )}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                  <CircleIcon className="w-6 h-6 text-primary fill-primary" />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              align="start"
              className="p-4 shadow-lg rounded-md border-2 bg-primary"
            >
              <div className="space-y-2">
                <h3 className="font-bold text-base text-primary-foreground">
                  {data.label}
                </h3>
                {data.description && (
                  <p className="text-sm text-primary-foreground/80">
                    {data.description}
                  </p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    );
  }

  // Regular node design
  return (
    <TooltipProvider>
      <div
        className="relative rounded-md transition-all duration-300"
        style={{
          backgroundColor: data.color || "hsl(var(--background))",
          border: "1px solid rgba(0,0,0,0.1)",
          padding: "12px 16px",
          maxWidth: "250px",
          width: "100%",
          color: "hsl(var(--background))",
          borderRadius: "8px",
        }}
      >
        <Handle
          type="target"
          position={Position.Left}
          className="!bg-transparent !border-0"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="space-y-1" style={{ cursor: "pointer" }}>
              <h3 className="text-sm font-medium">{data.label}</h3>
              {data.description && (
                <p className="text-xs text-muted line-clamp-2">
                  {data.description}
                </p>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            align="start"
            className="p-4 shadow-lg rounded-md border-2"
            style={{
              width: "300px",
              zIndex: 9999,
              backgroundColor: data.color || "hsl(var(--background))",
              color: "hsl(var(--background))",
            }}
          >
            <div className="space-y-2">
              <h3 className="font-bold text-base">{data.label}</h3>
              {data.description && (
                <p className="text-sm text-muted">{data.description}</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-transparent !border-0"
        />
      </div>
    </TooltipProvider>
  );
});

MindMapNode.displayName = "MindMapNode";

export default MindMapNode;
