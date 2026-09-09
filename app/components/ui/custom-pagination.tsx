import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { useSearchParams } from "react-router";
import type { Pagination as TPagination } from "~/types";
import { cn } from "~/lib/utils";

interface CustomPaginationProps {
  pagination?: TPagination | null;
  maxVisiblePages?: number;
  className?: string;
  scrollToTop?: boolean;
  queryParamName?: string;
}

export function CustomPagination({
  pagination,
  maxVisiblePages = 2,
  className,
  scrollToTop = true,
  queryParamName = "page",
}: Readonly<CustomPaginationProps>) {
  const [searchParams, setSearchParams] = useSearchParams();
  if (!pagination) return null;

  const { page, totalPages, hasNext, hasPrev } = pagination;

  if (totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    if (newPage === page) return;
    if (newPage >= 1 && newPage <= totalPages) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(queryParamName, String(newPage));

      setSearchParams(newParams, { replace: true });

      if (scrollToTop) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const getVisiblePages = () => {
    const pages: number[] = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, page - halfVisible);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 1;
  const showEndEllipsis = (visiblePages.at(-1) ?? 0) < totalPages;

  return (
    <Pagination className={cn(className, "mt-10")}>
      <PaginationContent className="gap-1 md:gap-2">
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (hasNext) handlePageChange(page + 1);
            }}
            className={cn(
              "border rounded-md px-3 py-2 transition-all duration-200",
              hasNext
                ? "hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm cursor-pointer"
                : "pointer-events-none opacity-40 bg-gray-100 dark:bg-gray-800",
            )}
          />
        </PaginationItem>

        {showStartEllipsis && (
          <>
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(1);
                }}
                className="border rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationEllipsis className="px-2" />
          </>
        )}

        {visiblePages.map((pageNum) => (
          <PaginationItem key={pageNum}>
            <PaginationLink
              href="#"
              isActive={pageNum === page}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(pageNum);
              }}
              className={cn(
                "border rounded-md px-3 py-2 transition-all duration-200",
                pageNum === page
                  ? "bg-primary text-primary-foreground dark:text-white/80 hover:bg-primary/90 shadow-sm"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800",
              )}
            >
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}

        {showEndEllipsis && (
          <>
            <PaginationEllipsis className="px-2" />
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(totalPages);
                }}
                className="border rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (hasPrev) handlePageChange(page - 1);
            }}
            className={cn(
              "border rounded-md px-3 py-2 transition-all duration-200",
              hasPrev
                ? "hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm cursor-pointer"
                : "pointer-events-none opacity-40 bg-gray-100 dark:bg-gray-800",
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
