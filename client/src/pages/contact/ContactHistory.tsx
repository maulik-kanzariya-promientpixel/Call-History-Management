import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-end">
        <ColumnSelector selected={extraColumns} onChange={setExtraColumns} />
      </div>

      <div className="rounded-lg border border-border overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <Table className="min-w-full table-fixed bg-background text-foreground">
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key} className="text-center">
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
                  <TableCell colSpan={columns.length} className="text-center py-8">
                    No call history available
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {history.map((row) => (
                    <TableRow key={String(row.contactId)}>
                      {columns.map((col) => (
                        <TableCell key={col.key} className="text-center">
                          {col.key === "audio" ? (
                            row.recordingS3Uri ? (
                              <Button
                                size="sm"
                                variant="secondary"
                                disabled={loadingAudioRowId === String(row.contactId)}
                                onClick={() => handlePlayAudio(String(row.contactId))}
                              >
                                {loadingAudioRowId === String(row.contactId) ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Play"
                                )}
                              </Button>
                            ) : (
                              <span className="block text-center">-</span>
                            )
                          ) : (
                            <span className="block text-center">{String((row as any)[col.key] ?? "-")}</span>
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
          {isFetchingNextPage && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
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
