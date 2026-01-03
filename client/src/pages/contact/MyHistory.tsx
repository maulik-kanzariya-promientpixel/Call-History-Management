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
import { fetchRecording } from "@/services/callHistoryService";
import { getStoredCredentials } from "@/services/localService";

import { useEffect, useRef, useState } from "react";
const MyHistory = () => {
  const {
    history,
    loading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    setSearchString,
  } = useCallHistory();

  const [extraColumns, setExtraColumns] = useState<ExtraColumnKey[]>([]);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isAudioOpen, setIsAudioOpen] = useState(false);
  const [loadingAudioRowId, setLoadingAudioRowId] = useState<string | null>(null);

  const observerTarget = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const { username: currentUser } = getStoredCredentials();

  useEffect(() => {
    if (initializedRef.current) return;
    if (currentUser) {
      setSearchString(currentUser);
    }
    initializedRef.current = true;
  }, [currentUser, setSearchString]);

  const filteredHistory = history.filter((row) => row.agentUsername === currentUser);

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
    if (!value) return <span className="text-muted-foreground">-</span>;

    switch (key) {
      case "callStartTime":
      case "callEndTime": {
        const date = new Date(value);
        return (
          <div className="flex flex-col items-center">
            <span className="font-medium text-sm">{format(date, "MMM dd, yyyy")}</span>
            <span className="text-xs text-muted-foreground">{format(date, "hh:mm a")}</span>
          </div>
        );
      }
      case "direction": {
        const colors: Record<string, string> = {
          INBOUND: "bg-blue-500/10 text-blue-700 border-blue-200",
          OUTBOUND: "bg-green-500/10 text-green-700 border-green-200",
          TRANSFER: "bg-purple-500/10 text-purple-700 border-purple-200",
          CALLBACK: "bg-orange-500/10 text-orange-700 border-orange-200",
        };
        return (
          <Badge variant="outline" className={colors[value] || "bg-muted text-foreground"}>
            {value}
          </Badge>
        );
      }
      case "customerPhone":
      case "systemPhone":
        return <span className="font-mono text-sm">{value}</span>;
      case "contactId":
        return <span className="font-mono text-sm font-semibold">{value}</span>;
      default:
        return <span className="text-sm">{String(value)}</span>;
    }
  };

  return (
    <div className="space-y-6 w-full animate-fade-in">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your History</h1>
          <p className="text-muted-foreground mt-1">View and manage your call records</p>
        </div>
        <ColumnSelector selected={extraColumns} onChange={setExtraColumns} />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {columns.map((col) => (
                  <TableHead key={col.key} className="text-center">
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && filteredHistory.length === 0 ? (
                <TableSkeleton columns={columns.length} rows={10} />
              ) : filteredHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center">
                    <Phone className="mx-auto h-10 w-10 text-muted-foreground/50" />
                    <p className="mt-2 font-medium">No call history found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredHistory.map((row) => (
                  <TableRow key={row.contactId} className="hover:bg-muted/40">
                    {columns.map((col) => (
                      <TableCell key={col.key} className="text-center">
                        {col.key === "audio" ? (
                          row.recordingS3Uri ? (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={loadingAudioRowId === row.contactId}
                              onClick={() => handlePlayAudio(row.contactId)}
                              className="gap-2"
                            >
                              {loadingAudioRowId === row.contactId ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                              Play
                            </Button>
                          ) : (
                            "-"
                          )
                        ) : (
                          formatCellValue(col.key, (row as any)[col.key])
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Infinite Scroll Loader */}
      {hasNextPage && (
        <div ref={observerTarget} className="flex justify-center py-4">
          {isFetchingNextPage && (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          )}
        </div>
      )}

      {/* Audio Player Modal */}
      <AudioPlayerModal
        isOpen={isAudioOpen}
        audioUri={audioUri}
        onClose={() => setIsAudioOpen(false)}
      />
    </div>
  );
};

export default MyHistory;
