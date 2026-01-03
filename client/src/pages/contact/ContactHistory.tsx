import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Phone } from "lucide-react";
import { format } from "date-fns";

import ColumnSelector from "@/components/Table/ColumnSelector";
import { TableSkeleton } from "@/components/Table/TableSkeleton";
import AudioPlayerModal from "@/components/AudioPlayer/AudioPlayerModal";

import { useCallHistory } from "@/context/CallHistoryContext";
import { BASE_COLUMNS, EXTRA_COLUMNS, type ExtraColumnKey } from "@/utils/table/columns";

import { useEffect, useRef, useState } from "react";
import { fetchRecording } from "@/services/callHistoryService";

const ContactHistory = () => {
  const {
    history,
    loading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCallHistory();

  const [extraColumns, setExtraColumns] = useState<ExtraColumnKey[]>([]);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isAudioOpen, setIsAudioOpen] = useState(false);
  const [loadingAudioRowId, setLoadingAudioRowId] = useState<string | null>(null);

  const observerTarget = useRef<HTMLDivElement>(null);

  const columns = [
    ...BASE_COLUMNS,
    ...EXTRA_COLUMNS.filter((c) => extraColumns.includes(c.key)),
    { key: "audio", label: "Audio" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handlePlayAudio = async (contactId: string) => {
    try {
      setLoadingAudioRowId(contactId);
      const { signedUrl } = await fetchRecording(contactId);
      setAudioUri(signedUrl);
      setIsAudioOpen(true);
    } catch {
      alert("Failed to load audio");
    } finally {
      setLoadingAudioRowId(null);
    }
  };

  const formatCellValue = (key: string, value: any) => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-muted-foreground">-</span>;
    }

    switch (key) {
      case "callStartTime":
      case "callEndTime": {
        try {
          const date = typeof value === "string" ? new Date(value) : new Date(value);
          return (
            <div className="flex flex-col items-center">
              <span className="font-medium text-sm">{format(date, "MMM dd, yyyy")}</span>
              <span className="text-xs text-muted-foreground">{format(date, "hh:mm a")}</span>
            </div>
          );
        } catch {
          return <span>{String(value)}</span>;
        }
      }

      case "direction": {
        const directionColors: Record<string, string> = {
          INBOUND: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
          OUTBOUND: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
          TRANSFER: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
          CALLBACK: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
          API: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800",
        };
        
        return (
          <Badge 
            variant="outline" 
            className={directionColors[value] || "bg-gray-500/10 text-gray-700 dark:text-gray-400"}
          >
            {value}
          </Badge>
        );
      }

      case "customerPhone":
      case "systemPhone": {
        const phone = String(value);
        return (
          <span className="font-mono text-sm font-medium">
            {phone}
          </span>
        );
      }

      case "agentUsername": {
        return (
          <span className="font-medium">
            {value || <span className="text-muted-foreground">Unassigned</span>}
          </span>
        );
      }

      case "contactId": {
        return (
          <span className="font-mono text-sm font-semibold">
            {String(value)}
          </span>
        );
      }

      default:
        return <span className="text-sm">{String(value)}</span>;
    }
  };

  return (
    <div className="space-y-6 w-full animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Call History</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all call records
          </p>
        </div>
        <ColumnSelector selected={extraColumns} onChange={setExtraColumns} />
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                {columns.map((col) => (
                  <TableHead key={col.key} className="font-semibold text-foreground text-center">
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && history.length === 0 ? (
                <TableSkeleton columns={columns.length} rows={10} />
              ) : history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Phone className="h-10 w-10 text-muted-foreground/50" />
                      <div>
                        <p className="font-medium text-foreground">No call history available</p>
                        <p className="text-sm text-muted-foreground">Try adjusting your date range or search criteria</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {history.map((row) => (
                    <TableRow 
                      key={String(row.contactId)}
                      className="hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      {columns.map((col) => (
                        <TableCell key={col.key} className="align-middle">
                          {col.key === "audio" ? (
                            row.recordingS3Uri ? (
                              <div className="flex justify-center">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={loadingAudioRowId === String(row.contactId)}
                                  onClick={() => handlePlayAudio(String(row.contactId))}
                                  className="gap-2"
                                >
                                  {loadingAudioRowId === String(row.contactId) ? (
                                    <>
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                      <span>Loading...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Play className="h-3.5 w-3.5" />
                                      <span>Play</span>
                                    </>
                                  )}
                                </Button>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-center block">-</span>
                            )
                          ) : (
                            <div className="flex justify-center">
                              {formatCellValue(col.key, (row as any)[col.key])}
                            </div>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {isFetchingNextPage && <TableSkeleton columns={columns.length} rows={5} />}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {hasNextPage && (
        <div ref={observerTarget} className="flex justify-center py-4">
          {isFetchingNextPage && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading more records...</span>
            </div>
          )}
        </div>
      )}

      <AudioPlayerModal
        isOpen={isAudioOpen}
        audioUri={audioUri}
        onClose={() => setIsAudioOpen(false)}
      />
    </div>
  );
};

export default ContactHistory;
