"use client";

import * as React from "react";
import {
  type ColumnDef, type RowSelectionState, flexRender, getCoreRowModel, useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type PageMeta = { page: number; limit: number; total: number; totalPages: number };

type Props<T> = {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  loading?: boolean;
  meta?: PageMeta;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (s: RowSelectionState) => void;
  getRowId?: (row: T) => string;
  emptyState?: React.ReactNode;
  className?: string;
};

/** Server-side data table (pagination from the API) built on TanStack Table + shadcn Table. */
export function DataTable<T>({
  columns, data, loading, meta, onPageChange, onLimitChange, rowSelection, onRowSelectionChange, getRowId, emptyState, className,
}: Props<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    getRowId,
    state: { rowSelection: rowSelection ?? {} },
    enableRowSelection: !!onRowSelectionChange,
    onRowSelectionChange: (updater) => {
      if (!onRowSelectionChange) return;
      onRowSelectionChange(typeof updater === "function" ? updater(rowSelection ?? {}) : updater);
    },
  });

  const colCount = columns.length;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader className="bg-muted/60">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map((h) => (
                  <TableHead key={h.id} style={{ width: h.getSize() !== 150 ? h.getSize() : undefined }} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: colCount }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full max-w-[220px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={colCount} className="p-0">
                  {emptyState ?? <div className="py-12 text-center text-sm text-muted-foreground">No data.</div>}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {meta && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>
              {meta.total === 0 ? "0" : `${(meta.page - 1) * meta.limit + 1}–${Math.min(meta.page * meta.limit, meta.total)}`} of {meta.total}
            </span>
            {onLimitChange && (
              <Select value={String(meta.limit)} onValueChange={(v) => onLimitChange(Number(v))}>
                <SelectTrigger size="sm" className="h-8 w-[110px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} / page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="size-8" disabled={meta.page <= 1} onClick={() => onPageChange?.(1)} aria-label="First page">
              <ChevronsLeft />
            </Button>
            <Button variant="outline" size="icon" className="size-8" disabled={meta.page <= 1} onClick={() => onPageChange?.(meta.page - 1)} aria-label="Previous">
              <ChevronLeft />
            </Button>
            <span className="px-2 font-mono text-xs">
              {meta.page} / {meta.totalPages}
            </span>
            <Button variant="outline" size="icon" className="size-8" disabled={meta.page >= meta.totalPages} onClick={() => onPageChange?.(meta.page + 1)} aria-label="Next">
              <ChevronRight />
            </Button>
            <Button variant="outline" size="icon" className="size-8" disabled={meta.page >= meta.totalPages} onClick={() => onPageChange?.(meta.totalPages)} aria-label="Last page">
              <ChevronsRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
