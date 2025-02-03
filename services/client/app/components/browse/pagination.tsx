import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const windowSize = 3;
  let startPage = Math.max(1, currentPage - 1);
  if (startPage > totalPages - windowSize + 1) {
    startPage = Math.max(1, totalPages - windowSize + 1);
  }

  const pages: number[] = [];
  for (let i = 0; i < windowSize && startPage + i <= totalPages; i++) {
    pages.push(startPage + i);
  }

  return (
    <div className="flex items-center justify-center mt-8 gap-2">
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Prev
      </Button>

      {currentPage > 2 && totalPages > windowSize && (
        <>
          <Button variant="outline" onClick={() => onPageChange(1)}>
            1
          </Button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Button
          key={page}
          variant="outline"
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 ${
            page === currentPage
              ? "bg-primary text-primary-foreground shadow hover:bg-primary/90"
              : "bg-secondary text-primary-foreground shadow hover:bg-primary/50"
          }`}
        >
          {page}
        </Button>
      ))}

      {startPage + windowSize - 1 < totalPages && totalPages > windowSize && (
        <>
          {startPage + windowSize < totalPages && (
            <span className="px-2">...</span>
          )}
          <Button variant="outline" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Next <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
}
