import React from 'react';
import { CallHistoryProvider } from '../context/CallHistoryContext';
import CallHistoryTable from '../components/CallHistoryTable';

const CallHistoryPage: React.FC = () => {
  return (
    <CallHistoryProvider>
      <div className="min-h-screen bg-[#f4f6f9] p-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Contact Center Insights</h1>
          <p className="text-lg text-gray-500 mb-8 font-medium">View and manage your Amazon Connect call logs</p>
          <div className="w-full">
            <CallHistoryTable />
          </div>
        </div>
      </div>
    </CallHistoryProvider>
  );
};

export default CallHistoryPage;
