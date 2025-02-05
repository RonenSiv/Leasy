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
import { MindMapNode } from "@/app/components/mind-map/mind-map-node";
import { MindMapEdge } from "@/app/components/mind-map/mind-map-edge";
import { DATA } from "@/mocks/constants";
import { useTheme } from "next-themes";

const nodeTypes = {
  custom: MindMapNode,
};

const edgeTypes = {
  custom: MindMapEdge,
};

const NODE_WIDTH = 250;
const NODE_HEIGHT = 100;
const BASE_VERTICAL_SPACING = 40;
const LEVEL_HORIZONTAL_OFFSET = NODE_WIDTH * 2;

// Color palettes for different themes
const COLOR_PALETTES = {
  light: [
    { base: "hsl(210, 70%, 40%)", child: "hsl(210, 60%, 30%)" },
    { base: "hsl(340, 70%, 40%)", child: "hsl(340, 60%, 30%)" },
    { base: "hsl(150, 70%, 40%)", child: "hsl(150, 60%, 30%)" },
    { base: "hsl(50, 70%, 40%)", child: "hsl(50, 60%, 30%)" },
    { base: "hsl(280, 70%, 40%)", child: "hsl(280, 60%, 30%)" },
  ],
  dark: [
    { base: "hsl(210, 85%, 75%)", child: "hsl(210, 75%, 85%)" },
    { base: "hsl(340, 85%, 75%)", child: "hsl(340, 75%, 85%)" },
    { base: "hsl(150, 85%, 75%)", child: "hsl(150, 75%, 85%)" },
    { base: "hsl(50, 85%, 75%)", child: "hsl(50, 75%, 85%)" },
    { base: "hsl(280, 85%, 75%)", child: "hsl(280, 75%, 85%)" },
  ],
};

const getNodeColor = (
  parentIndex: number,
  isChild: boolean,
  theme: string | undefined,
) => {
  const isDark = theme === "dark";
  const palette = COLOR_PALETTES[isDark ? "dark" : "light"];
  const colors = palette[parentIndex % palette.length];
  return isChild ? colors.child : colors.base;
};

const getRootNodeStyle = (theme: string | undefined) => {
  const isDark = theme === "dark";
  return {
    backgroundColor: isDark ? "hsl(var(--primary))" : "hsl(var(--primary))",
    borderRadius: "16px",
    boxShadow: isDark
      ? "0 0 20px rgba(255, 255, 255, 0.2)"
      : "0 4px 12px rgba(0, 0, 0, 0.1)",
    border: isDark
      ? "2px solid rgba(255, 255, 255, 0.2)"
      : "2px solid rgba(0, 0, 0, 0.1)",
    padding: "16px 24px",
    transform: "scale(1.1)",
  };
};

// Previous helper functions remain the same...
const calculateNodeWeight = (node: any): number => {
  if (!node.children || node.children.length === 0) return 1;
  return node.children.reduce(
    (sum: number, child: any) => sum + calculateNodeWeight(child),
    1,
  );
};

const getTotalNodes = (node: any): number => {
  if (!node.children || node.children.length === 0) return 1;
  return node.children.reduce(
    (sum: number, child: any) => sum + getTotalNodes(child),
    1,
  );
};

const calculateGroupSpace = (nodes: any[]) => {
  return nodes.reduce((total, node) => {
    const childrenSpace = node.children
      ? node.children.length * NODE_HEIGHT +
        (node.children.length - 1) * BASE_VERTICAL_SPACING
      : 0;
    return total + Math.max(NODE_HEIGHT, childrenSpace) + BASE_VERTICAL_SPACING;
  }, 0);
};

const divideNodesIntoGroups = (nodes: any[]) => {
  const nodeWeights = nodes.map((node) => ({
    node,
    weight: getTotalNodes(node),
  }));

  nodeWeights.sort((a, b) => b.weight - a.weight);

  const leftNodes: any[] = [];
  const rightNodes: any[] = [];
  let leftWeight = 0;
  let rightWeight = 0;

  nodeWeights.forEach(({ node, weight }) => {
    if (leftWeight <= rightWeight) {
      leftNodes.push(node);
      leftWeight += weight;
    } else {
      rightNodes.push(node);
      rightWeight += weight;
    }
  });

  const sortByOriginalIndex = (a: any, b: any) => {
    const indexA = nodes.findIndex((n) => n.id === a.id);
    const indexB = nodes.findIndex((n) => n.id === b.id);
    return indexA - indexB;
  };

  leftNodes.sort(sortByOriginalIndex);
  rightNodes.sort(sortByOriginalIndex);

  return { leftNodes, rightNodes };
};

const calculateLayout = (data: any, theme: string | undefined) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const { leftNodes, rightNodes } = divideNodesIntoGroups(data.nodes);

  const leftWidth = LEVEL_HORIZONTAL_OFFSET * 2;
  const rightWidth = LEVEL_HORIZONTAL_OFFSET * 2;
  const totalWidth = leftWidth + rightWidth;

  // Adjust root position to account for wider root node
  const rootX = -leftWidth + totalWidth / 2 - 150; // Half of root node width (300px)

  // Add root node with new styling
  nodes.push({
    id: "root",
    type: "custom",
    position: { x: rootX, y: -NODE_HEIGHT / 2 },
    data: {
      label: data.title,
      description: data.description, // Add description if available
      isRoot: true,
    },
  });

  const leftHeight = calculateGroupSpace(leftNodes);
  const rightHeight = calculateGroupSpace(rightNodes);
  const totalHeight = Math.max(leftHeight, rightHeight);

  const positionNodes = (nodeGroup: any[], isLeft: boolean) => {
    let currentY = -totalHeight / 2;

    nodeGroup.forEach((node: any, index: number) => {
      const nodeColor = getNodeColor(index, false, theme);
      const parentX =
        rootX + (isLeft ? -LEVEL_HORIZONTAL_OFFSET : LEVEL_HORIZONTAL_OFFSET);

      const childrenSpace = node.children
        ? node.children.length * NODE_HEIGHT +
          (node.children.length - 1) * BASE_VERTICAL_SPACING
        : 0;
      const groupSpace = Math.max(NODE_HEIGHT, childrenSpace);

      const parentY = currentY + (groupSpace - NODE_HEIGHT) / 2;
      nodes.push({
        id: node.id.toString(),
        type: "custom",
        position: { x: parentX, y: parentY },
        data: {
          label: node.label,
          description: node.description,
          color: nodeColor,
          sourcePosition: isLeft ? Position.Right : Position.Left,
          targetPosition: isLeft ? Position.Left : Position.Right,
        },
      });

      edges.push({
        id: `e-root-${node.id}`,
        source: isLeft ? node.id.toString() : "root",
        target: isLeft ? "root" : node.id.toString(),
        type: "custom",
      });

      if (node.children && node.children.length > 0) {
        const childX =
          parentX +
          (isLeft ? -LEVEL_HORIZONTAL_OFFSET : LEVEL_HORIZONTAL_OFFSET);
        let childY = parentY - (childrenSpace - NODE_HEIGHT) / 2;

        node.children.forEach((child: any) => {
          nodes.push({
            id: child.id.toString(),
            type: "custom",
            position: { x: childX, y: childY },
            data: {
              label: child.label,
              description: child.description,
              color: getNodeColor(index, true, theme),
              sourcePosition: isLeft ? Position.Right : Position.Left,
              targetPosition: isLeft ? Position.Left : Position.Right,
            },
          });

          edges.push({
            id: `e-${node.id}-${child.id}`,
            source: isLeft ? child.id.toString() : node.id.toString(),
            target: isLeft ? node.id.toString() : child.id.toString(),
            type: "custom",
          });

          childY += NODE_HEIGHT + BASE_VERTICAL_SPACING;
        });
      }

      currentY += groupSpace + BASE_VERTICAL_SPACING;
    });
  };

  positionNodes(leftNodes, true);
  positionNodes(rightNodes, false);

  return { nodes, edges };
};

export default function TreeMindMap(params: any) {
  const { theme, systemTheme } = useTheme();
  const data = params.data || DATA;
  const currentTheme = theme === "system" ? systemTheme : theme;

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => calculateLayout(data, currentTheme),
    [data, currentTheme],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes and edges when theme changes
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = calculateLayout(
      data,
      currentTheme,
    );
    setNodes(newNodes);
    setEdges(newEdges);
  }, [currentTheme, data, setNodes, setEdges]);

  const onInit = useCallback((reactFlowInstance: any) => {
    reactFlowInstance.fitView({ padding: 0.2 });
  }, []);

  return (
    <div className="w-full h-screen bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={onInit}
        defaultEdgeOptions={{
          type: "custom",
        }}
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
