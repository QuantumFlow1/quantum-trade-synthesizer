
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChartLine, Book, Bot, RefreshCw, PencilRuler } from "lucide-react";

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
    processChartData,
    showLegend,
    toggleLegend
  } = useTradingViewState();
  
  // Enhanced chart data with indicators
  const enhancedChartData = processChartData(chartData);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs defaultValue="chart" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="chart" className="flex items-center gap-1">
              <ChartLine className="h-4 w-4" />
              <span className="hidden sm:inline">Trading Chart</span>
            </TabsTrigger>
            <TabsTrigger value="book" className="flex items-center gap-1">
              <Book className="h-4 w-4" />
              <span className="hidden sm:inline">Order Book</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-1">
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">Trading Agents</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex border rounded-md overflow-hidden">
            <Button variant="ghost" size="sm" className="rounded-none h-8 px-2 text-xs">
              <PencilRuler className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Drawing Tools</span>
            </Button>
          </div>
          
          <div className="flex border rounded-md overflow-hidden">
            {["1m", "5m", "15m", "1h", "4h", "1d", "1w"].map((interval) => (
              <Button 
                key={interval}
                variant={interval === selectedInterval ? "default" : "ghost"} 
                size="sm" 
                className="rounded-none h-8 px-2 text-xs"
                onClick={() => setSelectedInterval(interval)}
              >
                {interval}
              </Button>
            ))}
          </div>
          
          <Button variant="outline" size="sm" className="h-8 px-2">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">BTC/USD {useRealData ? "Live Price" : "Simulated Price"}</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">Active Indicators:</div>
                <IndicatorControls 
                  visibleIndicators={visibleIndicators}
                  toggleIndicator={toggleIndicator}
                />
              </div>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs" onClick={toggleLegend}>
                {showLegend ? "Hide Legend" : "Show Legend"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {apiStatus === 'checking' ? (
            <LoadingState />
          ) : (
            <>
              <PriceChart 
                chartType={chartType}
                data={enhancedChartData}
                visibleIndicators={visibleIndicators}
              />
              
              {visibleIndicators.volume && (
                <VolumeChart data={enhancedChartData} />
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      <ApiStatusAlert apiStatus={apiStatus} />
      
      <MarketMetrics data={chartData} useRealData={useRealData} />
    </div>
  );
};
