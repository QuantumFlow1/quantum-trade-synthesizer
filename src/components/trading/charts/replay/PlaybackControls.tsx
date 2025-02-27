
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle, RotateCcw, Rewind, FastForward } from "lucide-react";
import { PlaybackControlsProps } from "./types";

export const PlaybackControls = ({
  isPlaying,
  onPlayPause,
  onReset,
  onRewind,
  onFastForward
}: PlaybackControlsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onRewind}
        className="h-8 w-8"
        title="Rewind 10%"
      >
        <Rewind className="h-5 w-5" />
        <span className="sr-only">Rewind</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onPlayPause}
        className="h-8 w-8"
      >
        {isPlaying ? (
          <PauseCircle className="h-6 w-6" />
        ) : (
          <PlayCircle className="h-6 w-6" />
        )}
        <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onFastForward}
        className="h-8 w-8"
        title="Fast Forward 10%"
      >
        <FastForward className="h-5 w-5" />
        <span className="sr-only">Fast Forward</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onReset}
        className="h-8 w-8"
      >
        <RotateCcw className="h-5 w-5" />
        <span className="sr-only">Reset</span>
      </Button>
    </div>
  );
};
