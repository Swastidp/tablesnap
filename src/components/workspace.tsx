"use client";

import { motion } from "framer-motion";
import { ImageViewer } from "@/components/image-viewer";
import { EditableTable } from "@/components/editable-table";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, FileSpreadsheet, Image as ImageIcon } from "lucide-react";
import Papa from "papaparse";

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

export function Workspace({
  imageSrc,
  tableData,
  onDataChange,
  onReset,
}: WorkspaceProps) {
  // Export to CSV
  const handleExportCSV = () => {
    const csvData = tableData.rows.map((row) => {
      const orderedRow: Record<string, string> = {};
      tableData.headers.forEach((header) => {
        // Remove [?] markers for clean export
        orderedRow[header] = (row[header] || "").replace(/\s*\[\?\]\s*/g, "");
      });
      return orderedRow;
    });

    const csv = Papa.unparse(csvData, {
      columns: tableData.headers,
    });

    // Create and trigger download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `tablesnap-export-${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 to-primary-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-primary-200 px-6 py-3"
      >
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-primary-500 hover:text-primary-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Image
            </Button>
            <div className="h-6 w-px bg-primary-200" />
            <h1 className="text-xl font-semibold text-primary-800">
              Verify & Export
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-primary-500">
              {tableData.rows.length} rows • {tableData.headers.length} columns
            </span>
            <Button onClick={handleExportCSV} size="default">
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main content - Split View */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-1/2 border-r border-primary-200 bg-white/40 flex flex-col"
        >
          <div className="flex-1 flex flex-col p-4 min-h-0">
            {/* Panel header */}
            <div className="flex-shrink-0 flex items-center gap-2 mb-3 px-2">
              <ImageIcon className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-600">
                Original Image
              </span>
            </div>
            
            {/* Image viewer */}
            <div className="flex-1 rounded-xl overflow-hidden border border-primary-200 bg-primary-50 min-h-0">
              <ImageViewer src={imageSrc} alt="Uploaded document" />
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-1/2 bg-white/60 flex flex-col min-h-0"
        >
          <div className="flex-1 flex flex-col p-4 min-h-0">
            {/* Panel header */}
            <div className="flex-shrink-0 flex items-center gap-2 mb-3 px-2">
              <FileSpreadsheet className="w-4 h-4 text-accent-500" />
              <span className="text-sm font-medium text-primary-600">
                Extracted Data
              </span>
              <span className="text-xs text-primary-400 ml-2">
                (Click cells to edit)
              </span>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto min-h-0">
              <EditableTable data={tableData} onDataChange={onDataChange} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
