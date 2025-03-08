
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MinimalPriceChart } from "./MinimalPriceChart";
import { MinimalTradingControls } from "./MinimalTradingControls";
import { MinimalMarketData } from "./MinimalMarketData";
import { tradingDataService } from "@/services/trading/tradingDataService";
import { TradingDataPoint } from "@/utils/tradingData";
import { Market3DView } from "@/components/visualization/Market3DView";
import { useThemeDetection } from "@/hooks/use-theme-detection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChartIcon, Boxes, LineChart } from "lucide-react";

export const MinimalTradingTab = () => {
  const [data, setData] = useState<TradingDataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<"1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w">("1h");
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<"3d" | "2d">("3d");
  const theme = useThemeDetection();

  // Function to refresh data
  const refreshData = () => {
    setIsLoading(true);
    const newData = tradingDataService.refreshData(timeframe);
    setData(newData);
    setIsLoading(false);
  };

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w") => {
    setTimeframe(newTimeframe);
    setIsLoading(true);
    const newData = tradingDataService.refreshData(newTimeframe);
    setData(newData);
    setIsLoading(false);
  };

  // Initial data load
  useEffect(() => {
    refreshData();
    
    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      refreshData();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-6">
      {/* Market Data Summary */}
      <MinimalMarketData />
      
      {/* Chart Card */}
      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <CardTitle>Trading Chart</CardTitle>
            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "3d" | "2d")} className="mt-2 sm:mt-0">
              <TabsList>
                <TabsTrigger value="3d" className="flex items-center">
                  <Boxes className="mr-2 h-4 w-4" />
                  3D View
                </TabsTrigger>
                <TabsTrigger value="2d" className="flex items-center">
                  <LineChart className="mr-2 h-4 w-4" />
                  2D Chart
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <MinimalTradingControls
            onRefresh={refreshData}
            onTimeframeChange={handleTimeframeChange}
            currentTimeframe={timeframe}
          />
          
          <Tabs value={activeView} className="mt-4">
            <TabsContent value="3d" className="mt-0">
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  Loading 3D visualization...
                </div>
              ) : (
                <div className="h-[400px] relative">
                  <Market3DView 
                    data={data} 
                    isSimulationMode={false}
                    onError={() => setActiveView("2d")}
                    onLoaded={() => console.log("3D view loaded")}
                  />
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="2d" className="mt-0">
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  Loading chart data...
                </div>
              ) : (
                <MinimalPriceChart data={data} />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
