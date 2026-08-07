import { PiArrowLeft, PiArrowRight } from "react-icons/pi";

import "./Pagination.scss";

type PaginationItem = number | `ellipsis-${string}`;

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
};

function paginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const visiblePages = [...new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages])]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);

  return visiblePages.flatMap((page, index) => {
    const previousPage = visiblePages[index - 1];
    return previousPage && page - previousPage > 1 ? [`ellipsis-${previousPage}-${page}` as const, page] : [page];
  });
}

export function Pagination({ className = "", currentPage, onPageChange, pageSize, totalItems }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Catalog pagination" className={`pagination ${className}`.trim()}>
      <button
        aria-label="Previous page"
        className="pagination__direction"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        type="button"
      >
        <PiArrowLeft aria-hidden="true" />
        <span>Previous</span>
      </button>

      <div className="pagination__pages">
        {paginationItems(currentPage, totalPages).map((item) =>
          typeof item === "number" ? (
            <button
              aria-current={item === currentPage ? "page" : undefined}
              aria-label={`Go to page ${item}`}
              className="pagination__page"
              key={item}
              onClick={() => onPageChange(item)}
              type="button"
            >
              {item}
            </button>
          ) : (
            <span aria-hidden="true" className="pagination__ellipsis" key={item}>
              …
            </span>
          )
        )}
      </div>

      <button
        aria-label="Next page"
        className="pagination__direction"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        type="button"
      >
        <span>Next</span>
        <PiArrowRight aria-hidden="true" />
      </button>
    </nav>
  );
}
