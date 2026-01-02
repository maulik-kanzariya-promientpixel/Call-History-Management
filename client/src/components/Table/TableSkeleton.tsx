import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns, rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex} className="px-2 py-2">
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
