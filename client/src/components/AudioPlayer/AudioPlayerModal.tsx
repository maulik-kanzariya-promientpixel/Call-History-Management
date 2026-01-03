import React from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
 
interface AudioPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  audioUri: string | null;
}
 
const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({ isOpen, onClose, audioUri }) => {
  if (!isOpen || !audioUri) return null;
 
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md dark:bg-white dark:text-black bg-black text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Call Recording
          </DialogTitle>
          <DialogDescription>
            Playback audio recording from secure storage
          </DialogDescription>
        </DialogHeader>
       
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center p-6 dark:bg-gray-50 bg-gray-950 rounded-lg">
            <Volume2 className="h-12 w-12 text-muted-foreground" />
          </div>
         
          <div className="space-y-2">
            <audio
              controls
              className="w-full h-10"
              autoPlay
              style={{
                borderRadius: '0.5rem',
              }}
            >
              <source src={audioUri} type="audio/wav" />
              <source src={audioUri} type="audio/mpeg" />
              <source src={audioUri} type="audio/ogg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
 
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
 
export default AudioPlayerModal;