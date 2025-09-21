"use client";
import React, { useCallback } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { File } from "lucide-react";
import { memo } from "react";

const DocumentNode = memo(({ data }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      padding: "16px 20px",
      minWidth: 220,
      minHeight: 60,
      gap: 12,
      position: "relative",
    }}
  >
    <Handle
      type="target"
      position={Position.Left}
      style={{
        background: "#e6e6e6",
        width: 8,
        height: 8,
      }}
    />
    <Handle
      type="source"
      position={Position.Right}
      style={{
        background: "#e6e6e6",
        width: 8,
        height: 8,
      }}
    />
    <div
      style={{
        background: "#f3f4f6",
        borderRadius: 8,
        padding: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
      }}
    >
      <File size={24} color="#6b7280" />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 600, fontSize: 16, color: "#111827" }}>
        {data.title}
      </div>
      <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
        {data.description}
      </div>
    </div>
  </div>
));

const nodeTypes = {
  document: DocumentNode,
};

function DocMap() {
  const initialNodes = [
    {
      id: "doc1",
      type: "document",
      position: { x: 50, y: 100 },
      data: {
        title: "Supreme Court Judgment.pdf",
        description: "This is the first document.",
      },
    },
    {
      id: "doc2",
      type: "document",
      position: { x: 650, y: 400 },
      data: {
        title: "(Protection of Rights on Marriage) Bill.pdf",
        description: "This is the second document.",
      },
    },
    {
      id: "doc3",
      type: "document",
      position: { x: 350, y: 600 },
      data: {
        title: "Petition Filed by Shayara Bano.pdf",
        description: "This is the third document.",
      },
    },
    {
      id: "doc4",
      type: "document",
      position: { x: 50, y: 1000 },
      data: {
        title: "Law Board Statements & Reports.pdf",
        description: "This is the forth document.",
      },
    },
    {
      id: "doc5",
      type: "document",
      position: { x: -650, y: 400 },
      data: {
        title: "National Law Journal Articles.pdf",
        description: "This is the fifth document.",
      },
    },
  ];

  const initialEdges = [
    {
      id: "edge1",
      source: "doc1",
      target: "doc2",
    },
    {
      id: "edge2",
      source: "doc5",
      target: "doc1",
    },
    {
      id: "edge3",
      source: "doc5",
      target: "doc4",
    },
    {
      id: "edge4",
      source: "doc5",
      target: "doc3",
    },
  ];

  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connections) => setEdges((edge) => addEdge(connections, edge)),
    [setEdges]
  );

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        fitView
        panOnDrag={true}
        zoomOnScroll={false}
        zoomOnPinch={true}
        panOnScroll={true}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        selectNodesOnDrag={false}
        defaultEdgeOptions={{
            animated: false,
            style: {
                stroke: "#595959",
                strokeWidth: 2,
            },
            markerEnd: {
                type: "arrowclosed",
                width: 15,
                height: 15,
                color: "#595959",
            },
        }}
      >
        <Background />
        {/* <MiniMap /> */}
        <Controls />
      </ReactFlow>
    </ReactFlowProvider>
  );
}

export default DocMap;
