"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageViewer } from "@/components/image-viewer";
import { EditableTable } from "@/components/editable-table";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, FileSpreadsheet, Image as ImageIcon, Copy, Check, AlertCircle, Zap, DollarSign } from "lucide-react";
import Papa from "papaparse";
import confetti from "canvas-confetti";

interface TableData {
  headers: string[];
  rows: Record<string, string>[];
}

interface WorkspaceProps {
  imageSrc: string;
  tableData: TableData;
  onDataChange: (data: TableData) => void;
  onReset: () => void;
}

// Mechanical spring animation
const mechanicalSpring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

// LED Indicator Component
function LEDIndicator({ active, color = "green" }: { active: boolean; color?: "green" | "red" }) {
  return (
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

import { cn } from "@/lib/utils";

// Tab Button Component for Mobile Switcher
function TabButton({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode 
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 touch-manipulation",
        active 
          ? "bg-chassis shadow-neu-pressed text-accent" 
          : "bg-chassis shadow-neu-button text-ink-muted hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}

export function Workspace({
  imageSrc,
  tableData,
  onDataChange,
  onReset,
}: WorkspaceProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'image' | 'table'>('table');
  const [exportMessage, setExportMessage] = useState("");
  const [formatCurrency, setFormatCurrency] = useState(false);

  // Copy to clipboard as TSV (Tab-Separated Values)
  const handleCopyToClipboard = async () => {
    const headerRow = tableData.headers.join("\t");
    const dataRows = tableData.rows.map((row) =>
      tableData.headers
        .map((header) => (row[header] || "").replace(/\s*\[\?\]\s*/g, ""))
        .join("\t")
    );
    const tsvString = [headerRow, ...dataRows].join("\n");

    try {
      await navigator.clipboard.writeText(tsvString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const csvData = tableData.rows.map((row) => {
      const orderedRow: Record<string, string> = {};
      tableData.headers.forEach((header) => {
        orderedRow[header] = (row[header] || "").replace(/\s*\[\?\]\s*/g, "");
      });
      return orderedRow;
    });

    const csv = Papa.unparse(csvData, {
      columns: tableData.headers,
    });

    const filename = `tablesnap-export-${Date.now()}.csv`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success message
    setExportMessage(`✅ Downloaded: ${filename}`);
    setTimeout(() => setExportMessage(""), 3000);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-chassis">
      {/* Industrial Control Panel Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={mechanicalSpring}
        className="flex-shrink-0 bg-chassis shadow-neu-card border-b border-shadow/30 px-3 py-2 md:px-6 md:py-3"
      >
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          {/* Left side - Navigation and Status */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile: icon only, Desktop: icon + text */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-ink-muted hover:text-accent min-h-[44px] md:min-h-0 touch-manipulation"
            >
              <ArrowLeft className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">NEW SCAN</span>
            </Button>
            
            <div className="hidden md:block h-8 w-px bg-shadow" />
            
            {/* Status indicator - Desktop only */}
            <div className="hidden md:flex items-center gap-3">
              <LEDIndicator active={tableData.rows.length > 0} color="green" />
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink-muted">
                DATA VERIFIED
              </span>
            </div>
          </div>

          {/* Center - Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-chassis shadow-neu-button flex items-center justify-center">
              <Zap className="w-4 h-4 text-accent" />
            </div>
            <h1 className="hidden md:block text-lg font-bold text-ink text-embossed uppercase tracking-wide">
              Verification Console
            </h1>
            <h1 className="md:hidden text-sm font-bold text-ink text-embossed uppercase tracking-wide">
              TableSnap
            </h1>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {tableData.rows.length > 0 && (
              <>
                {/* Stats display - Desktop only */}
                <div className="hidden md:block px-3 py-1.5 rounded-lg bg-muted shadow-neu-recessed">
                  <span className="text-xs font-mono font-bold text-ink-muted">
                    {tableData.rows.length} ROWS • {tableData.headers.length} COLS
                  </span>
                </div>
                
                {/* Copy button - Desktop: full text, Mobile: icon only */}
                <Button
                  variant="secondary"
                  size="default"
                  onClick={handleCopyToClipboard}
                  className="hidden md:inline-flex min-w-[130px]"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-success" />
                      COPIED
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      COPY
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleCopyToClipboard}
                  className="md:hidden min-h-[44px] min-w-[44px] touch-manipulation"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                
                {/* Export button - Desktop: full text, Mobile: icon only */}
                <Button onClick={handleExportCSV} size="default" className="hidden md:inline-flex">
                  <Download className="w-4 h-4 mr-2" />
                  EXPORT CSV
                </Button>
                <Button onClick={handleExportCSV} size="icon" className="md:hidden min-h-[44px] min-w-[44px] touch-manipulation">
                  <Download className="w-4 h-4" />
                </Button>
              </>
            )}
            
            {/* Vent slots - Desktop only */}
            <div className="hidden md:flex">
              <VentSlots count={3} />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Tab Switcher - Only visible on mobile */}
      <div className="flex md:hidden px-3 py-2 bg-chassis border-b border-shadow/30">
        <div className="flex gap-2 rounded-lg bg-muted shadow-neu-recessed p-1 w-full">
          <TabButton 
            active={activeTab === 'image'} 
            onClick={() => setActiveTab('image')}
          >
            <ImageIcon className="w-4 h-4 mr-2 inline" />
            Original
          </TabButton>
          <TabButton 
            active={activeTab === 'table'} 
            onClick={() => setActiveTab('table')}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2 inline" />
            Data
          </TabButton>
        </div>
      </div>

      {/* Main content - Split View Industrial Panels */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 p-2 md:p-4 gap-2 md:gap-4">
        {/* Left Panel - Image Viewer */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, ...mechanicalSpring }}
          className={cn(
            "md:w-1/2 bg-chassis rounded-xl shadow-neu-card flex flex-col overflow-hidden",
            // Mobile: show/hide based on tab, Desktop: always visible
            activeTab === 'image' ? 'flex-1 flex' : 'hidden',
            "md:flex"
          )}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-shadow/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-chassis shadow-neu-button flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink-muted">
                SOURCE IMAGE
              </span>
            </div>
            <div className="hidden md:flex">
              <VentSlots count={3} />
            </div>
          </div>
          
          {/* Image viewer container */}
          <div className="flex-1 p-4 min-h-0">
            <div className="h-full rounded-lg overflow-hidden shadow-neu-recessed">
              <ImageViewer src={imageSrc} alt="Uploaded document" />
            </div>
          </div>
          
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
        </motion.div>

        {/* Right Panel - Data Table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, ...mechanicalSpring }}
          className={cn(
            "md:w-1/2 bg-chassis rounded-xl shadow-neu-card flex flex-col overflow-hidden relative",
            // Mobile: show/hide based on tab, Desktop: always visible
            activeTab === 'table' ? 'flex-1 flex' : 'hidden',
            "md:flex"
          )}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-shadow/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-chassis shadow-neu-button flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-ink-muted">
                EXTRACTED DATA
              </span>
              {tableData.rows.length > 0 && (
                <span className="hidden md:inline text-[10px] font-mono text-ink-muted/60 ml-2">
                  [CLICK TO EDIT]
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Format Currency Toggle */}
              {tableData.rows.length > 0 && (
                <button
                  onClick={() => setFormatCurrency(!formatCurrency)}
                  className={cn(
                    "hidden md:flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all",
                    formatCurrency 
                      ? "bg-accent text-white shadow-neu-pressed" 
                      : "bg-muted text-ink-muted shadow-neu-button hover:shadow-neu-floating"
                  )}
                  title="Format numbers as currency"
                >
                  <DollarSign className="w-3 h-3" />
                  <span>Currency</span>
                </button>
              )}
              <LEDIndicator active={tableData.rows.length > 0} color="green" />
              <div className="hidden md:flex">
                <VentSlots count={3} />
              </div>
            </div>
          </div>

          {/* Table or Empty State */}
          <div className="flex-1 overflow-auto min-h-0 p-4 max-w-full">
            <div className="md:w-full overflow-x-auto">
            {tableData.rows.length > 0 ? (
              <EditableTable data={tableData} onDataChange={onDataChange} formatCurrency={formatCurrency} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <div className="w-20 h-20 rounded-full bg-chassis shadow-neu-floating flex items-center justify-center mb-6">
                  <AlertCircle className="w-10 h-10 text-ink-muted" />
                </div>
                <h3 className="text-lg font-bold text-ink text-embossed mb-2 uppercase tracking-wide">
                  No Table Detected
                </h3>
                <p className="text-sm text-ink-muted mb-6 max-w-sm">
                  The image may not contain a clear table structure, or the quality might be too low for accurate extraction.
                </p>
                <Button onClick={onReset}>
                  TRY ANOTHER IMAGE
                </Button>
              </div>
            )}
            </div>
          </div>
          
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
        </motion.div>
      </div>

      {/* Success Toast Notification */}
      <AnimatePresence>
        {exportMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={mechanicalSpring}
            className="fixed bottom-6 right-6 bg-success text-white px-4 py-3 rounded-lg shadow-lg font-mono text-sm font-bold z-50"
          >
            {exportMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
