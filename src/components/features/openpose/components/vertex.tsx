import React from "react";
import { type Position } from "@/components/features/openpose/openpose-editor.config";
import { type ImageSize } from "@/types";

interface VertexProps {
  vertexName: string;
  position: Position;
  style: React.CSSProperties;
  imageSize: ImageSize;
  imageVertexSize: number;
  onMouseDown: (e: React.MouseEvent, vertexName: string) => void;
  onMouseUp: (e: React.MouseEvent) => void;
}

export const Vertex = ({
  vertexName,
  position,
  style,
  imageSize,
  imageVertexSize,
  onMouseDown,
  onMouseUp,
}: VertexProps) => {
  const getPixelPosition = (percentagePosition: Position): Position => {
    return {
      left: (percentagePosition.left / 100) * imageSize.width,
      top: (percentagePosition.top / 100) * imageSize.height,
    };
  };

  const pixelPosition = getPixelPosition(position);

  const computedStyle: React.CSSProperties = {
    left: `${pixelPosition.left}px`,
    top: `${pixelPosition.top}px`,
    width: `${imageVertexSize * 3}px`,
    height: `${imageVertexSize * 3}px`,
    ...style,
  };

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 transform cursor-pointer rounded-full"
      onMouseDown={(e) => onMouseDown(e, vertexName)}
      onMouseUp={(e) => onMouseUp(e)}
      style={computedStyle}
    />
  );
};
