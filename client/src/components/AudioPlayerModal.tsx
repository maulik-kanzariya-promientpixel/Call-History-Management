import React from 'react';

interface AudioPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  audioUri: string | null;
}

const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({ isOpen, onClose, audioUri }) => {
  if (!isOpen || !audioUri) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
          <h3 className="text-white font-semibold text-lg">Playback Recording</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </div>
          <audio controls className="w-full" autoPlay>
            <source src={audioUri} type="audio/wav" />
            <source src={audioUri} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <p className="mt-4 text-sm text-gray-500 text-center">
            Playing recording from secured storage
          </p>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerModal;
