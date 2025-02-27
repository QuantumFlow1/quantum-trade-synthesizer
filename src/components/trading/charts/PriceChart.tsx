
import { TradingDataPoint } from "@/utils/tradingData";
import { useChartType } from "../hooks/useChartType";
import { useRef } from "react";
import { DrawingToolsOverlay } from "./DrawingToolsOverlay";
import { ReplayControls } from "./ReplayControls";
import { useReplayMode } from "./hooks/useReplayMode";
import { ExtendedDataAlert } from "./ExtendedDataAlert";
import { SecondaryIndicator } from "./SecondaryIndicator";

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
  
  // Use our new hook to manage replay state
  const {
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
  } = useReplayMode({ showReplayMode, data });

  return (
    <div className="relative h-full" ref={chartContainerRef}>
      {/* Extended data alert */}
      <ExtendedDataAlert showExtendedData={showExtendedData} />
      
      {/* Drawing tools overlay */}
      {showDrawingTools && (
        <DrawingToolsOverlay containerRef={chartContainerRef} />
      )}
      
      {/* Replay controls */}
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
      
      {/* Render chart */}
      {renderChart(
        // Pass secondary indicator render function
        () => <SecondaryIndicator indicator={secondaryIndicator} />,
        // Use replay data if in replay mode, otherwise use full data
        isReplayMode ? replayData : data
      )}
    </div>
  );
};
