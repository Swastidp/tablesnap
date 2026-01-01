"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dropzone } from "@/components/dropzone";
import { StatusStepper } from "@/components/status-stepper";
import { Workspace } from "@/components/workspace";
import { Zap, AlertCircle, Target, Edit3, Download, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableData {
  headers: string[];
  rows: Record<string, string>[];
}

type AppState = "idle" | "processing" | "workspace" | "error";

// Mechanical spring animation config
const mechanicalSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

// LED Indicator Component
function LEDIndicator({ active, color = "green" }: { active: boolean; color?: "green" | "red" }) {
  return (
    <div 
      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
        active ? "animate-pulse" : ""
      } ${
        color === "green" && active ? "bg-success shadow-led-green" : ""
      } ${
        color === "green" && !active ? "bg-muted shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]" : ""
      } ${
        color === "red" && active ? "bg-accent shadow-led-red" : ""
      } ${
        color === "red" && !active ? "bg-muted shadow-[inset_1px_1px_2px_rgba(0,0,0,0.2)]" : ""
      }`}
    />
  );
}

// Vent Slots Component
function VentSlots({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="h-5 w-1 rounded-full bg-muted shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)]" />
      ))}
    </div>
  );
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [imageDataUrl, setImageDataUrl] = useState<string>("");
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileSelect = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setImageDataUrl(dataUrl);
      setAppState("processing");
      setError("");

      try {
        const formData = new FormData();
        formData.append("image", file);

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

  // Sample data for "Lazy Judge" demo
  const handleLoadSample = useCallback(async () => {
    // Sample invoice data - pre-baked for instant demo
    const sampleData: TableData = {
      headers: ["Item", "Description", "Qty", "Unit Price", "Total"],
      rows: [
        { "Item": "WEB-001", "Description": "Website Development", "Qty": "1", "Unit Price": "$2,500.00", "Total": "$2,500.00" },
        { "Item": "DES-002", "Description": "Logo Design Package", "Qty": "1", "Unit Price": "$450.00", "Total": "$450.00" },
        { "Item": "HST-003", "Description": "Annual Hosting Plan", "Qty": "12", "Unit Price": "$29.99", "Total": "$359.88" },
        { "Item": "SEO-004", "Description": "SEO Optimization", "Qty": "3", "Unit Price": "$150.00", "Total": "$450.00" },
        { "Item": "SUP-005", "Description": "Premium Support [?]", "Qty": "6", "Unit Price": "$75.00", "Total": "$450.00" },
      ],
    };

    // Create a placeholder image (a simple invoice-like pattern)
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 800, 600);
      
      // Header
      ctx.fillStyle = '#2d3436';
      ctx.font = 'bold 28px Inter, sans-serif';
      ctx.fillText('INVOICE', 50, 60);
      ctx.font = '14px Inter, sans-serif';
      ctx.fillStyle = '#718096';
      ctx.fillText('Sample Invoice #INV-2024-001', 50, 85);
      ctx.fillText('Date: January 1, 2026', 50, 105);
      
      // Table header
      ctx.fillStyle = '#e0e5ec';
      ctx.fillRect(50, 140, 700, 35);
      ctx.fillStyle = '#2d3436';
      ctx.font = 'bold 12px Inter, sans-serif';
      const headers = ['Item', 'Description', 'Qty', 'Unit Price', 'Total'];
      const colWidths = [80, 250, 60, 120, 120];
      let x = 60;
      headers.forEach((h, i) => {
        ctx.fillText(h, x, 162);
        x += colWidths[i];
      });
      
      // Table rows
      ctx.font = '12px Inter, sans-serif';
      sampleData.rows.forEach((row, rowIndex) => {
        const y = 200 + rowIndex * 35;
        if (rowIndex % 2 === 0) {
          ctx.fillStyle = '#f8f9fa';
          ctx.fillRect(50, y - 18, 700, 35);
        }
        ctx.fillStyle = '#2d3436';
        let x = 60;
        headers.forEach((h, i) => {
          ctx.fillText(row[h] || '', x, y);
          x += colWidths[i];
        });
      });
      
      // Total
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillText('Subtotal: $4,209.88', 550, 400);
      ctx.fillText('Tax (8%): $336.79', 550, 425);
      ctx.fillStyle = '#ff4757';
      ctx.fillText('TOTAL: $4,546.67', 550, 460);
    }
    
    setImageDataUrl(canvas.toDataURL('image/png'));
    setTableData(sampleData);
    setAppState('workspace');
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
    <main className="h-screen flex flex-col overflow-hidden bg-chassis">
      {/* Industrial Header */}
      <header className="flex-shrink-0 px-6 py-2">
        <div className="max-w-6xl mx-auto">
          <div className="bg-chassis rounded-xl shadow-neu-card px-5 py-2 border-2 border-shadow/30">
            <div className="flex items-center justify-between">
              {/* Logo and brand */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={mechanicalSpring}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-accent shadow-neu-accent flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold text-ink text-embossed uppercase tracking-wide">
                    TableSnap
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <LEDIndicator active={true} color="green" />
                    <span className="text-[9px] font-mono font-bold text-ink-muted uppercase tracking-widest">
                      ONLINE
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Right side */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={mechanicalSpring}
                className="flex items-center gap-4"
              >
                <div className="hidden md:block px-3 py-1.5 rounded-lg bg-muted shadow-neu-recessed">
                  <span className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-wider">
                    AI-POWERED EXTRACTION
                  </span>
                </div>
                <div className="hidden md:flex">
                  <VentSlots count={4} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
        <div className="min-h-full md:h-full flex items-center justify-center px-4 md:px-6 py-4 md:py-3">
          <AnimatePresence mode="wait">
            {appState === "idle" && (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={mechanicalSpring}
                className="w-full max-w-2xl"
              >
                {/* Hero text */}
                <div className="text-center mb-3 px-2">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, ...mechanicalSpring }}
                    className="text-2xl md:text-3xl font-extrabold text-ink text-embossed mb-2 tracking-tight leading-tight"
                  >
                    Images to Spreadsheets,{" "}
                    <span className="text-accent">Instantly.</span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, ...mechanicalSpring }}
                    className="text-sm md:text-base text-ink-muted max-w-lg mx-auto"
                  >
                    Transform photos of tables, receipts, and invoices into
                    editable data. Verify before you export.
                  </motion.p>
                </div>

                <Dropzone onFileSelect={handleFileSelect} onLoadSample={handleLoadSample} />

                {/* Feature cards - Industrial style */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, ...mechanicalSpring }}
                  className="mt-4 grid grid-cols-3 gap-3 px-1"
                >
                  {[
                    { icon: Target, title: "AI ACCURACY", desc: "Gemini 2.5 Flash" },
                    { icon: Edit3, title: "EDIT FIRST", desc: "Fix errors visually" },
                    { icon: Download, title: "ONE-CLICK", desc: "Export to CSV" },
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      className="bg-chassis rounded-lg shadow-neu-card p-3 text-center group hover:-translate-y-0.5 hover:shadow-neu-floating transition-all duration-300 border-2 border-shadow/20"
                    >
                      <div className="w-9 h-9 rounded-full bg-chassis shadow-neu-floating flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="w-4 h-4 text-accent" />
                      </div>
                      <h3 className="font-bold text-ink text-[10px] md:text-xs mb-0.5 uppercase tracking-wider text-embossed">
                        {feature.title}
                      </h3>
                      <p className="text-[9px] md:text-[10px] font-mono text-ink-muted uppercase tracking-wide">
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {appState === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={mechanicalSpring}
                className="w-full max-w-xl"
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-ink text-embossed mb-2 uppercase tracking-wide">
                    Extracting Data...
                  </h2>
                  <p className="text-ink-muted text-sm">
                    AI is analyzing your document
                  </p>
                </div>

                {/* Preview thumbnail - Industrial frame */}
                {imageDataUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={mechanicalSpring}
                    className="mb-6 flex justify-center"
                  >
                    <div className="relative p-1 bg-chassis rounded-xl shadow-neu-card">
                      <div className="w-28 h-28 rounded-lg overflow-hidden shadow-neu-recessed">
                        <img
                          src={imageDataUrl}
                          alt="Processing"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Processing LED */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent shadow-led-red animate-pulse" />
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
                transition={mechanicalSpring}
                className="w-full max-w-md"
              >
                {/* Error panel - Industrial style */}
                <div className="bg-chassis rounded-xl shadow-neu-card p-6 text-center">
                  {/* Corner screws */}
                  <div 
                    className="absolute inset-0 pointer-events-none rounded-xl"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 14px 14px, rgba(0,0,0,0.1) 2px, transparent 3px),
                        radial-gradient(circle at calc(100% - 14px) 14px, rgba(0,0,0,0.1) 2px, transparent 3px),
                        radial-gradient(circle at 14px calc(100% - 14px), rgba(0,0,0,0.1) 2px, transparent 3px),
                        radial-gradient(circle at calc(100% - 14px) calc(100% - 14px), rgba(0,0,0,0.1) 2px, transparent 3px)
                      `
                    }}
                  />
                  
                  <div className="w-20 h-20 rounded-full bg-chassis shadow-neu-floating flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-error" />
                  </div>

                  <h2 className="text-xl font-bold text-ink text-embossed mb-2 uppercase tracking-wide">
                    System Error
                  </h2>
                  <p className="text-ink-muted mb-6 text-sm">{error}</p>

                  <Button onClick={handleReset}>
                    RETRY OPERATION
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Industrial Footer */}
      <footer className="flex-shrink-0 px-6 py-2">
        <div className="max-w-6xl mx-auto">
          <div className="bg-chassis rounded-lg shadow-neu-card px-5 py-2 border-2 border-shadow/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LEDIndicator active={true} color="green" />
                <span className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest">
                  SYSTEM OPERATIONAL
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono text-ink-muted/60 uppercase tracking-wider">
                  BUILT FOR ENTREXT •{" "}
                  <span className="text-accent font-bold">TABLESNAP</span>
                </span>
                <a 
                  href="https://github.com/Swastidp/tablesnap" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-chassis shadow-neu-button flex items-center justify-center hover:shadow-neu-floating hover:scale-105 active:shadow-neu-pressed transition-all duration-200"
                  title="View on GitHub"
                >
                  <Github className="w-5 h-5 text-ink-muted hover:text-accent transition-colors" />
                </a>
                <VentSlots count={3} />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
