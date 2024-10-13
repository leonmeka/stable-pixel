import React, { useState, useEffect, useRef } from "react";
import {
  vertexData,
  edgesData,
  type VerticesState,
  initialVertices,
} from "./openpose-editor.config";
import { CanvasVertex } from "./components/canvas-vertex";
import { CanvasEdge } from "./components/canvas-edge";
import { debounce } from "lodash";
import { type CanvasSize } from "@/types";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";

interface OpenposeEditorProps {
  onPoseChange: (pose: Blob) => void;
}

export const OpenposeEditor = ({ onPoseChange }: OpenposeEditorProps) => {
  const [pose, setPose] = useState<Blob | null>(null);

  const [vertices, setVertices] = useState<VerticesState>(initialVertices);
  const [draggingVertex, setDraggingVertex] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({
    width: 0,
    height: 0,
  });

  const handleMouseDown = (e: React.MouseEvent, vertexName: string) => {
    setDraggingVertex(vertexName);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingVertex || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / canvasSize.width) * 100;
    const y = ((e.clientY - rect.top) / canvasSize.height) * 100;

    setVertices((prev) => {
      return {
        ...prev,
        [draggingVertex]: {
          left: x,
          top: y,
        },
      };
    });
  };

  const handleMouseUp = () => {
    setDraggingVertex(null);
    void handleCapture();
  };

  const handleReset = () => {
    setVertices(initialVertices);
    void handleCapture();
  };

  const handleCapture = debounce(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const svgElement = containerRef.current.querySelector("svg");
    if (!svgElement) return;

    // Serialize the SVG into a string
    const svgData = new XMLSerializer().serializeToString(svgElement);

    // Create a Blob from the SVG data
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = 1024;
      offscreenCanvas.height = 1024;

      const ctx = offscreenCanvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas before drawing
      ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

      // Fill canvas with black background
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

      // Draw the image on the canvas with proper scaling
      ctx.drawImage(img, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

      offscreenCanvas.toBlob((blob) => {
        if (!blob) return;
        setPose(blob);
        onPoseChange(blob);

        // Revoke the URL to prevent memory leaks
        URL.revokeObjectURL(url);
      }, "image/png");
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      console.error("Failed to load SVG as image");
    };

    img.src = url;
  }, 500);

  useEffect(() => {
    void handleCapture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResize = debounce(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      const size = Math.min(clientWidth, clientHeight);

      setCanvasSize({ width: size, height: size });
    }
  }, 500);

  useEffect(() => {
    const observer = new ResizeObserver(handleResize);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => handleMouseMove(e);
    const handleUp = () => handleMouseUp();

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggingVertex]);

  return (
    <div
      className="relative flex aspect-square h-full w-full select-none items-center justify-center"
      ref={containerRef}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="absolute aspect-square"
      />

      <svg
        viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
        className="absolute aspect-square h-full bg-black/25"
      >
        {edgesData.map((edge) => (
          <CanvasEdge
            key={edge.name}
            canvasSize={canvasSize}
            from={vertices[edge.from]!}
            to={vertices[edge.to]!}
            style={edge.style}
          />
        ))}
        {vertexData.map((vertex) => (
          <CanvasVertex
            key={vertex.name}
            canvasSize={canvasSize}
            position={vertices[vertex.name]!}
            isGrabbed={draggingVertex === vertex.name}
            onDrag={(e) => handleMouseDown(e, vertex.name)}
            onMouseUp={handleMouseUp}
            style={vertex.style}
          />
        ))}
      </svg>

      <div className="absolute bottom-4 left-4 grid gap-2">
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={handleReset}
          disabled={!pose || vertices === initialVertices}
        >
          <TrashIcon size={16} />
        </Button>
      </div>
    </div>
  );
};
