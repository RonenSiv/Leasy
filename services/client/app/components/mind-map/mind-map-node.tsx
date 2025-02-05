"use client";

import { memo } from "react";
import { Handle, Position } from "reactflow";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CustomMindMapNodeProps {
  data: {
    label: string;
    description?: string;
    isRoot?: boolean;
    color?: string;
  };
}

export const MindMapNode = memo(({ data }: CustomMindMapNodeProps) => {
  return (
    <TooltipProvider>
      <div
        className="relative rounded-md transition-all duration-300"
        style={{
          backgroundColor: data.color || "hsl(var(--background))",
          border: "1px solid rgba(0,0,0,0.1)",
          padding: "12px 16px",
          maxWidth: "250px", // Match NODE_WIDTH
          width: "100%",
          color: "hsl(var(--background))",
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
              <h3
                className={`font-medium ${data.isRoot ? "text-base" : "text-sm"}`}
              >
                {data.label}
              </h3>
              {data.description && (
                <p
                  className="text-xs text-muted-foreground line-clamp-2"
                  style={{ color: "hsl(var(--text-muted))" }}
                >
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
