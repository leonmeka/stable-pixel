import React from "react";
import { type Position } from "../openpose-editor.config";
import { type CanvasSize } from "@/types";

interface CanvasVertexProps {
  canvasSize: CanvasSize;
  position: Position;
  isGrabbed: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  style: React.CSSProperties;
}

export const CanvasVertex = ({
  canvasSize,
  position,
  isGrabbed,
  onPointerDown,
  onPointerUp,
  style,
}: CanvasVertexProps) => {
  const x = (position.left / 100) * canvasSize.width;
  const y = (position.top / 100) * canvasSize.height;

  const radius = canvasSize.width / 100;

  return (
    <circle
      cx={x}
      cy={y}
      r={radius}
      cursor={`${isGrabbed ? "grabbing" : "grab"}`}
      fill={style.backgroundColor}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    />
  );
};
