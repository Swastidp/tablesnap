"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, RotateCcw, Move } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageViewerProps {
  src: string;
  alt?: string;
}

export function ImageViewer({ src, alt = "Uploaded image" }: ImageViewerProps) {
  return (
    <div className="relative w-full h-full bg-primary-50 rounded-xl overflow-hidden">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        centerOnInit
        wheel={{ step: 0.1 }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Controls */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => zoomIn()}
                className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-md"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => zoomOut()}
                className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-md"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => resetTransform()}
                className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-md"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Hint */}
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg text-xs text-primary-500 shadow-sm">
              <Move className="w-3 h-3" />
              <span>Drag to pan • Scroll to zoom</span>
            </div>

            {/* Image container */}
            <TransformComponent
              wrapperClass="!w-full !h-full"
              contentClass="!w-full !h-full flex items-center justify-center"
            >
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing"
                draggable={false}
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
