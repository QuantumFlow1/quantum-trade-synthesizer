
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  PlayCircle, 
  PauseCircle, 
  RotateCcw, 
  Clock, 
  Turtle, 
  Rabbit, 
  CalendarDays,
  Rewind,
  FastForward
} from "lucide-react";
import { useState } from "react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

export interface ReplayControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  currentSpeed: number;
  progress: number;
  onProgressChange: (progress: number) => void;
  startDate?: Date;
  endDate?: Date;
  onDateRangeChange?: (startDate: Date, endDate: Date) => void;
  selectedTimeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
}

export const ReplayControls = ({
  isPlaying,
  onPlayPause,
  onReset,
  onSpeedChange,
  currentSpeed,
  progress,
  onProgressChange,
  startDate,
  endDate,
  onDateRangeChange,
  selectedTimeframe,
  onTimeframeChange
}: ReplayControlsProps) => {
  const [localStartDate, setLocalStartDate] = useState<Date | undefined>(startDate);
  const [localEndDate, setLocalEndDate] = useState<Date | undefined>(endDate);
  
  const handleDateApply = () => {
    if (localStartDate && localEndDate && onDateRangeChange) {
      if (localStartDate > localEndDate) {
        toast({
          title: "Invalid Date Range",
          description: "Start date cannot be after end date",
          variant: "destructive"
        });
        return;
      }
      
      onDateRangeChange(localStartDate, localEndDate);
      toast({
        title: "Date Range Applied",
        description: `Showing data from ${format(localStartDate, 'MMM dd, yyyy')} to ${format(localEndDate, 'MMM dd, yyyy')}`
      });
    }
  };
  
  // Function to handle rewind (go back 10% in the replay)
  const handleRewind = () => {
    const newProgress = Math.max(0, progress - 10);
    onProgressChange(newProgress);
    
    toast({
      title: "Rewinding",
      description: "Moved back 10% in the timeline",
      duration: 1500,
    });
  };
  
  // Function to handle fast forward (go forward 10% in the replay)
  const handleFastForward = () => {
    const newProgress = Math.min(100, progress + 10);
    onProgressChange(newProgress);
    
    toast({
      title: "Fast Forwarding",
      description: "Moved forward 10% in the timeline",
      duration: 1500,
    });
  };
  
  return (
    <div className="bg-background/90 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRewind}
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
              onClick={handleFastForward}
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
            
            <div className="flex items-center space-x-1">
              <Turtle className="h-4 w-4 text-muted-foreground" />
              <Slider 
                className="w-24"
                value={[currentSpeed]} 
                min={0.5} 
                max={5} 
                step={0.5}
                onValueChange={(value) => onSpeedChange(value[0])}
              />
              <Rabbit className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onTimeframeChange && (
              <Select 
                value={selectedTimeframe} 
                onValueChange={onTimeframeChange}
              >
                <SelectTrigger className="w-[110px] h-8">
                  <Clock className="h-4 w-4 mr-1" />
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Timeframe</SelectLabel>
                    <SelectItem value="1m">1 Minute</SelectItem>
                    <SelectItem value="5m">5 Minutes</SelectItem>
                    <SelectItem value="15m">15 Minutes</SelectItem>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="4h">4 Hours</SelectItem>
                    <SelectItem value="1d">1 Day</SelectItem>
                    <SelectItem value="1w">1 Week</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  Date Range
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="end">
                <div className="space-y-3">
                  <h4 className="font-medium">Select Date Range</h4>
                  
                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <Label htmlFor="start-date">Start Date</Label>
                      <div className="flex gap-2">
                        <Calendar
                          mode="single"
                          selected={localStartDate}
                          onSelect={setLocalStartDate}
                          className="rounded-md border"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-1">
                      <Label htmlFor="end-date">End Date</Label>
                      <div className="flex gap-2">
                        <Calendar
                          mode="single"
                          selected={localEndDate}
                          onSelect={setLocalEndDate}
                          className="rounded-md border"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full" onClick={handleDateApply}>
                    Apply Range
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground min-w-8">
            {Math.floor(progress)}%
          </span>
          <Slider 
            value={[progress]} 
            min={0} 
            max={100} 
            step={1}
            onValueChange={(value) => onProgressChange(value[0])}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};
