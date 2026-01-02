import React, { createContext, useState } from "react";
import type { ReactNode } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { CallHistory } from "@/types/CallHistory";
import { fetchCallHistory } from "@/services/callHistoryService";
import { getDefaultDateRange } from "../utils/date/date";

export interface DateRangeParams {
  startTime: string;
  endTime: string;
}

export interface CallHistoryContextType {
  history: CallHistory[];
  loading: boolean;
  error: string | null;
  dateRange: DateRangeParams;
  setDateRange: (range: DateRangeParams) => void;
  setSearchString: (value: string) => void;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export const CallHistoryContext =
  createContext<CallHistoryContextType | undefined>(undefined);

const LIMIT = 10;

export const CallHistoryProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [dateRange, setDateRangeState] = useState<DateRangeParams>(
    getDefaultDateRange()
  );
  const [searchString, setSearchString] = useState("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: [
      "callHistory",
      dateRange.startTime,
      dateRange.endTime,
      searchString,
    ],
    queryFn: ({ pageParam }) =>
      fetchCallHistory({
        startTime: dateRange.startTime,
        endTime: dateRange.endTime,
        limit: LIMIT,
        nextToken: pageParam,
        searchString: searchString || undefined,
      }),
    getNextPageParam: (lastPage) => lastPage.nextToken ?? undefined,
    initialPageParam: undefined as string | undefined,
    staleTime: 1000 * 60 * 5,
  });

  const history = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <CallHistoryContext.Provider
      value={{
        history,
        loading: isLoading,
        error: error?.message ?? null,
        dateRange,
        setDateRange: setDateRangeState,
        setSearchString,
        fetchNextPage,
        hasNextPage: !!hasNextPage,
        isFetchingNextPage,
      }}
    >
      {children}
    </CallHistoryContext.Provider>
  );
};

export const useCallHistory = () => {
  const context = React.useContext(CallHistoryContext);
  if (!context) {
    throw new Error("useCallHistory must be used within CallHistoryProvider");
  }
  return context;
};
