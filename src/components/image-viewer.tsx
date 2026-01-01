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
    <div className="relative w-full h-full bg-dark-panel rounded-lg overflow-hidden">
      {/* Screen bezel effect */}
      <div className="absolute inset-0 pointer-events-none z-20 rounded-lg border-4 border-[#1a1a1a] shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]" />
      
      {/* Scanlines overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-20"
        style={{
          background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.15) 50%)',
          backgroundSize: '100% 4px',
        }}
      />
      
      {/* Corner LED indicators */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-success shadow-led-green animate-pulse" />
        <span className="text-[8px] font-mono font-bold text-success/80 uppercase tracking-wider">
          PWR
        </span>
      </div>

      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        centerOnInit
        wheel={{ step: 0.1 }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Industrial control buttons */}
            <div className="absolute top-3 left-3 z-30 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => zoomIn()}
                className="w-10 h-10 rounded-lg bg-chassis shadow-neu-button hover:shadow-neu-floating active:shadow-neu-pressed active:translate-y-[1px]"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4 text-ink" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => zoomOut()}
                className="w-10 h-10 rounded-lg bg-chassis shadow-neu-button hover:shadow-neu-floating active:shadow-neu-pressed active:translate-y-[1px]"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4 text-ink" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => resetTransform()}
                className="w-10 h-10 rounded-lg bg-chassis shadow-neu-button hover:shadow-neu-floating active:shadow-neu-pressed active:translate-y-[1px]"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4 text-ink" />
              </Button>
            </div>

            {/* Industrial hint badge */}
            <div className="absolute bottom-3 left-3 z-30 flex items-center gap-2 px-3 py-2 bg-chassis rounded-lg shadow-neu-button">
              <Move className="w-3 h-3 text-ink-muted" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
                DRAG TO PAN • SCROLL TO ZOOM
              </span>
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
