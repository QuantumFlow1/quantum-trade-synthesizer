
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, FastForward, Clock } from "lucide-react";
import { ReplayControlsProps } from "./types/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

export const ReplayControls = ({
  isPlaying,
  onPlayPause,
  onReset,
  onSpeedChange,
  currentSpeed,
  progress,
  onProgressChange
}: ReplayControlsProps) => {
  
  const handleSpeedChange = (value: string) => {
    const speed = Number(value);
    onSpeedChange(speed);
    
    toast({
      title: "Replay snelheid aangepast",
      description: `Snelheid ingesteld op ${speed}x`,
      duration: 2000,
    });
  };
  
  return (
    <div className="p-2 bg-background/80 backdrop-blur-md border border-border rounded-md flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onPlayPause}
            className="h-8 w-8"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onReset}
            className="h-8 w-8"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <Select 
            value={currentSpeed.toString()} 
            onValueChange={handleSpeedChange}
          >
            <SelectTrigger className="w-[90px] h-8">
              <SelectValue placeholder="Snelheid" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5">0.5x</SelectItem>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
              <SelectItem value="4">4x</SelectItem>
              <SelectItem value="8">8x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="px-1">
        <Slider
          value={[progress]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => onProgressChange(value[0])}
        />
      </div>
    </div>
  );
};
