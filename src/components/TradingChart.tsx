
import { useState } from "react";
import { PriceCards } from "./trading/PriceCards";
import { usePositions } from "@/hooks/use-positions";
import { useZoomControls } from "@/hooks/use-zoom-controls";
import { toast } from "@/hooks/use-toast";
import { ChartControls } from "./trading/ChartControls";
import { ChartActions } from "./trading/ChartActions";
import { TradingTabs } from "./trading/TradingTabs";
import { TradingSidePanel } from "./trading/TradingSidePanel";
import { useTradingData } from "./trading/hooks/useTradingData";

const TradingChart = () => {
  const [indicator, setIndicator] = useState<"sma" | "ema" | "rsi" | "macd" | "bollinger" | "stochastic" | "adx">("sma");
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('available');
  const [timeframe, setTimeframe] = useState<"1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w">("1h");
  const [chartType, setChartType] = useState<"candles" | "line" | "area" | "bars">("candles");
  const [showReplayMode, setShowReplayMode] = useState(false);
  
  const { scale, handleZoomIn, handleZoomOut, handleResetZoom } = useZoomControls(1);
  const { positions, isLoading: positionsLoading } = usePositions();
  const { data } = useTradingData({ timeframe, showReplayMode });

  const handleChartTypeChange = (type: "candles" | "line" | "area" | "bars") => {
    setChartType(type);
  };
  
  const handleToggleReplayMode = () => {
    setShowReplayMode(prev => !prev);
    
    toast({
      title: showReplayMode ? "Replay mode disabled" : "Replay mode enabled",
      description: showReplayMode 
        ? "Chart will now update in real-time" 
        : "You can now replay historical price movements",
      duration: 2000,
    });
  };

  return (
    <div className="space-y-6">
      <PriceCards data={data} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <TradingTabs
                data={data}
                chartType={chartType}
                scale={scale}
                indicator={indicator}
                setIndicator={setIndicator}
                showReplayMode={showReplayMode}
              >
                <ChartControls 
                  timeframe={timeframe}
                  chartType={chartType}
                  showReplayMode={showReplayMode}
                  onTimeframeChange={setTimeframe}
                  onChartTypeChange={handleChartTypeChange}
                  onToggleReplayMode={handleToggleReplayMode}
                />
                
                <ChartActions 
                  chartContainerRef={{ current: null }}
                  handleZoomIn={handleZoomIn}
                  handleZoomOut={handleZoomOut}
                  handleResetZoom={handleResetZoom}
                />
              </TradingTabs>
            </div>
          </div>
        </div>

        <TradingSidePanel
          apiStatus={apiStatus}
          positions={positions}
          isLoading={positionsLoading}
        />
      </div>
    </div>
  );
};

export default TradingChart;
