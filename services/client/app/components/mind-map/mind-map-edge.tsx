"use client";

import { memo } from "react";
import { type EdgeProps, getBezierPath } from "reactflow";

export const MindMapEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
  }: EdgeProps) => {
    const [edgePath] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    return (
      <>
        {/* Glow effect */}
        <path
          id={id}
          className="react-flow__edge-path-glow"
          d={edgePath}
          strokeWidth={10}
          stroke="rgba(var(--primary) / 0.1)"
          fill="none"
        />

        {/* Main edge */}
        <path
          id={id}
          className="react-flow__edge-path"
          d={edgePath}
          strokeWidth={2}
          stroke="hsl(var(--primary))"
          fill="none"
          markerEnd={markerEnd}
        />
      </>
    );
  },
);
