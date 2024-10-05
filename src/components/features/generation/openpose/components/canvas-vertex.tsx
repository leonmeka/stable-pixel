import React from "react";
import { type Position } from "../openpose-editor.config";
import { type CanvasSize } from "@/types";

interface CanvasVertexProps {
  canvasSize: CanvasSize;
  position: Position;
  onDrag: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  style: React.CSSProperties;
}

export const CanvasVertex = ({
  canvasSize,
  position,
  onDrag,
  onMouseUp,
  style,
}: CanvasVertexProps) => {
  const x = (position.left / 100) * canvasSize.width;
  const y = (position.top / 100) * canvasSize.height;

  return (
    <circle
      cx={x}
      cy={y}
      r={3}
      fill={style.backgroundColor}
      onMouseDown={onDrag}
      onMouseUp={onMouseUp}
    />
  );
};
