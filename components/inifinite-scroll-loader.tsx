import { TableRow, TableCell } from "@/components/ui/table";
import { SkeletonCard, SkeletonTable } from "./skeleton-card";
import { Loader2 } from "lucide-react";

interface InfiniteScrollLoaderProps {
  isFetchingNextPage: boolean;
  variant?: "table" | "card" | "spinner";
  colSpan?: number;
  cardCount?: number;
}

export function InfiniteScrollLoader({
  isFetchingNextPage,
  variant = "table",
  colSpan = 10,
  cardCount = 3,
}: InfiniteScrollLoaderProps) {
  if (!isFetchingNextPage) return null;

  if (variant === "spinner") {
    return (
      <div className="flex justify-center items-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (variant === "card") {
    return (
      <>
        {Array.from({ length: cardCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </>
    );
  }

  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="py-3">
        <div className="flex flex-col gap-2">
          <SkeletonTable />
        </div>
      </TableCell>
    </TableRow>
  );
}