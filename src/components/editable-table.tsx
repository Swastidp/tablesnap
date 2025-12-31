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
import { Input } from "@/components/ui/input";
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

  const onBlur = () => {
    setIsFocused(false);
    // @ts-expect-error - table.options.meta is custom
    table.options.meta?.updateData(row.index, column.id, value);
  };

  const hasUncertainty = value?.includes("[?]");

  return (
    <div className={cn("relative editable-cell rounded", isFocused && "z-10")}>
      <Input
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={onBlur}
        className={cn(
          "border-transparent bg-transparent hover:bg-primary-50 focus:bg-white h-9 px-2",
          hasUncertainty && "bg-warning-light border-warning text-warning"
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
}: {
  header: string;
  onHeaderChange: (oldHeader: string, newHeader: string) => void;
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
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="h-8 px-2 font-semibold text-primary-700 bg-white border-accent-300 focus:border-accent-500"
      />
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="font-semibold text-primary-700 hover:text-accent-600 cursor-pointer text-left w-full px-1 py-0.5 rounded hover:bg-primary-100 transition-colors"
      title="Click to edit column name"
    >
      {header}
    </button>
  );
}

export function EditableTable({ data, onDataChange }: EditableTableProps) {
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

  // Create columns from headers
  const columns = useMemo<ColumnDef<Record<string, string>, string>[]>(
    () =>
      headers.map((header) => ({
        accessorKey: header,
        header: () => (
          <EditableHeader header={header} onHeaderChange={updateHeader} />
        ),
        cell: EditableCell,
      })),
    [headers, updateHeader]
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
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-xl border border-primary-200 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-primary-50 hover:bg-primary-50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-1">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="p-1 w-12">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteRow(row.index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-error hover:text-error hover:bg-error-light"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center text-primary-400"
                >
                  No data to display.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add row button */}
      <div className="mt-3 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={addRow}
          className="text-primary-500 hover:text-primary-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Row
        </Button>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-primary-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-warning-light border border-warning" />
          <span>AI uncertain</span>
        </div>
        <span>Click cells or column headers to edit</span>
      </div>
    </div>
  );
}
