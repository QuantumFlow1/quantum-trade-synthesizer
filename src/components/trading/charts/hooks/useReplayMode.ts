
import { useState, useRef, useEffect } from "react";
import { TradingDataPoint } from "@/utils/tradingData";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

export interface ReplayModeOptions {
  showReplayMode?: boolean;
  data: TradingDataPoint[];
}

export const useReplayMode = ({ showReplayMode = false, data }: ReplayModeOptions) => {
  // Replay mode state
  const [isReplayMode, setIsReplayMode] = useState(showReplayMode);
  const [replayData, setReplayData] = useState<TradingDataPoint[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [replayProgress, setReplayProgress] = useState(0);
  const [replaySpeed, setReplaySpeed] = useState(1);
  const replayTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Date range state
  const now = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);
  
  const [startDate, setStartDate] = useState<Date>(oneWeekAgo);
  const [endDate, setEndDate] = useState<Date>(now);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1h");

  // Initialize replay data when component mounts or data changes
  useEffect(() => {
    if (isReplayMode && data.length > 0) {
      // Start with just the first data point
      setReplayData([data[0]]);
      setReplayProgress(0);
    }
  }, [data, isReplayMode]);
  
  // Handle replay progress tracking
  useEffect(() => {
    if (isReplayMode && isPlaying) {
      // Clear any existing timer
      if (replayTimerRef.current) {
        clearInterval(replayTimerRef.current);
      }
      
      // Set up a new timer based on current speed
      replayTimerRef.current = setInterval(() => {
        setReplayProgress(prev => {
          const newProgress = prev + 1;
          
          // If we've reached the end, stop playing
          if (newProgress >= 100) {
            setIsPlaying(false);
            clearInterval(replayTimerRef.current!);
            return 100;
          }
          
          // Update the displayed data based on the progress
          const dataIndex = Math.floor((data.length * newProgress) / 100);
          setReplayData(data.slice(0, dataIndex + 1));
          
          return newProgress;
        });
      }, 1000 / replaySpeed); // Adjust interval based on speed
      
      // Clean up the timer on unmount
      return () => {
        if (replayTimerRef.current) {
          clearInterval(replayTimerRef.current);
        }
      };
    }
  }, [isReplayMode, isPlaying, replaySpeed, data]);
  
  // Toggle play/pause
  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
    
    toast({
      title: isPlaying ? "Paused" : "Playing",
      description: isPlaying ? "Replay paused" : "Replay started",
      duration: 1500,
    });
  };
  
  // Reset replay to beginning
  const handleReset = () => {
    setIsPlaying(false);
    setReplayProgress(0);
    setReplayData([data[0]]);
    
    if (replayTimerRef.current) {
      clearInterval(replayTimerRef.current);
    }
    
    toast({
      title: "Reset",
      description: "Replay reset to beginning",
      duration: 1500,
    });
  };
  
  // Handle manual progress change
  const handleProgressChange = (progress: number) => {
    setReplayProgress(progress);
    
    const dataIndex = Math.floor((data.length * progress) / 100);
    setReplayData(data.slice(0, dataIndex + 1));
  };
  
  // Handle speed change
  const handleSpeedChange = (speed: number) => {
    setReplaySpeed(speed);
    
    toast({
      title: "Speed Changed",
      description: `Playback speed set to ${speed}x`,
      duration: 1500,
    });
    
    // Restart the interval if we're playing
    if (isPlaying && replayTimerRef.current) {
      clearInterval(replayTimerRef.current);
      replayTimerRef.current = setInterval(() => {
        setReplayProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            setIsPlaying(false);
            clearInterval(replayTimerRef.current!);
            return 100;
          }
          
          const dataIndex = Math.floor((data.length * newProgress) / 100);
          setReplayData(data.slice(0, dataIndex + 1));
          
          return newProgress;
        });
      }, 1000 / speed);
    }
  };
  
  // Handle date range change
  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    
    // Here you would typically fetch new data based on the date range
    // For this example, we'll simulate a data update
    const simulatedStartData = {
      ...data[0],
      name: format(start, 'MMM dd yyyy')
    };
    
    // Reset replay with the first data point from the new range
    setReplayData([simulatedStartData]);
    setReplayProgress(0);
    setIsPlaying(false);
    
    toast({
      title: "Date Range Updated",
      description: `Showing data from ${format(start, 'MMM dd, yyyy')} to ${format(end, 'MMM dd, yyyy')}`,
      duration: 3000,
    });
  };
  
  // Handle timeframe change
  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
    
    toast({
      title: "Timeframe Updated",
      description: `Chart now showing ${timeframe} data`,
      duration: 3000,
    });
    
    // Reset the replay
    handleReset();
  };

  return {
    isReplayMode,
    replayData,
    isPlaying,
    replayProgress,
    replaySpeed,
    startDate,
    endDate,
    selectedTimeframe,
    handlePlayPause,
    handleReset,
    handleProgressChange,
    handleSpeedChange,
    handleDateRangeChange,
    handleTimeframeChange
  };
};
