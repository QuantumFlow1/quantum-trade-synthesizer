
import React from "react";
import { ChartControls } from "../ChartControls";
import { ChartActions } from "../ChartActions";

interface ChartControlsBarProps {
  timeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w";
  chartType: "candles" | "line" | "area" | "bars";
  showReplayMode: boolean;
  onTimeframeChange: (timeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w") => void;
  onChartTypeChange: (type: "candles" | "line" | "area" | "bars") => void;
  onToggleReplayMode: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
}

const ChartControlsBar: React.FC<ChartControlsBarProps> = ({
  timeframe,
  chartType,
  showReplayMode,
  onTimeframeChange,
  onChartTypeChange,
  onToggleReplayMode,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4 justify-between items-center">
      <ChartControls 
        timeframe={timeframe}
        chartType={chartType}
        showReplayMode={showReplayMode}
        onTimeframeChange={onTimeframeChange}
        onChartTypeChange={onChartTypeChange}
        onToggleReplayMode={onToggleReplayMode}
      />
      
      <ChartActions 
        chartContainerRef={{ current: null }}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleResetZoom={handleResetZoom}
      />
    </div>
  );
};

export default ChartControlsBar;
