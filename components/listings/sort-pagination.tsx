// components/listings/sort-pagination.tsx
"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { useSearchParamsManager } from "@/hooks/use-search-params";
import { SORT_OPTIONS, PAGINATION_OPTIONS } from "@/lib/constants";

interface SortPaginationProps {
  totalCount: number;
}

export default function SortPagination({ totalCount }: SortPaginationProps) {
  const { updateSearchParams, getParam, getAllParams } = useSearchParamsManager();

  const initialSortBy = getParam("sortBy") || "createdAt";
  const initialSortOrder = getParam("sortOrder") || "desc";
  const initialPage = Number(getParam("page")) || 1;
  const initialLimit = Number(getParam("limit")) || 10;

  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<string>(initialSortOrder);
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);

  // Sync local state with URL on initial load
  useEffect(() => {
    setSortBy(initialSortBy);
    setSortOrder(initialSortOrder);
    setPage(initialPage);
    setLimit(initialLimit);
  }, [getAllParams()]);

  const handleSortByChange = (value: string) => {
    setSortBy(value);
    updateSearchParams("sortBy", value);
  };

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value);
    updateSearchParams("sortOrder", value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateSearchParams("page", newPage);
  };

  const handleLimitChange = (value: string) => {
    const newLimit = Number(value);
    setLimit(newLimit);
    updateSearchParams("limit", newLimit);
    // Reset page to 1 when limit changes to avoid out-of-bounds pages
    setPage(1);
    updateSearchParams("page", 1);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
      {/* Sorting */}
      <div className="flex items-center gap-2">
        <Label htmlFor="sortBy">Sort By:</Label>
        <Select value={sortBy} onValueChange={handleSortByChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={handleSortOrderChange}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Desc</SelectItem>
            <SelectItem value="asc">Asc</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href="#"
                isActive={pageNumber === page}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              className={page === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Limit */}
      <div className="flex items-center gap-2">
        <Label htmlFor="limit">Show:</Label>
        <Select value={String(limit)} onValueChange={handleLimitChange}>
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder="Limit" />
          </SelectTrigger>
          <SelectContent>
            {PAGINATION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
