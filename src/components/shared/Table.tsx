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
import { cn } from "@/lib/utils";
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
  renderMobileCard?: (item: T, index: number) => ReactNode;
  totalCount?: number;
  pageIndex?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualSearching?: boolean;
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
    // boxShadow: shadows.join(", "),
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
  manualPagination = false,
  manualSorting = false,
  manualSearching = false,
  totalCount,
  pageIndex: externalPageIndex,
  onPageChange,
  onPageSizeChange,
  renderMobileCard,
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
        pageIndex: manualPagination ? (externalPageIndex ?? 0) : currentPage,
        pageSize: currentPageSize,
      },
      columnPinning,
    },
    onColumnPinningChange: setColumnPinning,
    onSortingChange: setSorting,
    pageCount: manualPagination
      ? Math.ceil((totalCount || 0) / currentPageSize)
      : Math.ceil(filteredData.length / currentPageSize),
    manualPagination,
    manualSorting,
    manualFiltering: manualSearching,
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

  const handlePageSizeChange = (newSize: number) => {
    setCurrentPageSize(newSize);
    setCurrentPage(0); // Reset to first page when changing page size
    onPageSizeChange?.(newSize);
    onPageChange?.(0);
  };

  const handlePageChange = (newPage: number) => {
    if (manualPagination) {
      onPageChange?.(newPage);
    } else {
      setCurrentPage(newPage);
    }
  };

  const displayPageIndex = manualPagination ? (externalPageIndex ?? 0) : currentPage;
  const displayTotalCount = manualPagination ? (totalCount ?? 0) : filteredData.length;
  const displayTotalPages = manualPagination
    ? Math.ceil((totalCount ?? 0) / currentPageSize)
    : Math.ceil(filteredData.length / currentPageSize);


  return (
    <div className={`space-y-6 ${className}`}>
      {showSearch && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-1">
          {title || <div />}
          <div className={cn(
            "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto",
            searchPosition === 'end' ? 'sm:justify-end' : searchPosition === 'center' ? 'sm:justify-center' : 'sm:justify-start'
          )}>
            {prependWithSearch}
            <div className="relative group flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full sm:min-w-[240px] px-4 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-ring focus:border-input transition-all"
              />
            </div>
            {appendWithSearch}
          </div>
        </div>
      )}
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4 space-y-3">
              <div className="h-6 bg-muted animate-pulse rounded-lg w-3/4" />
              <div className="h-4 bg-muted animate-pulse rounded-lg w-1/2" />
              <div className="flex gap-2">
                <div className="h-8 bg-muted animate-pulse rounded-lg w-20" />
                <div className="h-8 bg-muted animate-pulse rounded-lg w-20" />
              </div>
            </div>
          ))
        ) : table.getRowModel().rows.length > 0 ? (
          table.getRowModel().rows.map((row, index) => (
            <div key={row.id}>
              {renderMobileCard ? (
                renderMobileCard(row.original, index)
              ) : (
                <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                  {row.getVisibleCells().map((cell) => {
                    const header = cell.column.columnDef.header;
                    return (
                      <div key={cell.id} className="flex flex-col mb-3 last:mb-0">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">
                          {typeof header === 'string' ? header : cell.column.id}
                        </span>
                        <div className="text-sm font-medium">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-muted-foreground bg-card rounded-2xl border border-dashed border-border/60">
            {emptyState || "No data available"}
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <div
            id="table-container"
            ref={tableContainerRef}
            className="overflow-y-auto custom-scrollbar-dark"
            style={{ maxHeight }}
          >
            <div style={{ width: "100%" }}>
              <table className="w-full text-sm text-left text-foreground table-fixed border-collapse relative">
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
      </div>

      {showPagination && !isLoading && filteredData.length > 0 && (
        <div className="flex flex-col gap-4 px-4 sm:px-6 py-4 bg-card border-t border-border">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 w-full">
            <div className="flex flex-col sm:flex-row items-center gap-x-8 gap-y-4 text-sm text-muted-foreground w-full lg:w-auto justify-center lg:justify-start">
              <div className="flex items-center gap-3">
                <span className="whitespace-nowrap font-medium">Rows per page:</span>
                <Select
                  value={currentPageSize.toString()}
                  onValueChange={(value) => handlePageSizeChange(Number(value))}
                >
                  <SelectTrigger className="h-9 w-[80px] bg-muted/20 border-border/40 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/40">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <span className="whitespace-nowrap font-medium text-xs sm:text-sm bg-muted/10 px-3 py-1 rounded-full border border-border/10">
                Showing <span className="text-foreground font-bold">{displayPageIndex * currentPageSize + 1}</span> to{" "}
                <span className="text-foreground font-bold">{Math.min((displayPageIndex + 1) * currentPageSize, displayTotalCount)}</span> of{" "}
                <span className="text-foreground font-bold">{displayTotalCount}</span> results
              </span>
            </div>
            <div className="w-full lg:w-auto flex justify-center lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-border/10">
              <Pagination>
                <PaginationContent className="gap-1 sm:gap-2">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => displayPageIndex > 0 && handlePageChange(displayPageIndex - 1)}
                      className={cn(
                        "h-9 px-3 sm:px-4 rounded-xl border-border/40 hover:bg-muted font-bold transition-all",
                        displayPageIndex === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"
                      )}
                    />
                  </PaginationItem>
                  {Array.from({ length: displayTotalPages }, (_, i) => i).map((pageNum) => {
                    if (
                      pageNum === 0 ||
                      pageNum === displayTotalPages - 1 ||
                      (pageNum >= displayPageIndex - 1 && pageNum <= displayPageIndex + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNum)}
                            isActive={displayPageIndex === pageNum}
                            className={cn(
                              "h-9 w-9 sm:h-10 sm:w-10 rounded-xl border-border/40 cursor-pointer font-bold transition-all",
                            )}
                          >
                            {pageNum + 1}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      pageNum === displayPageIndex - 2 ||
                      pageNum === displayPageIndex + 2
                    ) {
                      return (
                        <PaginationItem key={pageNum} className="hidden sm:inline-block">
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => displayPageIndex < displayTotalPages - 1 && handlePageChange(displayPageIndex + 1)}
                      className={cn(
                        "h-9 px-3 sm:px-4 rounded-xl border-border/40 hover:bg-muted font-bold transition-all",
                        displayPageIndex === displayTotalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
