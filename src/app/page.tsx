"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dropzone } from "@/components/dropzone";
import { StatusStepper } from "@/components/status-stepper";
import { Workspace } from "@/components/workspace";
import { Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableData {
  headers: string[];
  rows: Record<string, string>[];
}

type AppState = "idle" | "processing" | "workspace" | "error";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [imageDataUrl, setImageDataUrl] = useState<string>("");
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileSelect = useCallback(async (file: File) => {
    // Convert file to data URL for preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setImageDataUrl(dataUrl);
      setAppState("processing");
      setError("");

      try {
        // Create form data with the image
        const formData = new FormData();
        formData.append("image", file);

        // Call the extraction API
        const response = await fetch("/api/extract", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to extract data");
        }

        if (result.success && result.data) {
          setTableData(result.data);
          // Small delay to show the "Ready!" state
          setTimeout(() => {
            setAppState("workspace");
          }, 800);
        } else {
          throw new Error(result.error || "No data extracted");
        }
      } catch (err) {
        console.error("Extraction error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setAppState("error");
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleReset = useCallback(() => {
    setAppState("idle");
    setImageDataUrl("");
    setTableData(null);
    setError("");
  }, []);

  const handleDataChange = useCallback((newData: TableData) => {
    setTableData(newData);
  }, []);

  // Render workspace view
  if (appState === "workspace" && tableData) {
    return (
      <Workspace
        imageSrc={imageDataUrl}
        tableData={tableData}
        onDataChange={handleDataChange}
        onReset={handleReset}
      />
    );
  }

  // Render landing/processing/error view
  return (
    <main className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-lg shadow-accent-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-800">TableSnap</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-primary-500"
          >
            AI-Powered Table Extraction
          </motion.div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-auto min-h-0">
        <div className="min-h-full flex items-center justify-center px-6 py-6">
          <AnimatePresence mode="wait">
            {appState === "idle" && (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-2xl"
              >
                <div className="text-center mb-6">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl md:text-4xl font-bold text-primary-800 mb-3"
                >
                  Images to Spreadsheets,{" "}
                  <span className="text-accent-500">Instantly.</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-base text-primary-500 max-w-lg mx-auto"
                >
                  Transform photos of tables, receipts, and invoices into
                  editable data. Verify before you export.
                </motion.p>
                </div>

                <Dropzone onFileSelect={handleFileSelect} />

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 grid grid-cols-3 gap-4 text-center"
                >
                  <div className="p-3">
                    <div className="text-xl mb-1">🎯</div>
                    <h3 className="font-medium text-primary-700 text-sm mb-0.5">
                      AI Accuracy
                    </h3>
                    <p className="text-xs text-primary-400">
                      Powered by Gemini 2.5 Flash
                    </p>
                  </div>
                  <div className="p-3">
                    <div className="text-xl mb-1">✏️</div>
                    <h3 className="font-medium text-primary-700 text-sm mb-0.5">
                      Edit Before Export
                    </h3>
                    <p className="text-xs text-primary-400">
                      Fix any errors visually
                    </p>
                  </div>
                  <div className="p-3">
                    <div className="text-xl mb-1">📊</div>
                    <h3 className="font-medium text-primary-700 text-sm mb-0.5">
                      One-Click CSV
                    </h3>
                    <p className="text-xs text-primary-400">
                      Download instantly
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {appState === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-xl"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-primary-800 mb-2">
                    Extracting your data...
                  </h2>
                  <p className="text-primary-500">
                    Our AI is analyzing your image
                  </p>
                </div>

                {/* Preview thumbnail */}
                {imageDataUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 flex justify-center"
                  >
                    <div className="w-28 h-28 rounded-xl overflow-hidden border-2 border-primary-200 shadow-lg">
                      <img
                        src={imageDataUrl}
                        alt="Processing"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                )}

                <StatusStepper isProcessing={true} />
              </motion.div>
            )}

            {appState === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-md text-center"
              >
                <div className="w-16 h-16 rounded-full bg-error-light flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-error" />
                </div>

                <h2 className="text-2xl font-semibold text-primary-800 mb-2">
                  Something went wrong
                </h2>
                <p className="text-primary-500 mb-6">{error}</p>

                <Button onClick={handleReset} variant="default">
                  Try Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex-shrink-0 px-6 py-4 text-center text-sm text-primary-400">
        <p>
          Built for hackathon •{" "}
          <span className="text-accent-500">TableSnap</span>
        </p>
      </footer>
    </main>
  );
}
