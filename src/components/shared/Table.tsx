import {
  ColumnDef,
  ColumnPinningState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  Column,
} from "@tanstack/react-table";
import { Fragment, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    headerAlign?: "left" | "center" | "right";
  }
}

const DEFAULT_ITEMS_PER_PAGE = 25;

interface SummaryKeyConfig<T = unknown> {
  key: string;
  value?: string | string[];
  customValue?: string;
  customCalculation?: (data: T[]) => string | number;
  align?: string;
}

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  loadingRowCount?: number;
  showSearch?: boolean;
  searchPosition?: "end" | "start" | "center";
  onSearch?: (value: string) => void;
  className?: string;
  prependWithSearch?: ReactNode;
  appendWithSearch?: ReactNode;
  title?: string | ReactNode;
  pageSize?: number;
  maxHeight?: string;
  loadingHeight?: number;
  summaryKeys?: SummaryKeyConfig<T>[];
  summaryPosition?: "top" | "bottom";
  sortByKey?: string;
  sortOrder?: "asc" | "desc";
  showPagination?: boolean;
  isMobile?: boolean;
  leftPinnedColumnIds?: string[];
  rightPinnedColumnIds?: string[];
  renderRowDetails?: (row: T) => ReactNode;
  onRowClick?: (row: T) => void;
  emptyState?: ReactNode;
}

// Helper to get nested value by dot notation
function getNestedValue(obj: unknown, path: string): unknown {
  if (typeof obj !== "object" || obj === null) return undefined;
  return path.split(".").reduce((acc: unknown, part: string) => {
    if (typeof acc === "object" && acc !== null && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

// Helper for sticky pinning styles (TanStack Table v8)
function getCommonPinningStyles<T>(
  column: Column<T>,
  isScrolledLeft: boolean,
  isScrolledRight: boolean,
  stickPosition: "bottom" | "top" | "both" = "bottom"
): React.CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  const showLeftShadow = isLastLeftPinnedColumn && isScrolledLeft;
  const showRightShadow = isFirstRightPinnedColumn && isScrolledRight;

  const shadows: string[] = [];

  // 👇 Bottom border shadow (equivalent to Tailwind's shadow-[inset_0_-1px_0_0_#e5e5e5])
  if (stickPosition === "both") {
    shadows.push(`inset 0 -1px 0 0 #e5e5e5`);
    shadows.push(`inset 0 1px 0 0 #e5e5e5`);
  } else {
    shadows.push(
      `inset 0 ${stickPosition === "bottom" ? "-1px" : "1px"} 0 0 #e5e5e5`
    );
  }

  // 👇 Left/right scroll shadows
  if (showLeftShadow) {
    shadows.push("inset -4px 0 4px -4px gray");
  } else if (showRightShadow) {
    shadows.push("inset 4px 0 4px -4px gray");
  }

  return {
    boxShadow: shadows.join(", "),
    left: isPinned === "left" ? `${column.getStart("left") ?? 0}px` : undefined,
    right:
      isPinned === "right" ? `${column.getAfter("right") ?? 0}px` : undefined,
    position: isPinned ? "sticky" : "unset",
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
    backgroundColor: "hsl(var(--card))",
  };
}

export function Table<T>({
  data,
  columns,
  isLoading = false,
  loadingRowCount = 3,
  showSearch = false,
  searchPosition = "end",
  onSearch,
  className = "",
  prependWithSearch = null,
  appendWithSearch = null,
  pageSize = DEFAULT_ITEMS_PER_PAGE,
  title = null,
  maxHeight = "500px",
  loadingHeight = 3,
  summaryKeys,
  summaryPosition = "bottom",
  sortByKey,
  sortOrder,
  showPagination = true,
  leftPinnedColumnIds = [],
  rightPinnedColumnIds = [],
  renderRowDetails,
  onRowClick,
  emptyState,
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(() =>
    sortByKey && sortOrder
      ? [{ id: sortByKey, desc: sortOrder === "desc" }]
      : []
  );
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState<number>(pageSize);
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: leftPinnedColumnIds,
    right: rightPinnedColumnIds,
  });
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const toggleRow = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  // --- Add scroll state for horizontal shadow ---
  const [isScrolledLeft, setIsScrolledLeft] = useState(false);
  const [isScrolledRight, setIsScrolledRight] = useState(false);

  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    function handleScroll() {
      if (!container) return;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setIsScrolledLeft(scrollLeft > 0);
      setIsScrolledRight(scrollLeft + clientWidth < scrollWidth - 1);
    }

    handleScroll(); // Initial check
    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Reset page when data changes
  useEffect(() => {
    setCurrentPage(0);
  }, [data]);

  // Only reset sorting when data or default sort changes (not on every click)
  useEffect(() => {
    if (sortByKey && sortOrder) {
      setSorting([{ id: sortByKey, desc: sortOrder === "desc" }]);
    }
  }, [data, sortByKey, sortOrder]);

  // Initialize and sync currentPageSize with pageSize prop
  useEffect(() => {
    setCurrentPageSize(pageSize);
  }, []);

  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((row: T) => {
      // Convert row to a string representation of its values for searching
      const searchableString = Object.entries(row as object)
        .filter(([, value]) => value !== null && value !== undefined)
        .map(([, value]) => {
          if (typeof value === "object") {
            return JSON.stringify(value);
          }
          return String(value);
        })
        .join(" ")
        .toLowerCase();

      return searchableString.includes(search.toLowerCase());
    });
  }, [data, search]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      globalFilter: search,
      pagination: {
        pageIndex: currentPage,
        pageSize: currentPageSize,
      },
      columnPinning,
    },
    onColumnPinningChange: setColumnPinning,
    onSortingChange: setSorting,
    pageCount: Math.ceil(filteredData.length / currentPageSize),
    manualPagination: false,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(0); // Reset to first page when searching
    onSearch?.(value);
  };

  // Enhanced summary row calculation
  const summaryRow = useMemo(() => {
    if (!summaryKeys || summaryKeys.length === 0) return null;
    const summary: { [key: string]: React.ReactNode } = {};
    for (const config of summaryKeys) {
      // Check for custom calculation function first
      if (config.customCalculation) {
        const result = config.customCalculation(data);
        summary[config.key] = result;
        continue;
      }

      if (config.customValue !== undefined) {
        summary[config.key] = config.customValue;
        continue;
      }
      let sum = 0;
      if (Array.isArray(config.value)) {
        sum = data.reduce((acc: number, row: T) => {
          let rowSum = 0;
          for (const k of config.value as string[]) {
            const value = getNestedValue(row, k);
            const num =
              typeof value === "string"
                ? Number((value as string).replace(/,/g, ""))
                : Number(value);
            rowSum += isNaN(num) ? 0 : num;
          }
          return acc + rowSum;
        }, 0);
      } else if (typeof config.value === "string") {
        sum = data.reduce((acc: number, row: T) => {
          const value = getNestedValue(row, config.value as string);
          const num =
            typeof value === "string"
              ? Number((value as string).replace(/,/g, ""))
              : Number(value);
          return acc + (isNaN(num) ? 0 : num);
        }, 0);
      } else {
        // fallback: sum the key itself
        sum = data.reduce((acc: number, row: T) => {
          const value = getNestedValue(row, config.key);
          const num =
            typeof value === "string"
              ? Number((value as string).replace(/,/g, ""))
              : Number(value);
          return acc + (isNaN(num) ? 0 : num);
        }, 0);
      }
      summary[config.key] = isNaN(sum)
        ? ""
        : sum.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
    }
    return summary;
  }, [data, summaryKeys]);

  // Render summary row as a <tr>
  const renderSummaryRow = () => {
    if (!summaryRow || !summaryKeys) return null;
    const stickyClass =
      summaryPosition === "top"
        ? "sticky-summary-row-top"
        : summaryPosition === "bottom"
          ? "sticky-summary-row-bottom"
          : "";
    return (
      <tr
        className={`bg-muted/30 font-semibold text-foreground group border-t border-border ${stickyClass}`}
      >
        {table.getAllLeafColumns().map((column, idx) => {
          const colId = column.id;
          // Find the summary config for this column
          const config = colId
            ? summaryKeys.find((sk) => sk.key === colId)
            : undefined;
          // Use align if provided, fallback to default
          const cellAlign = config?.align || (idx === 0 ? "left" : "right");
          return (
            <td
              key={colId || idx}
              className={`px-4 py-3 m-0 bg-muted/30 group-hover:bg-muted/50 ${cellAlign === "left"
                ? "text-left text-xs uppercase"
                : cellAlign === "center"
                  ? "text-center"
                  : "text-right"
                }`}
              style={{
                ...getCommonPinningStyles(
                  column,
                  isScrolledLeft,
                  isScrolledRight,
                  "both"
                ),
                minWidth: column.columnDef.minSize,
                maxWidth: column.columnDef.maxSize,
                ...(cellAlign === "left" ||
                  cellAlign === "right" ||
                  cellAlign === "center"
                  ? { textAlign: cellAlign as "left" | "right" | "center" }
                  : {}),
              }}
            >
              <span className={!colId || !summaryRow[colId] ? "opacity-0" : ""}>
                {colId && summaryRow[colId] ? summaryRow[colId] : "-"}
              </span>
            </td>
          );
        })}
      </tr>
    );
  };

  // Custom header click handler for sorting
  function handleHeaderClick(columnId: string) {
    setSorting((prev) => {
      if (prev.length === 0 || prev[0].id !== columnId) {
        // New column: always start with desc
        return [{ id: columnId, desc: true }];
      } else {
        // Same column: toggle desc/asc
        return [{ id: columnId, desc: !prev[0].desc }];
      }
    });
  }

  const totalPages = Math.ceil(filteredData.length / currentPageSize);

  const handlePageSizeChange = (newSize: number) => {
    setCurrentPageSize(newSize);
    setCurrentPage(0); // Reset to first page when changing page size
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {showSearch && (
        <div className="flex items-center justify-between mb-6">
          {title || <div />}
          <div className={`flex items-center justify-${searchPosition} gap-2`}>
            {prependWithSearch}
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-sm px-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-input transition-all"
            />
            {appendWithSearch}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <div
            id="table-container"
            ref={tableContainerRef}
            className="overflow-y-auto"
            style={{ maxHeight }}
          >
            <div style={{ width: "100%" }}>
              <table className="w-full text-sm text-left text-foreground table-fixed border-collapse">
                <thead className="text-xs text-foreground uppercase bg-muted sticky top-0 z-10 border-b border-border">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="bg-muted group">
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className={`py-3 px-4 bg-muted group-hover:bg-muted/80 font-semibold text-left ${header.column.getCanSort()
                            ? "cursor-pointer select-none hover:text-foreground transition-colors"
                            : ""
                            }`}
                          onClick={() => handleHeaderClick(header.column.id)}
                          style={{
                            ...getCommonPinningStyles(
                              header.column,
                              isScrolledLeft,
                              isScrolledRight
                            ),
                            minWidth: header.column.columnDef.minSize,
                            maxWidth: header.column.columnDef.maxSize,
                          }}
                        >
                          <div
                            className={`flex items-center gap-2 ${header.column.columnDef.meta?.headerAlign ===
                              "right"
                              ? "justify-end"
                              : header.column.columnDef.meta?.headerAlign ===
                                "center"
                                ? "justify-center"
                                : "justify-start"
                              }`}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            {{
                              asc: " ↑",
                              desc: " ↓",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                  {summaryPosition === "top" && renderSummaryRow()}
                </thead>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: loadingRowCount }).map((_, index) => (
                      <tr key={index}>
                        {columns.map((_, colIndex) => (
                          <td
                            key={colIndex}
                            className="px-4 py-3 border-b"
                            style={{ height: `${loadingHeight}rem` }}
                          >
                            <div className="animate-pulse bg-muted h-full rounded"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <Fragment key={row.id}>
                        <tr
                          className={`bg-card hover:bg-muted/30 group border-b border-border transition-colors ${onRowClick || renderRowDetails ? "cursor-pointer" : ""
                            }`}
                          onClick={() => {
                            if (onRowClick) onRowClick(row.original);
                            if (renderRowDetails) toggleRow(row.id);
                          }}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="px-4 py-3 bg-card group-hover:bg-muted/30 text-foreground"
                              style={{
                                ...getCommonPinningStyles(
                                  cell.column,
                                  isScrolledLeft,
                                  isScrolledRight
                                ),
                                minWidth: cell.column.columnDef.minSize,
                                maxWidth: cell.column.columnDef.maxSize,
                              }}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                {
                                  ...cell.getContext(),
                                  isExpanded: expandedRows[row.id]
                                } as any
                              )}
                            </td>
                          ))}
                        </tr>
                        <AnimatePresence initial={false}>
                          {expandedRows[row.id] && renderRowDetails && (
                            <motion.tr
                              key={`expanded-${row.id}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="bg-muted/30"
                            >
                              <td colSpan={columns.length} className="p-0 border-b">
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: "auto" }}
                                  exit={{ height: 0 }}
                                  transition={{ duration: 0.2, ease: "easeInOut" }}
                                  className="overflow-hidden"
                                >
                                  {renderRowDetails(row.original)}
                                </motion.div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </Fragment>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-4 py-8 text-center text-muted-foreground"
                      >
                        {emptyState || "No data available"}
                      </td>
                    </tr>
                  )}
                </tbody>
                {summaryPosition === "bottom" && (
                  <tfoot>{renderSummaryRow()}</tfoot>
                )}
              </table>
            </div>
          </div>
        </div>

        {showPagination && !isLoading && filteredData.length > 0 && (
          <div className="flex flex-col gap-4 px-6 py-4 bg-card border-t border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap">Rows per page:</span>
                  <Select
                    value={currentPageSize.toString()}
                    onValueChange={(value) => handlePageSizeChange(Number(value))}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <span className="whitespace-nowrap">
                  Showing {currentPage * currentPageSize + 1} to{" "}
                  {Math.min((currentPage + 1) * currentPageSize, filteredData.length)} of{" "}
                  {filteredData.length} results
                </span>
              </div>
              <div className="w-full sm:w-auto flex justify-center sm:justify-end">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
                        className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i).map((pageNum) => {
                      if (
                        pageNum === 0 ||
                        pageNum === totalPages - 1 ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNum)}
                              isActive={currentPage === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum + 1}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => currentPage < totalPages - 1 && setCurrentPage(currentPage + 1)}
                        className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
