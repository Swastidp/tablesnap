"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileImage, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Supported image formats by Gemini API
const SUPPORTED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "image/heif",
];

const isSupported = (file: File) => SUPPORTED_MIME_TYPES.includes(file.type);

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

export function Dropzone({ onFileSelect, isLoading = false }: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <label
        htmlFor="file-upload"
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[280px] p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300",
          isDragActive
            ? "border-accent-500 bg-accent-50/80 scale-[1.02]"
            : "border-primary-300 bg-white/60 hover:border-accent-400 hover:bg-white/80",
          isLoading && "pointer-events-none opacity-70"
        )}
      >
        {/* Animated background gradient */}
        <AnimatePresence>
          {(isDragActive || isHovering) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-50/50 via-transparent to-primary-50/50"
            />
          )}
        </AnimatePresence>

        {/* Pulse animation ring */}
        <AnimatePresence>
          {isHovering && !isDragActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0.5, 0.2, 0.5],
                scale: [1, 1.1, 1],
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-4 rounded-xl border-2 border-accent-300"
            />
          )}
        </AnimatePresence>

        {/* Icon */}
        <motion.div
          animate={{
            scale: isDragActive ? 1.1 : 1,
            y: isDragActive ? -5 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative z-10 mb-4"
        >
          <div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300",
              isDragActive
                ? "bg-accent-500 text-white"
                : "bg-primary-100 text-primary-600"
            )}
          >
            {isDragActive ? (
              <FileImage className="w-8 h-8" />
            ) : (
              <Upload className="w-8 h-8" />
            )}
          </div>
          
          {/* Sparkle decoration */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-5 h-5 text-accent-400" />
          </motion.div>
        </motion.div>

        {/* Text content */}
        <div className="relative z-10 text-center">
          <motion.h3
            animate={{ scale: isDragActive ? 1.05 : 1 }}
            className={cn(
              "text-xl font-semibold mb-2 transition-colors duration-300",
              isDragActive ? "text-accent-600" : "text-primary-800"
            )}
          >
            {isDragActive ? "Drop it here!" : "Unlock your data"}
          </motion.h3>
          
          <p className="text-primary-500 mb-1">
            Drop an invoice, screenshot, or table here
          </p>
          
          <p className="text-primary-400 text-sm">
            or <span className="text-accent-500 font-medium hover:text-accent-600 underline underline-offset-2">browse files</span>
          </p>
        </div>

        {/* Supported formats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 mt-6 flex items-center gap-2 text-xs text-primary-400"
        >
          <span className="px-2 py-1 rounded-md bg-primary-100">PNG</span>
          <span className="px-2 py-1 rounded-md bg-primary-100">JPG</span>
          <span className="px-2 py-1 rounded-md bg-primary-100">WEBP</span>
          <span className="px-2 py-1 rounded-md bg-primary-100">HEIC</span>
        </motion.div>

        <input
          id="file-upload"
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.heic,.heif"
          onChange={handleFileInput}
          className="hidden"
          disabled={isLoading}
        />
      </label>
    </motion.div>
  );
}
