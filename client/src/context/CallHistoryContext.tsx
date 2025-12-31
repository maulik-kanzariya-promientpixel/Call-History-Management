import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CallHistory } from '../types/CallHistory';
import { fetchCallHistory } from '../services/callHistoryService';

interface CallHistoryContextType {
  history: CallHistory[];
  loading: boolean;
  error: string | null;
  refreshHistory: () => void;
}

const CallHistoryContext = createContext<CallHistoryContextType | undefined>(undefined);

export const CallHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<CallHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCallHistory();
      setHistory(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load call history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <CallHistoryContext.Provider value={{ history, loading, error, refreshHistory: loadData }}>
      {children}
    </CallHistoryContext.Provider>
  );
};

export const useCallHistory = () => {
  const context = useContext(CallHistoryContext);
  if (context === undefined) {
    throw new Error('useCallHistory must be used within a CallHistoryProvider');
  }
  return context;
};
