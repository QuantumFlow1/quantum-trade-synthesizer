
import { TradingDataPoint } from "@/utils/tradingData";
import { 
  ComposedChart, 
  ReferenceLine,
  Legend,
  Brush,
  ResponsiveContainer,
  Line
} from "recharts";
import { useChartType } from "../hooks/useChartType";
import { useRef, useState, useEffect } from "react";
import { DrawingToolsOverlay } from "./DrawingToolsOverlay";
import { ChartTooltip } from "./types/ChartTooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, CalendarDays } from "lucide-react";
import { ReplayControls } from "./ReplayControls";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface PriceChartProps {
  data: TradingDataPoint[];
  chartType?: "candles" | "line" | "area" | "bars";
  showDrawingTools?: boolean;
  showExtendedData?: boolean;
  secondaryIndicator?: string;
  showReplayMode?: boolean;
}

export const PriceChart = ({ 
  data, 
  chartType = "candles", 
  showDrawingTools = false,
  showExtendedData = false,
  secondaryIndicator,
  showReplayMode = false
}: PriceChartProps) => {
  const { renderChart } = useChartType(data, chartType);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [showExtendedAlert, setShowExtendedAlert] = useState(false);
  
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
  
  // Handle showing extended data alert
  useEffect(() => {
    if (showExtendedData) {
      setShowExtendedAlert(true);
      const timer = setTimeout(() => {
        setShowExtendedAlert(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showExtendedData]);
  
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
  };
  
  // Reset replay to beginning
  const handleReset = () => {
    setIsPlaying(false);
    setReplayProgress(0);
    setReplayData([data[0]]);
    
    if (replayTimerRef.current) {
      clearInterval(replayTimerRef.current);
    }
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
    
    const simulatedEndData = {
      ...data[data.length - 1],
      name: format(end, 'MMM dd yyyy')
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
    
    // Here you would typically fetch new data based on the timeframe
    // For this demo, we'll just reset the replay
    handleReset();
  };
  
  // Render secondary indicator if provided
  const renderSecondaryIndicator = () => {
    if (!secondaryIndicator) return null;
    
    return (
      <Line
        type="monotone"
        dataKey={secondaryIndicator}
        stroke="#f59e0b"
        strokeWidth={2}
        dot={false}
        name={secondaryIndicator.toUpperCase()}
      />
    );
  };

  return (
    <div className="relative h-full" ref={chartContainerRef}>
      {showExtendedAlert && (
        <Alert variant="warning" className="absolute top-2 right-2 z-10 w-auto">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Loading extended historical data...
          </AlertDescription>
        </Alert>
      )}
      
      {showDrawingTools && (
        <DrawingToolsOverlay containerRef={chartContainerRef} />
      )}
      
      {isReplayMode && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <ReplayControls 
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            onSpeedChange={handleSpeedChange}
            currentSpeed={replaySpeed}
            progress={replayProgress}
            onProgressChange={handleProgressChange}
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={handleDateRangeChange}
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={handleTimeframeChange}
          />
        </div>
      )}
      
      {renderChart(renderSecondaryIndicator, isReplayMode ? replayData : data)}
    </div>
  );
};
