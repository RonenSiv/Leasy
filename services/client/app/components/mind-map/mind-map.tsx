"use client";

import { useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  Controls,
  type Edge,
  type Node,
  Position,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { useTheme } from "next-themes";
import { MindMapNode } from "@/app/components/mind-map/mind-map-node";
import { MindMapEdge } from "@/app/components/mind-map/mind-map-edge";

const nodeTypes = {
  custom: MindMapNode,
};

const edgeTypes = {
  custom: MindMapEdge,
};

const NODE_WIDTH = 250;
const NODE_HEIGHT = 100;
const BASE_VERTICAL_SPACING = 40;
const HORIZONTAL_SPACING = NODE_WIDTH * 1.5;

const getNodeColor = (
  parentIndex: number,
  isChild: boolean,
  theme: string,
): string => {
  const hues = Array.from({ length: 10 }, (_, i) => 50 + i * 50);
  const baseHue = hues[parentIndex % hues.length];
  const lightness = isChild
    ? theme === "dark"
      ? "90%"
      : "70%"
    : theme === "dark"
      ? "85%"
      : "65%";
  return `hsl(${baseHue}, 40%, ${lightness})`;
};

const getColorForLevel = (
  baseHue: number,
  level: number,
  theme: string,
): string => {
  const saturation = 40;
  const lightness =
    theme === "dark"
      ? Math.max(90 - level * 5, 60)
      : Math.max(70 - level * 5, 40);
  return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
};

const calculateNodeWeight = (node: any): number => {
  if (!node.children || node.children.length === 0) return 1;
  return (
    1 +
    node.children.reduce(
      (sum: number, child: any) => sum + calculateNodeWeight(child),
      0,
    )
  );
};

// Divide nodes into left and right groups based on their weights.
const divideNodesIntoGroups = (nodes: any[]) => {
  const totalWeight = nodes.reduce(
    (sum, node) => sum + calculateNodeWeight(node),
    0,
  );
  const targetWeight = totalWeight / 2;

  let currentWeight = 0;
  let splitIndex = 0;

  for (let i = 0; i < nodes.length; i++) {
    currentWeight += calculateNodeWeight(nodes[i]);
    if (currentWeight >= targetWeight) {
      splitIndex = i + 1;
      break;
    }
  }

  return {
    leftNodes: nodes.slice(0, splitIndex),
    rightNodes: nodes.slice(splitIndex),
  };
};

// Calculate total height needed for a group of nodes.
const calculateTotalHeight = (nodeGroup: any[]): number => {
  return nodeGroup.reduce((height, node) => {
    const childrenHeight = node.children
      ? node.children.length * NODE_HEIGHT +
        (node.children.length - 1) * BASE_VERTICAL_SPACING
      : 0;
    return (
      height + Math.max(NODE_HEIGHT, childrenHeight) + BASE_VERTICAL_SPACING
    );
  }, 0);
};

// Layout calculation for the mind map. Colors are based on the provided theme.
const calculateLayout = (data: any, theme: string) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Add root node at the center.
  nodes.push({
    id: "root",
    type: "custom",
    position: { x: -NODE_WIDTH / 2, y: -NODE_HEIGHT / 2 },
    data: {
      label: data.title,
      isRoot: true,
      color: "hsl(220, 40%, 85%)",
    },
  });

  // Divide nodes into left and right groups.
  const { leftNodes, rightNodes } = divideNodesIntoGroups(data.nodes);

  // Position nodes and their children.
  const positionNodes = (nodeGroup: any[], isLeft: boolean, startY: number) => {
    let currentY = startY;
    // We'll use a fixed array of hues for top-level nodes.
    const hues = [200, 150, 280, 340];

    nodeGroup.forEach((node: any, index: number) => {
      // Compute baseHue for this top-level node.
      const baseHue = hues[index % hues.length];
      const nodeColor = getNodeColor(index, false, theme);
      const parentX = isLeft
        ? -HORIZONTAL_SPACING - NODE_WIDTH
        : HORIZONTAL_SPACING;

      // Position parent node.
      nodes.push({
        id: node.id.toString(),
        type: "custom",
        position: { x: parentX, y: currentY },
        data: {
          label: node.label,
          description: node.description,
          color: nodeColor,
          sourcePosition: isLeft ? Position.Right : Position.Left,
          targetPosition: isLeft ? Position.Left : Position.Right,
        },
      });

      // Connect parent's node with the root using an edge colored from the baseHue at level 0.
      edges.push({
        id: `e-root-${node.id}`,
        source: isLeft ? node.id.toString() : "root",
        target: isLeft ? "root" : node.id.toString(),
        type: "custom",
        style: { stroke: getColorForLevel(baseHue, 0, theme), strokeWidth: 2 },
      });

      // Position children if any.
      if (node.children && node.children.length > 0) {
        const childSpacing = BASE_VERTICAL_SPACING;
        const totalChildrenHeight =
          node.children.length * NODE_HEIGHT +
          (node.children.length - 1) * childSpacing;
        let childY = currentY - totalChildrenHeight / 2 + NODE_HEIGHT / 2;

        node.children.forEach((child: any) => {
          const childX = isLeft
            ? parentX - HORIZONTAL_SPACING
            : parentX + HORIZONTAL_SPACING;

          nodes.push({
            id: child.id.toString(),
            type: "custom",
            position: { x: childX, y: childY },
            data: {
              label: child.label,
              description: child.description,
              // For child node, use getNodeColor for background.
              color: getNodeColor(index, true, theme),
              sourcePosition: isLeft ? Position.Right : Position.Left,
              targetPosition: isLeft ? Position.Left : Position.Right,
            },
          });

          // Connect child to parent with an edge whose color is derived from baseHue at level 1.
          edges.push({
            id: `e-${node.id}-${child.id}`,
            source: isLeft ? child.id.toString() : node.id.toString(),
            target: isLeft ? node.id.toString() : child.id.toString(),
            type: "custom",
            style: {
              stroke: getColorForLevel(baseHue, 1, theme),
              strokeWidth: 2,
            },
          });

          childY += NODE_HEIGHT + childSpacing;
        });

        currentY += Math.max(
          NODE_HEIGHT + BASE_VERTICAL_SPACING,
          totalChildrenHeight + BASE_VERTICAL_SPACING,
        );
      } else {
        currentY += NODE_HEIGHT + BASE_VERTICAL_SPACING;
      }
    });

    return currentY;
  };

  // Calculate total height needed for both sides.
  const leftHeight = calculateTotalHeight(leftNodes);
  const rightHeight = calculateTotalHeight(rightNodes);
  const maxHeight = Math.max(leftHeight, rightHeight);
  const startY = -maxHeight / 2;

  // Position left and right groups.
  positionNodes(leftNodes, true, startY);
  positionNodes(rightNodes, false, startY);
  return { nodes, edges };
};

export function TreeMindMap(params: any) {
  const data = params.data;
  const { theme } = useTheme();

  // Calculate layout when data or theme changes.
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => calculateLayout(data, theme || "light"),
    [data, theme],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Listen for theme changes and update layout.
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = calculateLayout(
      data,
      theme || "light",
    );
    setNodes(newNodes);
    setEdges(newEdges);
  }, [theme, data, setNodes, setEdges]);

  const onInit = useCallback((reactFlowInstance: any) => {
    reactFlowInstance.fitView({ padding: 0.2 });
  }, []);

  return (
    <div className="w-full h-[85vh] bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={onInit}
        defaultEdgeOptions={{ type: "custom" }}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
        className="bg-background"
      >
        <Controls className="bg-background border-border" />
      </ReactFlow>
    </div>
  );
}
