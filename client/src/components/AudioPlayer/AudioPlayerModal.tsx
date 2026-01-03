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
      <DialogContent className="sm:max-w-md bg-white text-card-foreground dark:bg-card dark:text-card-foreground shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground dark:text-foreground">
            <Volume2 className="h-5 w-5 text-primary dark:text-primary" />
            Call Recording
          </DialogTitle>
          <DialogDescription className="text-muted-foreground dark:text-muted-foreground">
            Playback audio recording from secure storage
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Playback Container */}
          <div className="flex items-center justify-center p-6 bg-card rounded-lg shadow-sm">
            <Volume2 className="h-12 w-12 text-primary" />
          </div>

          {/* Audio Player */}
          <div className="space-y-2">
            <audio
              controls
              className="w-full h-10 bg-card text-card-foreground rounded-md shadow-inner"
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

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="border-border text-foreground bg-card hover:bg-muted"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AudioPlayerModal;
