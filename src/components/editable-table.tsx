"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  CellContext,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TableData {
  headers: string[];
  rows: Record<string, string>[];
}

interface EditableTableProps {
  data: TableData;
  onDataChange: (data: TableData) => void;
  formatCurrency?: boolean;
}

// Editable cell component
function EditableCell({
  getValue,
  row,
  column,
  table,
}: CellContext<Record<string, string>, string>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  // Get row and column indices for keyboard navigation
  const rowIndex = row.index;
  // @ts-expect-error - table.options.meta is custom
  const colIndex = table.options.meta?.getColumnIndex(column.id) ?? 0;
  // @ts-expect-error - table.options.meta is custom
  const totalRows = table.options.meta?.totalRows ?? 0;
  // @ts-expect-error - table.options.meta is custom
  const totalCols = table.options.meta?.totalCols ?? 0;
  
  // Check if column is numeric for right alignment
  const isNumeric = (column.columnDef.meta as { isNumeric?: boolean })?.isNumeric ?? false;
  // @ts-expect-error - table.options.meta is custom
  const formatCurrency = table.options.meta?.formatCurrency ?? false;

  // Format value as currency if needed
  const formatAsCurrency = (val: string): string => {
    if (!formatCurrency || !isNumeric || !val) return val;
    // Remove any existing currency formatting and parse
    const cleanedVal = val.replace(/[\$,\s]/g, '').replace(/\[\?\]/g, '');
    const num = parseFloat(cleanedVal);
    if (isNaN(num)) return val;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  const onBlur = () => {
    setIsFocused(false);
    // @ts-expect-error - table.options.meta is custom
    table.options.meta?.updateData(row.index, column.id, value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isArrowKey = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key);
    const isEnter = e.key === "Enter";

    if (isArrowKey || isEnter) {
      let targetRow = rowIndex;
      let targetCol = colIndex;

      switch (e.key) {
        case "ArrowUp":
          targetRow = Math.max(0, rowIndex - 1);
          break;
        case "ArrowDown":
          targetRow = Math.min(totalRows - 1, rowIndex + 1);
          break;
        case "Enter":
          // Enter moves down, or adds a new row if at the last row
          if (rowIndex === totalRows - 1) {
            // @ts-expect-error - table.options.meta is custom
            table.options.meta?.addRow();
            // Focus the new row after a short delay to allow React to render
            setTimeout(() => {
              const nextCell = document.getElementById(`cell-${rowIndex + 1}-${colIndex}`);
              nextCell?.focus();
            }, 50);
            return;
          }
          targetRow = rowIndex + 1;
          break;
        case "ArrowLeft":
          targetCol = Math.max(0, colIndex - 1);
          break;
        case "ArrowRight":
          targetCol = Math.min(totalCols - 1, colIndex + 1);
          break;
      }

      // Prevent default behavior (scrolling, form submission)
      if (isArrowKey) {
        e.preventDefault();
      }

      // Focus the target cell
      const targetId = `cell-${targetRow}-${targetCol}`;
      const targetCell = document.getElementById(targetId);
      if (targetCell) {
        targetCell.focus();
      }
    }
  };

  const hasUncertainty = value?.includes("[?]");

  return (
    <div className={cn("relative editable-cell rounded", isFocused && "z-10", isNumeric && "text-right")}>
      <input
        id={`cell-${rowIndex}-${colIndex}`}
        value={isFocused ? (value || "") : (formatAsCurrency(value) || "")}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full h-9 px-3 rounded-md font-mono text-sm text-ink bg-chassis border-none transition-all duration-150",
          "shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff]",
          "hover:shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff]",
          "focus:outline-none focus:shadow-[inset_3px_3px_6px_#babecc,inset_-3px_-3px_6px_#ffffff,0_0_0_2px_#ff4757]",
          hasUncertainty && "bg-warning-light shadow-[inset_2px_2px_4px_rgba(245,158,11,0.3),inset_-2px_-2px_4px_#ffffff] text-warning pr-8",
          isNumeric && "text-right"
        )}
      />
      {hasUncertainty && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-warning" title="AI is uncertain about this value">
          <AlertCircle className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}

// Editable header component
function EditableHeader({
  header,
  onHeaderChange,
  isNumeric = false,
}: {
  header: string;
  onHeaderChange: (oldHeader: string, newHeader: string) => void;
  isNumeric?: boolean;
}) {
  const [value, setValue] = useState(header);
  const [isEditing, setIsEditing] = useState(false);

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== header && value.trim() !== "") {
      onHeaderChange(header, value.trim());
    } else {
      setValue(header);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    } else if (e.key === "Escape") {
      setValue(header);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className={cn(
          "h-8 px-2 w-full rounded font-mono font-bold text-xs uppercase tracking-wider text-ink bg-chassis border-none",
          "shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff]",
          "focus:outline-none focus:shadow-[inset_2px_2px_4px_#babecc,inset_-2px_-2px_4px_#ffffff,0_0_0_2px_#ff4757]",
          isNumeric && "text-right"
        )}
      />
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className={cn(
        "font-mono font-bold text-xs uppercase tracking-wider text-ink-muted hover:text-accent cursor-pointer w-full px-1 py-0.5 rounded transition-colors text-embossed",
        isNumeric ? "text-right" : "text-left"
      )}
      title="Click to edit column name"
    >
      {header}
    </button>
  );
}

export function EditableTable({ data, onDataChange, formatCurrency = false }: EditableTableProps) {
  const [tableData, setTableData] = useState<Record<string, string>[]>(data.rows);
  const [headers, setHeaders] = useState<string[]>(data.headers);

  // Sync changes to parent via useEffect to avoid setState during render
  const tableDataRef = React.useRef(tableData);
  tableDataRef.current = tableData;

  // Update header name
  const updateHeader = useCallback((oldHeader: string, newHeader: string) => {
    if (oldHeader === newHeader) return;
    
    // Update headers array
    setHeaders((oldHeaders) => 
      oldHeaders.map((h) => (h === oldHeader ? newHeader : h))
    );
    
    // Update all rows to use the new header key
    setTableData((oldData) =>
      oldData.map((row) => {
        const newRow: Record<string, string> = {};
        Object.entries(row).forEach(([key, value]) => {
          newRow[key === oldHeader ? newHeader : key] = value;
        });
        return newRow;
      })
    );
  }, []);

  // Helper function to check if a column should be right-aligned (numeric column)
  const isNumericColumn = useCallback((header: string): boolean => {
    const numericKeywords = [
      "price", "amount", "qty", "quantity", "total", "cost", "tax", "rate",
      "sum", "subtotal", "discount", "fee", "charge", "balance", "payment",
      "number", "no", "#", "count", "unit", "weight", "size", "percent", "%"
    ];
    const lowerHeader = header.toLowerCase();
    return numericKeywords.some((keyword) => lowerHeader.includes(keyword));
  }, []);

  // Create columns from headers
  const columns = useMemo<ColumnDef<Record<string, string>, string>[]>(
    () =>
      headers.map((header) => {
        const isNumeric = isNumericColumn(header);
        return {
          accessorKey: header,
          header: () => (
            <EditableHeader header={header} onHeaderChange={updateHeader} isNumeric={isNumeric} />
          ),
          cell: (props) => <EditableCell {...props} />,
          meta: {
            isNumeric,
          },
        };
      }),
    [headers, updateHeader, isNumericColumn]
  );

  // Update data handler
  const updateData = useCallback(
    (rowIndex: number, columnId: string, value: string) => {
      setTableData((old) => {
        const newData = old.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...old[rowIndex],
              [columnId]: value,
            };
          }
          return row;
        });
        return newData;
      });
    },
    []
  );

  // Notify parent after state update
  useEffect(() => {
    onDataChange({ headers: headers, rows: tableData });
  }, [tableData, headers, onDataChange]);

  // Add new row
  const addRow = useCallback(() => {
    const newRow: Record<string, string> = {};
    headers.forEach((header) => {
      newRow[header] = "";
    });
    setTableData((old) => [...old, newRow]);
  }, [headers]);

  // Delete row
  const deleteRow = useCallback(
    (rowIndex: number) => {
      setTableData((old) => old.filter((_, index) => index !== rowIndex));
    },
    []
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData,
      addRow,
      getColumnIndex: (columnId: string) => headers.indexOf(columnId),
      totalRows: tableData.length,
      totalCols: headers.length,
      formatCurrency,
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-lg overflow-hidden bg-chassis shadow-neu-card md:overflow-visible overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted hover:bg-muted border-shadow/50">
                {headerGroup.headers.map((header) => {
                  const isNumeric = (header.column.columnDef.meta as { isNumeric?: boolean })?.isNumeric ?? false;
                  return (
                    <TableHead 
                      key={header.id} 
                      className={cn("font-mono font-bold text-xs uppercase tracking-widest text-ink-muted px-3 text-embossed", isNumeric && "text-right")}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
                <TableHead className="w-12"></TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group"
                >
                  {row.getVisibleCells().map((cell) => {
                    const isNumeric = (cell.column.columnDef.meta as { isNumeric?: boolean })?.isNumeric ?? false;
                    return (
                      <TableCell key={cell.id} className={cn("px-3 py-1", isNumeric && "text-right")}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell className="p-1 w-12">
                    <button
                      onClick={() => deleteRow(row.index)}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-150 h-8 w-8 rounded-lg bg-chassis shadow-neu-button hover:shadow-neu-floating active:shadow-neu-pressed active:translate-y-[1px] flex items-center justify-center text-error"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center text-ink-muted font-mono uppercase tracking-wide"
                >
                  NO DATA TO DISPLAY
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add row button */}
      <div className="mt-4 flex justify-center">
        <Button
          variant="secondary"
          size="sm"
          onClick={addRow}
        >
          <Plus className="w-4 h-4 mr-2" />
          ADD ROW
        </Button>
      </div>

      {/* Legend - Industrial style */}
      <div className="mt-4 px-4 py-2 rounded-lg bg-muted shadow-neu-recessed">
        <div className="flex items-center justify-center gap-6 text-[10px] font-mono font-bold uppercase tracking-wider text-ink-muted">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-warning-light shadow-[inset_1px_1px_2px_rgba(245,158,11,0.3)]" />
            <span>AI UNCERTAIN</span>
          </div>
          <span>•</span>
          <span>CLICK CELLS TO EDIT</span>
        </div>
      </div>
    </div>
  );
}
