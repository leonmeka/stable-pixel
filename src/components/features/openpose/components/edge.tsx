import React from "react";
import { type Position } from "@/components/features/openpose/openpose-editor.config";
import { type ImageSize } from "@/types";

interface EdgeProps {
  fromPosition: Position;
  toPosition: Position;
  style: React.CSSProperties;
  imageSize: ImageSize;
  imageVertexSize: number;
}

export const Edge = ({
  fromPosition,
  toPosition,
  style,
  imageSize,
  imageVertexSize,
}: EdgeProps) => {
  const getPixelPosition = (percentagePosition: Position): Position => {
    return {
      left: (percentagePosition.left / 100) * imageSize.width,
      top: (percentagePosition.top / 100) * imageSize.height,
    };
  };

  const fromPixel = getPixelPosition(fromPosition);
  const toPixel = getPixelPosition(toPosition);

  const deltaX = toPixel.left - fromPixel.left;
  const deltaY = toPixel.top - fromPixel.top;
  const length = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  const angle = Math.atan2(deltaY, deltaX);

  const left = (fromPixel.left + toPixel.left) / 2;
  const top = (fromPixel.top + toPixel.top) / 2;

  const computedStyle: React.CSSProperties = {
    position: "absolute",
    left: `${left}px`,
    top: `${top}px`,
    width: `${length}px`,
    height: `${imageVertexSize}px`,
    transform: `translate(-50%, -50%) rotate(${angle}rad)`,
    transformOrigin: "center",
    borderRadius: "50%",
    ...style,
  };

  return <div className="edge" style={computedStyle} />;
};
