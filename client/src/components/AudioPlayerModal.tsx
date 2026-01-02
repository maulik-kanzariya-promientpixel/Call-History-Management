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
            {/* <source src="https://amazon-connect-b80488cdd462.s3.us-east-1.amazonaws.com/connect/digiclarity-training/CallRecordings/ivr/2025/12/31/b9ed0c14-255b-42f8-81e6-c0c0eb6bb2a3_20251231T09%3A47_UTC.wav?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAXJKFZH5US43HQ5UI%2F20251231%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251231T134921Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAUaCXVzLWVhc3QtMSJGMEQCIFqby%2F9uEGEiWeyv%2F5h5LDmx74Ffdavx3vvJiz1wcWw5AiAwGqoG7qjRaXQPYa9zaR1O8E82YYji5n3jtRNFPa%2FH5CqIAwjO%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDUwMTA0NjkxOTAxNyIM4aVz3K2GLh%2BZJksYKtwCC4lmMEZH1uet2geEErJ58AkR3eDHv3HjJMmZcUqzGx2YnBXVChkt4tayOC%2FwoN0%2BJo5NCc87OXQV4tNp20rJIugjK084gW2v6Wqf7d5oNcmuvQLHKbGs0BNKhcgmqTPjAfoKkhJC2t8tilyYHyVFrBJJ%2Bj9WNnYAnPlGLwpau83GpXnojU6t2jBPr9P7jEQD7%2F78VRjznqYxWF6Kb6xJKP6e3Bfrkhs8ZxBJcMchVzCAsqHMF%2FjTomK7sTtz5PxAGVjqj7Vw%2F1gPKfqba%2FUcfajrNLXHce%2B8M5na8bCkU5%2FbLYb82V2yyiwBWwPuU1hLg%2BMC5AIwpvaIoufQJO5WY8JXu3EleMvAfEIWpkAGH%2FAwdjqDVDWa0%2F94W4xx8go8HOCHwDxSqXxDqMQpSrERZx%2F9MWQGkJlKODU8qoafxVqnWQtyhYejnV%2BUupeKl3z49QlsIKUYym0AQMDQMIq81MoGOqYBhynm4UDpOt%2BruFwJcL0cjpGWKo3XytxDUiQHdUkuc1yyPjiGxb7YBdg8a8WwjukWVOWDXjFtL%2BPdjh%2F%2FHqE652cYwKLs%2Fm81mWCvRw%2FEYYWjPhnPS7HWdezXkwKTOaETjgLq2SVsvsmn21r5TAo6s%2FXOVIbG4z0Eit5B7lIpbWkyoDpxH538fBnjgz2ZzkgSUjU19QcendnsgT%2BZFzSkiqBBzW2F%2Fw%3D%3D&X-Amz-Signature=94dc5bbd0d64cef419d5d6baa59a13ab94a9c2d30b4d6ab8a140667bb77b604d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" type="audio/wav" /> */}
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
