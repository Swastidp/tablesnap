"use client";

import { useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileImage, Camera, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Supported image formats by Gemini API
const SUPPORTED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "image/heif",
];

const isSupported = (file: File) => SUPPORTED_MIME_TYPES.includes(file.type);

// Mechanical spring animation config
const mechanicalSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 25,
  mass: 1,
};

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

// LED Indicator Component
function LEDIndicator({ active, color = "green" }: { active: boolean; color?: "green" | "red" }) {
  return (
    <div className="flex items-center gap-2">
      <div 
        className={cn(
          "w-2.5 h-2.5 rounded-full transition-all duration-300",
          active && "animate-pulse",
          color === "green" && active && "bg-success shadow-led-green",
          color === "green" && !active && "bg-muted shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]",
          color === "red" && active && "bg-accent shadow-led-red",
          color === "red" && !active && "bg-muted shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]"
        )}
      />
    </div>
  );
}

// Vent Slots Component
function VentSlots() {
  return (
    <div className="flex gap-1">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-5 w-1 rounded-full bg-muted shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)]" />
      ))}
    </div>
  );
}

export function Dropzone({ onFileSelect, isLoading = false }: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (isSupported(file)) {
          onFileSelect(file);
        } else {
          alert("Unsupported image format. Please use PNG, JPG, or WEBP.");
        }
        e.dataTransfer.clearData();
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (isSupported(file)) {
          onFileSelect(file);
        } else {
          alert("Unsupported image format. Please use PNG, JPG, or WEBP.");
        }
      }
    },
    [onFileSelect]
  );

  const handleCameraCapture = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (isSupported(file)) {
          onFileSelect(file);
        } else {
          alert("Unsupported image format. Please use PNG, JPG, or WEBP.");
        }
        e.target.value = "";
      }
    },
    [onFileSelect]
  );

  const handleCameraClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cameraInputRef.current?.click();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Industrial Device Container */}
      <div className="relative bg-chassis rounded-2xl shadow-neu-card p-1 border-2 border-shadow/30">
        {/* Corner screws */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            backgroundImage: `
              radial-gradient(circle at 16px 16px, rgba(0,0,0,0.12) 3px, transparent 4px),
              radial-gradient(circle at calc(100% - 16px) 16px, rgba(0,0,0,0.12) 3px, transparent 4px),
              radial-gradient(circle at 16px calc(100% - 16px), rgba(0,0,0,0.12) 3px, transparent 4px),
              radial-gradient(circle at calc(100% - 16px) calc(100% - 16px), rgba(0,0,0,0.12) 3px, transparent 4px)
            `
          }}
        />

        {/* Device Header Bar */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-shadow/30">
          <div className="flex items-center gap-3">
            <LEDIndicator active={!isLoading} color="green" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
              DATA SCANNER
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-ink-muted/60 uppercase tracking-wider">
              MODEL TS-01
            </span>
            <VentSlots />
          </div>
        </div>

        {/* Main Scanner Area */}
        <label
          htmlFor="file-upload"
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className={cn(
            "relative flex flex-col items-center justify-center w-full min-h-[220px] m-2.5 rounded-xl cursor-pointer transition-all duration-300",
            // Recessed scanning bed appearance
            "shadow-neu-recessed bg-chassis",
            isDragActive && "shadow-[inset_6px_6px_12px_#babecc,inset_-6px_-6px_12px_#ffffff,0_0_0_3px_#ff4757]",
            isLoading && "pointer-events-none opacity-70"
          )}
          style={{ width: 'calc(100% - 20px)' }}
        >
          {/* Animated scan line effect - always active */}
          {!isLoading && (
            <motion.div
              initial={{ top: 0, opacity: 0 }}
              animate={{ 
                top: ["0%", "98%"],
                opacity: [0.5, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"
              style={{ boxShadow: '0 0 20px 2px rgba(255, 71, 87, 0.5)' }}
            />
          )}

          {/* Icon Housing */}
          <motion.div
            animate={{
              scale: isDragActive ? 1.1 : 1,
              y: isDragActive ? -8 : 0,
            }}
            transition={mechanicalSpring}
            className="relative z-10 mb-4"
          >
            {/* Circular icon housing with neumorphic effect */}
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                isDragActive
                  ? "bg-accent shadow-neu-accent"
                  : "bg-chassis shadow-neu-floating"
              )}
            >
              {isDragActive ? (
                <FileImage className={cn("w-7 h-7 transition-colors", isDragActive ? "text-white" : "text-accent")} />
              ) : (
                <Upload className="w-7 h-7 text-accent" />
              )}
            </div>
            
            {/* Rotating sparkle indicator */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1 -right-1"
            >
              <div className="w-6 h-6 rounded-full bg-chassis shadow-neu-button flex items-center justify-center">
                <Zap className="w-3 h-3 text-accent" />
              </div>
            </motion.div>
          </motion.div>

          {/* Text content */}
          <div className="relative z-10 text-center px-4">
            <motion.h3
              animate={{ scale: isDragActive ? 1.02 : 1 }}
              transition={mechanicalSpring}
              className={cn(
                "text-lg font-bold mb-1.5 transition-colors duration-300 text-embossed",
                isDragActive ? "text-accent" : "text-ink"
              )}
            >
              {isDragActive ? "RELEASE TO SCAN" : "INSERT DOCUMENT"}
            </motion.h3>
            
            <p className="text-ink-muted text-sm mb-0.5">
              Drop an invoice, screenshot, or table image
            </p>
            
            <p className="text-ink-muted/60 text-sm mb-4">
              or{" "}
              <span className="text-accent font-semibold hover:text-accent-hover underline underline-offset-2 cursor-pointer">
                browse files
              </span>
            </p>

            {/* Scan Document Button - Industrial Style */}
            <Button
              type="button"
              variant="secondary"
              size="default"
              onClick={handleCameraClick}
              disabled={isLoading}
              className="gap-2"
            >
              <Camera className="w-4 h-4" />
              SCAN DOCUMENT
            </Button>
          </div>

          <input
            id="file-upload"
            type="file"
            accept=".png,.jpg,.jpeg,.webp,.heic,.heif"
            onChange={handleFileInput}
            className="hidden"
            disabled={isLoading}
          />

          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={cameraInputRef}
            onChange={handleCameraCapture}
            className="hidden"
            disabled={isLoading}
          />
        </label>

        {/* Footer with supported formats */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-shadow/30">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
            SUPPORTED FORMATS
          </span>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2"
          >
            {["PNG", "JPG", "WEBP", "HEIC"].map((format) => (
              <span 
                key={format}
                className="px-2 py-1 text-[10px] font-mono font-bold rounded bg-muted text-ink-muted shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]"
              >
                {format}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
