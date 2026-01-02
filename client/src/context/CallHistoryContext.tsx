/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import type { CallHistory } from "@/types/CallHistory";
import { fetchCallHistory } from "@/services/callHistoryService";
import { getDefaultDateRange } from "@/utils/date/date";

export interface DateRangeParams {
  startTime: string;
  endTime: string;
}

export interface CallHistoryContextType {
  history: CallHistory[];
  loading: boolean;
  error: string | null;
  setDateRange: (range: DateRangeParams) => void;
  loadMore: () => void;
  hasMore: boolean;
}

export const CallHistoryContext = createContext<CallHistoryContextType | undefined>(undefined);

export const CallHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<CallHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRangeState] = useState<DateRangeParams>(getDefaultDateRange());
  const [nextToken, setNextToken] = useState<string | null>(null);
  
  const isInitialMount = useRef(true);
  const LIMIT = 10;

  const loadData = useCallback(async (token: string | null = null, range?: DateRangeParams) => {
    setLoading(true);
    setError(null);

    const usedRange = range ?? dateRange;

    try {
      const response = await fetchCallHistory({
        startTime: usedRange.startTime,
        endTime: usedRange.endTime,
        limit: LIMIT,
        nextToken: token ?? undefined,
      });

      setHistory(prev => token ? [...prev, ...response.items] : response.items);
      setNextToken(response.nextToken ?? null);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load call history");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  const setDateRange = useCallback((range: DateRangeParams) => {
    setDateRangeState(range);
    setHistory([]);
    setNextToken(null);
    loadData(null, range);
  }, [loadData]);

  const loadMore = useCallback(() => {
    if (nextToken && !loading) {
      loadData(nextToken);
    }
  }, [nextToken, loading, loadData]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      loadData(null, dateRange);
    }
  }, [dateRange, loadData]);

  return (
    <CallHistoryContext.Provider
      value={{
        history,
        loading,
        error,
        setDateRange,
        loadMore,
        hasMore: !!nextToken,
      }}
    >
      {children}
    </CallHistoryContext.Provider>
  );
};

export const useCallHistory = () => {
  const context = React.useContext(CallHistoryContext);
  if (!context) throw new Error("useCallHistory must be used within CallHistoryProvider");
  return context;
};