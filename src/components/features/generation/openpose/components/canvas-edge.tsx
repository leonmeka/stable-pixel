import React from "react";
import { type Position } from "../openpose-editor.config";
import { type CanvasSize } from "@/types";

interface CanvasEdgeProps {
  canvasSize: CanvasSize;
  from: Position;
  to: Position;
  style: React.CSSProperties;
}

export const CanvasEdge = ({
  canvasSize,
  from,
  to,
  style,
}: CanvasEdgeProps) => {
  const fromX = (from.left / 100) * canvasSize.width;
  const fromY = (from.top / 100) * canvasSize.height;
  const toX = (to.left / 100) * canvasSize.width;
  const toY = (to.top / 100) * canvasSize.height;

  const strokeWidth = canvasSize.width / 100;

  return (
    <line
      x1={fromX}
      y1={fromY}
      x2={toX}
      y2={toY}
      stroke={style.backgroundColor}
      strokeWidth={strokeWidth}
    />
  );
};
