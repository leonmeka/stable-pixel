import React, { useState, useEffect, useRef } from "react";
import {
  vertexData,
  edgesData,
  type VerticesState,
  initialVertices,
} from "@/components/features/openpose/openpose-editor.config";
import { Vertex } from "@/components/features/openpose/components/vertex";
import { Edge } from "@/components/features/openpose/components/edge";
import { useImageSize } from "@/hooks/use-image-size";
import html2canvas from "html2canvas";
import { useAppState } from "@/hooks/use-app-state";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { Card, CardContent } from "@/components/ui/card";

export const OpenposeEditor = () => {
  const { pose, setPose } = useAppState();

  const [vertices, setVertices] = useState<VerticesState>(initialVertices);
  const [draggingVertex, setDraggingVertex] = useState<string | null>(null);

  const imageRef = useRef<HTMLDivElement>(null);
  const imageSize = useImageSize(imageRef);

  const imageVertexSize = (5 * imageSize.width) / 512;

  useEffect(() => {
    if (!draggingVertex) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const leftPercent = (x / imageSize.width) * 100;
        const topPercent = (y / imageSize.height) * 100;
        setVertices((prev) => ({
          ...prev,
          [draggingVertex]: { left: leftPercent, top: topPercent },
        }));
      }
    };

    const handleMouseUp = () => {
      setDraggingVertex(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingVertex, imageSize]);

  useEffect(() => {
    handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = debounce(async () => {
    if (imageRef.current) {
      const canvas = await html2canvas(imageRef.current, {
        backgroundColor: "black",
        logging: false,
      });
      canvas.toBlob((blob) => {
        if (blob) setPose(blob);
        return blob;
      });
    }
  }, 500);

  const handleMouseDown = (e: React.MouseEvent, vertexName: string) => {
    e.preventDefault();
    setDraggingVertex(vertexName);
  };

  const handleReset = () => {
    setVertices(initialVertices);
    void handleCapture();
  };

  return (
    <Card className="relative h-full w-full flex-1">
      <CardContent
        ref={imageRef}
        className="relative inset-0 m-auto aspect-square h-full"
      >
        {edgesData.map((edge) => (
          <Edge
            key={edge.name}
            fromPosition={vertices[edge.from]!}
            toPosition={vertices[edge.to]!}
            style={edge.style}
            imageSize={imageSize}
            imageVertexSize={imageVertexSize}
          />
        ))}

        {vertexData.map((vertex) => (
          <Vertex
            key={vertex.name}
            vertexName={vertex.name}
            position={vertices[vertex.name]!}
            style={vertex.style}
            imageSize={imageSize}
            imageVertexSize={imageVertexSize}
            onMouseDown={handleMouseDown}
            onMouseUp={handleCapture}
          />
        ))}
      </CardContent>

      <div className="absolute bottom-4 left-4 grid gap-2">
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={handleReset}
          disabled={!pose || vertices === initialVertices}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
