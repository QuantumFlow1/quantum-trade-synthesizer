
import { Tabs } from "@/components/ui/tabs";
import { 
  ChartTabsHeader, 
  ChartControlsBar, 
  TabsContent,
  useTradingChartState 
} from "./chart-content";
import { Skeleton } from "@/components/ui/skeleton";
import { memo, useEffect, useState } from "react";

interface TradingChartContentProps {
  scale: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
  isLoading?: boolean;
}

export const TradingChartContent = memo(({
  scale,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
  isLoading = false
}: TradingChartContentProps) => {
  const {
    data,
    indicator,
    setIndicator,
    timeframe,
    setTimeframe,
    chartType,
    handleChartTypeChange,
    showReplayMode,
    handleToggleReplayMode,
    isDataReady
  } = useTradingChartState();

  // Force loading state if data is not ready or data is empty
  const isEmpty = !data || data.length === 0;
  const shouldShowLoading = isLoading || !isDataReady || isEmpty;
  
  // Add a delay state to prevent flickering during rapid updates
  const [showContent, setShowContent] = useState(!shouldShowLoading);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (shouldShowLoading) {
      setShowContent(false);
    } else {
      timeoutId = setTimeout(() => {
        setShowContent(true);
      }, 150);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [shouldShowLoading]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <Tabs defaultValue="price" className="w-full">
          <ChartTabsHeader />

          <ChartControlsBar
            timeframe={timeframe}
            chartType={chartType}
            showReplayMode={showReplayMode}
            onTimeframeChange={setTimeframe}
            onChartTypeChange={handleChartTypeChange}
            onToggleReplayMode={handleToggleReplayMode}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handleResetZoom={handleResetZoom}
          />

          {shouldShowLoading ? (
            <div className="space-y-4 mt-4">
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : (
            <TabsContent 
              data={data}
              chartType={chartType}
              scale={scale}
              indicator={indicator}
              setIndicator={setIndicator}
              showReplayMode={showReplayMode}
              isLoading={isLoading}
            />
          )}
        </Tabs>
      </div>
    </div>
  );
});

TradingChartContent.displayName = "TradingChartContent";
