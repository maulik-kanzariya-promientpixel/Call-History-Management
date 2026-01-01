import React, { useState, useMemo } from 'react';
import { useCallHistory } from '../context/CallHistoryContext';
import AudioPlayerModal from './AudioPlayerModal';

const ITEMS_PER_PAGE = 5;

const CallHistoryTable: React.FC = () => {
  const { history, loading, error, refreshHistory } = useCallHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDirection, setFilterDirection] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecording, setSelectedRecording] = useState<string | null>(null);

  const getBadgeColor = (direction: string) => {
    switch (direction.toUpperCase()) {
      case 'INBOUND': return 'bg-green-100 text-green-800 border-green-200';
      case 'OUTBOUND': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'TRANSFER': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CALLBACK': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredData = useMemo(() => {
    return history.filter(call => {
      const matchesSearch =
        call.customerPhone.includes(searchTerm) ||
        call.agentUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.contactId.includes(searchTerm);
      const matchesFilter = filterDirection === 'ALL' || call.direction === filterDirection;
      return matchesSearch && matchesFilter;
    });
  }, [history, searchTerm, filterDirection]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const exportHistory = () => {
    if (filteredData.length === 0) return;

    const headers = [
      'Contact ID',
      'Direction',
      'Customer Phone',
      'Agent',
      'Start Time',
      'End Time',
      'Recording URI',
      'Created At'
    ];

    const rows = filteredData.map(call => [
      call.contactId,
      call.direction,
      call.customerPhone,
      call.agentUsername,
      new Date(call.callStartTime).toISOString(),
      new Date(call.callEndTime).toISOString(),
      call.recordingS3Uri,
      new Date(call.createdAt).toISOString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => {
        const cellValue = cell === null || cell === undefined ? '' : String(cell);
        return `"${cellValue.replace(/"/g, '""')}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `call-history-${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
      <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
    </tr>
  );

  if (error) return (
    <div className="p-8 text-center text-red-500 font-medium bg-red-50 rounded-lg mx-auto max-w-lg mt-10 border border-red-100 shadow-sm">
      <div className="mb-2"> Error loading data</div>
      {error}
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <h2 className="text-xl font-semibold text-gray-900 whitespace-nowrap">Call History</h2>
            <span className="bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-xs font-medium">
              {history.length} Total
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search phone, agent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={filterDirection}
              onChange={(e) => setFilterDirection(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="ALL">All Directions</option>
              <option value="INBOUND">Inbound</option>
              <option value="OUTBOUND">Outbound</option>
              <option value="TRANSFER">Transfer</option>
              <option value="CALLBACK">Callback</option>
            </select>

            <div className='items-center flex'>
              <div className='bg-indigo-600 text-white px-4 py-2 rounded-lg cursor-pointer' onClick={exportHistory}>Export</div>
            </div>
            <button
              onClick={refreshHistory}
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Refresh Data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Direction</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Phone</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Agent</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">End Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : paginatedData.length > 0 ? (
                paginatedData.map((call) => (
                  <tr key={call.contactId} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono" title={call.contactId}>
                      {call.contactId.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeColor(call.direction)}`}>
                        {call.direction}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">{call.customerPhone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {call.agentUsername ? <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          {call.agentUsername.charAt(0).toUpperCase()}
                        </div>
                        {call.agentUsername}
                      </div> : "-"}


                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(call.callStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(call.callEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {call.recordingS3Uri ? (
                        <button
                          onClick={() => setSelectedRecording(call.recordingS3Uri)}
                          className="flex items-center text-indigo-600 hover:text-indigo-900 font-medium transition-colors group-hover:bg-indigo-50 px-3 py-1 rounded-md -ml-3"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Listen
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs italic">No Rec</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(call.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>No call history found matching your filters.</p>
                      <button
                        onClick={() => { setSearchTerm(''); setFilterDirection('ALL'); }}
                        className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredData.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100 mt-4">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}</span> of <span className="font-medium">{filteredData.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === idx + 1
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                    }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <AudioPlayerModal
        isOpen={!!selectedRecording}
        onClose={() => setSelectedRecording(null)}
        audioUri={selectedRecording}
      />
    </>
  );
};

export default CallHistoryTable;
