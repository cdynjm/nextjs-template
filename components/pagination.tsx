import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblings?: number; // how many pages to show around current
};

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  siblings = 1,
}: Props) {
  // If there’s only 1 page, don’t show pagination
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];

  const startPage = Math.max(2, page - siblings);
  const endPage = Math.min(totalPages - 1, page + siblings);

  // always show first page
  pages.push(1);

  // left ellipsis
  if (startPage > 2) {
    pages.push("...");
  }

  // middle pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  // right ellipsis
  if (endPage < totalPages - 1) {
    pages.push("...");
  }

  // always show last page if more than 1
  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button
        size="sm"
        variant="outline"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {pages.map((p, idx) =>
        typeof p === "number" ? (
          <Button
            key={idx}
            size="sm"
            variant={p === page ? "default" : "outline"}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ) : (
          <span key={idx} className="px-2 text-gray-400 select-none">
            {p}
          </span>
        )
      )}

      <Button
        size="sm"
        variant="outline"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}