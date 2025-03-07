
import { Tabs } from "@/components/ui/tabs";
import { 
  ChartTabsHeader, 
  ChartControlsBar, 
  TabsContent,
  useTradingChartState 
} from "./chart-content";
import { Skeleton } from "@/components/ui/skeleton";

interface TradingChartContentProps {
  scale: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleResetZoom: () => void;
  isLoading?: boolean;
}

export const TradingChartContent = ({
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

  if (!isDataReady && !isLoading) {
    isLoading = true; // Force loading state if data is not ready
  }

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

          {isLoading ? (
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
};
