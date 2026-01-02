/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { useCallHistory } from "../../context/CallHistoryContext";
import { BASE_COLUMNS, EXTRA_COLUMNS, type ExtraColumnKey } from "@/utils/table/columns";
import { useState } from "react";
import ColumnSelector from "@/components/Table/ColumnSelector";

const ContactHistory = () => {
  const { history, loading, loadMore, hasMore } = useCallHistory();
  const [extraColumns, setExtraColumns] = useState<ExtraColumnKey[]>([]);

  const columns = [
    ...BASE_COLUMNS,
    ...EXTRA_COLUMNS.filter((c) => extraColumns.includes(c.key)),
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ColumnSelector selected={extraColumns} onChange={setExtraColumns} />
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table className="bg-background text-foreground">
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {history.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-4">
                  No call history available
                </TableCell>
              </TableRow>
            ) : (
              history.map((row) => (
                <TableRow key={row.contactId}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {String((row as any)[col.key] ?? "-")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="secondary"
            disabled={loading}
            onClick={loadMore}
          >
            {loading ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContactHistory;