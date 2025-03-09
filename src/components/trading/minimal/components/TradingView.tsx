
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTradingViewState } from "../hooks/useTradingViewState";
import { 
  ChartControls, 
  IndicatorControls,
  PriceChart,
  VolumeChart,
  MarketMetrics,
  LoadingState,
  ApiStatusAlert
} from "./trading-view";

interface TradingViewProps {
  chartData: any[];
  apiStatus: string;
  useRealData?: boolean;
}

export const TradingView = ({ chartData, apiStatus, useRealData = false }: TradingViewProps) => {
  const {
    selectedInterval,
    setSelectedInterval,
    chartType,
    setChartType,
    visibleIndicators,
    toggleIndicator,
    processChartData
  } = useTradingViewState();
  
  // Enhanced chart data with indicators
  const enhancedChartData = processChartData(chartData);
  
  return (
    <div className="space-y-4">
      <ChartControls 
        selectedInterval={selectedInterval}
        setSelectedInterval={setSelectedInterval}
        chartType={chartType}
        setChartType={setChartType}
        useRealData={useRealData}
      />
      
      {apiStatus === 'checking' && <LoadingState />}
      
      {apiStatus !== 'checking' && (
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>BTC/USD {useRealData ? "Live Price" : "Simulated Price"}</span>
              <IndicatorControls 
                visibleIndicators={visibleIndicators}
                toggleIndicator={toggleIndicator}
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <PriceChart 
              chartType={chartType}
              data={enhancedChartData}
              visibleIndicators={visibleIndicators}
            />
            
            {visibleIndicators.volume && (
              <VolumeChart data={enhancedChartData} />
            )}
          </CardContent>
        </Card>
      )}
      
      <ApiStatusAlert apiStatus={apiStatus} />
      
      <MarketMetrics data={chartData} useRealData={useRealData} />
    </div>
  );
};
