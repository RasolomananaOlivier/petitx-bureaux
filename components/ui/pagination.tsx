"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 10;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 5) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push(10, 20, 30, 40, 50);
      } else if (currentPage >= totalPages - 4) {
        pages.push(1, 10, 20, 30, 40);
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1, 10, 20, 30, 40);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          if (!pages.includes(i)) {
            pages.push(i);
          }
        }
        pages.push(50);
      }
    }

    return pages.sort((a, b) => a - b);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm text-gray-600">Accéder à la page:</span>
      {visiblePages.map((page, index) => {
        const isCurrentPage = page === currentPage;
        const isSpecialPage = [10, 20, 30, 40, 50].includes(page);

        return (
          <React.Fragment key={page}>
            {index > 0 && visiblePages[index - 1] !== page - 1 && (
              <span className="text-gray-400">...</span>
            )}
            <Button
              variant={isCurrentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={cn(
                "h-8 w-8 p-0",
                isCurrentPage && "bg-blue-600 text-white border-blue-600",
                isSpecialPage && !isCurrentPage && "text-gray-600"
              )}
            >
              {page}
            </Button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
