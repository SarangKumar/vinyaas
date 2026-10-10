"use client";

import React, { useId, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "../button";
import { Checkbox } from "../checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Input } from "../input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../pagination";
import { Skeleton } from "../skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";

export type DataTableColumn<TData> = {
  id: string;
  header: React.ReactNode;
  accessorKey?: keyof TData & string;
  cell?: (row: TData) => React.ReactNode;
  sortable?: boolean;
  /** When true, this column participates in search. */
  searchable?: boolean;
  /** When false, the column cannot be hidden. Defaults to true. */
  enableHiding?: boolean;
  /**
   * Column width (CSS length or px number). The table uses a fixed layout so
   * sorting, paging, and search never resize columns; columns without a width
   * share the remaining space equally.
   */
  width?: string | number;
};

export type DataTableProps<TData> = {
  columns: DataTableColumn<TData>[];
  data: TData[];
  getRowId?: (row: TData, index: number) => string;
  searchable?: boolean;
  searchPlaceholder?: string;
  selectable?: boolean;
  /** Enable client-side pagination. Pass a number for page size (default 5). */
  pagination?: boolean | number;
  columnVisibility?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  /** When set, renders a trailing actions column. */
  renderRowActions?: (row: TData) => React.ReactNode;
  /** Width of the trailing actions column. Defaults to 7rem. */
  actionsWidth?: string | number;
};

type SortDirection = "asc" | "desc";

type SortState = {
  columnId: string;
  direction: SortDirection;
} | null;

function defaultRowId<TData>(row: TData, index: number) {
  if (
    row &&
    typeof row === "object" &&
    "id" in row &&
    (typeof (row as { id: unknown }).id === "string" ||
      typeof (row as { id: unknown }).id === "number")
  ) {
    return String((row as { id: string | number }).id);
  }

  return String(index);
}

function cellValue<TData>(column: DataTableColumn<TData>, row: TData) {
  if (column.cell) {
    return column.cell(row);
  }

  if (column.accessorKey) {
    const value = row[column.accessorKey];

    if (value == null) {
      return "";
    }

    return String(value);
  }

  return null;
}

function sortableValue<TData>(column: DataTableColumn<TData>, row: TData) {
  if (column.accessorKey) {
    const value = row[column.accessorKey];

    if (typeof value === "number") {
      return value;
    }

    if (value == null) {
      return "";
    }

    return String(value).toLowerCase();
  }

  const rendered = cellValue(column, row);

  if (typeof rendered === "string" || typeof rendered === "number") {
    return rendered;
  }

  return "";
}

function searchValue<TData>(column: DataTableColumn<TData>, row: TData) {
  if (column.accessorKey) {
    const value = row[column.accessorKey];
    return value == null ? "" : String(value);
  }

  return "";
}

/**
 * Fixed-size slot so switching between unsorted, ascending, and descending
 * never changes the header width.
 */
function SortIcon({ direction }: { direction?: SortDirection }) {
  return (
    <svg
      aria-hidden="true"
      data-slot="data-table-sort-icon"
      data-direction={direction ?? "none"}
      viewBox="0 0 16 16"
      className={cn(
        "size-3.5 shrink-0 transition-colors",
        direction ? "text-foreground" : "text-muted-foreground/60",
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "asc" ? (
        <path d="M8 13V3M4 7l4-4 4 4" />
      ) : direction === "desc" ? (
        <path d="M8 3v10M4 9l4 4 4-4" />
      ) : (
        <path d="m5 6 3-3 3 3M5 10l3 3 3-3" />
      )}
    </svg>
  );
}

function pageList(current: number, total: number) {
  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, total, current]);

  if (current > 1) {
    pages.add(current - 1);
  }

  if (current < total) {
    pages.add(current + 1);
  }

  return [...pages].sort((a, b) => a - b);
}

export function DataTable<TData>({
  columns,
  data,
  getRowId = defaultRowId,
  searchable = false,
  searchPlaceholder = "Search…",
  selectable = false,
  pagination = false,
  columnVisibility = false,
  loading = false,
  emptyMessage = "No results found.",
  className,
  renderRowActions,
  actionsWidth = "7rem",
}: DataTableProps<TData>) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState>(null);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [page, setPage] = useState(1);
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());

  const pageSize =
    typeof pagination === "number"
      ? Math.max(1, pagination)
      : pagination
        ? 5
        : data.length || 1;

  const visibleColumns = useMemo(
    () => columns.filter((column) => !hidden.has(column.id)),
    [columns, hidden],
  );

  const searchableColumns = useMemo(() => {
    const marked = columns.filter((column) => column.searchable);

    if (marked.length > 0) {
      return marked;
    }

    return columns.filter((column) => column.accessorKey);
  }, [columns]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!searchable || !needle) {
      return data;
    }

    return data.filter((row) =>
      searchableColumns.some((column) =>
        searchValue(column, row).toLowerCase().includes(needle),
      ),
    );
  }, [data, query, searchable, searchableColumns]);

  const sorted = useMemo(() => {
    if (!sort) {
      return filtered;
    }

    const column = columns.find((entry) => entry.id === sort.columnId);

    if (!column?.sortable) {
      return filtered;
    }

    const next = [...filtered];

    next.sort((left, right) => {
      const a = sortableValue(column, left);
      const b = sortableValue(column, right);

      if (a < b) {
        return sort.direction === "asc" ? -1 : 1;
      }

      if (a > b) {
        return sort.direction === "asc" ? 1 : -1;
      }

      return 0;
    });

    return next;
  }, [columns, filtered, sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize) || 1);
  const currentPage = Math.min(Math.max(1, page), pageCount);

  const pageRows = useMemo(() => {
    if (!pagination) {
      return sorted.map((row, index) => ({
        row,
        id: getRowId(row, index),
      }));
    }

    const start = (currentPage - 1) * pageSize;

    return sorted.slice(start, start + pageSize).map((row, index) => ({
      row,
      id: getRowId(row, start + index),
    }));
  }, [currentPage, getRowId, pageSize, pagination, sorted]);

  const visibleIds = pageRows.map((entry) => entry.id);
  const selectedVisibleCount = visibleIds.filter((id) =>
    selected.has(id),
  ).length;
  const allVisibleSelected =
    visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;
  const someVisibleSelected =
    selectedVisibleCount > 0 && selectedVisibleCount < visibleIds.length;

  function toggleSort(columnId: string) {
    setPage(1);
    setSort((current) => {
      if (!current || current.columnId !== columnId) {
        return { columnId, direction: "asc" };
      }

      if (current.direction === "asc") {
        return { columnId, direction: "desc" };
      }

      return null;
    });
  }

  function toggleRow(id: string, checked: boolean) {
    setSelected((current) => {
      const next = new Set(current);

      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  }

  function toggleAllVisible(checked: boolean) {
    setSelected((current) => {
      const next = new Set(current);

      for (const id of visibleIds) {
        if (checked) {
          next.add(id);
        } else {
          next.delete(id);
        }
      }

      return next;
    });
  }

  function toggleColumn(columnId: string, visible: boolean) {
    const column = columns.find((entry) => entry.id === columnId);

    if (!column || column.enableHiding === false) {
      return;
    }

    setHidden((current) => {
      const next = new Set(current);

      if (visible) {
        next.delete(columnId);
      } else {
        // Keep at least one visible column.
        const remaining = columns.filter(
          (entry) => entry.id !== columnId && !next.has(entry.id),
        );

        if (remaining.length === 0) {
          return current;
        }

        next.add(columnId);
      }

      return next;
    });
  }

  const colSpan =
    visibleColumns.length + (selectable ? 1 : 0) + (renderRowActions ? 1 : 0);

  const showToolbar = searchable || columnVisibility || selectable;

  return (
    <div
      data-slot="data-table"
      className={cn("flex w-full flex-col gap-3", className)}
    >
      {showToolbar ? (
        <div className="flex flex-wrap items-center gap-2">
          {searchable ? (
            <Input
              id={searchId}
              aria-label={searchPlaceholder}
              placeholder={searchPlaceholder}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              className="max-w-sm min-w-[12rem] flex-1"
            />
          ) : null}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {selectable && selected.size > 0 ? (
              <p className="text-muted-foreground text-sm tabular-nums">
                {selected.size} selected
              </p>
            ) : null}
            {columnVisibility ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button type="button" variant="outline" size="sm">
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {columns.map((column) => {
                    const locked = column.enableHiding === false;
                    const isVisible = !hidden.has(column.id);
                    const label =
                      typeof column.header === "string"
                        ? column.header
                        : column.id;

                    return (
                      <DropdownMenuItem
                        key={column.id}
                        disabled={locked}
                        aria-checked={isVisible}
                        role="menuitemcheckbox"
                        onClick={(event) => {
                          event.preventDefault();

                          if (locked) {
                            return;
                          }

                          toggleColumn(column.id, !isVisible);
                        }}
                      >
                        <span aria-hidden="true" className="w-4 tabular-nums">
                          {isVisible ? "✓" : ""}
                        </span>
                        <span className="min-w-0 flex-1 truncate">{label}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      ) : null}

      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            {selectable ? (
              <TableHead className="w-10">
                <Checkbox
                  aria-label={
                    allVisibleSelected
                      ? "Deselect all rows"
                      : someVisibleSelected
                        ? "Select all rows, some currently selected"
                        : "Select all rows"
                  }
                  checked={allVisibleSelected}
                  indeterminate={someVisibleSelected}
                  disabled={loading || visibleIds.length === 0}
                  onChange={(event) =>
                    toggleAllVisible(event.currentTarget.checked)
                  }
                />
              </TableHead>
            ) : null}
            {visibleColumns.map((column) => {
              const active = sort?.columnId === column.id;
              const direction = active ? sort.direction : undefined;
              const label =
                typeof column.header === "string" ? column.header : column.id;

              return (
                <TableHead
                  key={column.id}
                  style={
                    column.width !== undefined
                      ? { width: column.width }
                      : undefined
                  }
                  aria-sort={
                    direction === "asc"
                      ? "ascending"
                      : direction === "desc"
                        ? "descending"
                        : column.sortable
                          ? "none"
                          : undefined
                  }
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex max-w-full items-center gap-1.5 rounded-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
                      aria-label={
                        direction === "asc"
                          ? `Sort ${label} descending`
                          : direction === "desc"
                            ? `Clear sort on ${label}`
                            : `Sort ${label} ascending`
                      }
                      onClick={() => toggleSort(column.id)}
                    >
                      {column.header}
                      <SortIcon direction={direction} />
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              );
            })}
            {renderRowActions ? (
              <TableHead style={{ width: actionsWidth }}>
                <span className="sr-only">Actions</span>
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: Math.min(pageSize, 5) }, (_, index) => (
              <TableRow key={`loading-${index}`}>
                {selectable ? (
                  <TableCell>
                    <Skeleton className="size-4 rounded" />
                  </TableCell>
                ) : null}
                {visibleColumns.map((column) => (
                  <TableCell key={column.id}>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                ))}
                {renderRowActions ? (
                  <TableCell>
                    <Skeleton className="ml-auto h-4 w-8" />
                  </TableCell>
                ) : null}
              </TableRow>
            ))
          ) : pageRows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={Math.max(colSpan, 1)}
                className="text-muted-foreground h-24 text-center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            pageRows.map(({ row, id }) => (
              <TableRow
                key={id}
                data-state={selected.has(id) ? "selected" : undefined}
                className={selected.has(id) ? "bg-muted/50" : undefined}
              >
                {selectable ? (
                  <TableCell>
                    <Checkbox
                      aria-label={`Select row ${id}`}
                      checked={selected.has(id)}
                      onChange={(event) =>
                        toggleRow(id, event.currentTarget.checked)
                      }
                    />
                  </TableCell>
                ) : null}
                {visibleColumns.map((column) => (
                  <TableCell key={column.id}>
                    {cellValue(column, row)}
                  </TableCell>
                ))}
                {renderRowActions ? (
                  <TableCell className="text-right">
                    {renderRowActions(row)}
                  </TableCell>
                ) : null}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {pagination ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm tabular-nums">
            {sorted.length === 0
              ? "0 results"
              : `Showing ${(currentPage - 1) * pageSize + 1}–${Math.min(
                  currentPage * pageSize,
                  sorted.length,
                )} of ${sorted.length}`}
          </p>
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  disabled={currentPage <= 1 || loading}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                />
              </PaginationItem>
              {pageList(currentPage, pageCount).map(
                (pageNumber, index, list) => {
                  const previous = list[index - 1];
                  const showEllipsis =
                    previous != null && pageNumber - previous > 1;

                  return (
                    <React.Fragment key={pageNumber}>
                      {showEllipsis ? (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : null}
                      <PaginationItem>
                        <PaginationLink
                          isActive={pageNumber === currentPage}
                          disabled={loading}
                          onClick={() => setPage(pageNumber)}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    </React.Fragment>
                  );
                },
              )}
              <PaginationItem>
                <PaginationNext
                  disabled={currentPage >= pageCount || loading}
                  onClick={() =>
                    setPage((current) => Math.min(pageCount, current + 1))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </div>
  );
}
