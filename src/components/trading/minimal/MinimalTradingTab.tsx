
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
import { useToast } from "@/hooks/use-toast";

export const MinimalTradingTab = () => {
  const [data, setData] = useState<TradingDataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<"1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w">("1h");
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<"3d" | "2d">("3d");
  const [has3DError, setHas3DError] = useState(false);
  const [renderAttempt, setRenderAttempt] = useState(0);
  const theme = useThemeDetection();
  const { toast } = useToast();

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

  // Handle 3D view error
  const handle3DError = () => {
    if (activeView === "3d") {
      console.log("Switching to 2D view due to 3D rendering error");
      setActiveView("2d");
      setHas3DError(true);
      
      toast({
        title: "3D View Unavailable",
        description: "Switched to 2D chart due to visualization issues. Your device may not support WebGL.",
        variant: "destructive"
      });
    }
  };

  // Handle view change
  const handleViewChange = (view: string) => {
    const newView = view as "3d" | "2d";
    
    if (newView === "3d" && has3DError) {
      setRenderAttempt(prev => prev + 1);
      setHas3DError(false);
    }
    
    setActiveView(newView);
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
            <Tabs value={activeView} onValueChange={handleViewChange} className="mt-2 sm:mt-0">
              <TabsList>
                <TabsTrigger 
                  value="3d" 
                  className="flex items-center"
                  disabled={has3DError && renderAttempt > 1}
                >
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
                    key={`3d-view-${renderAttempt}`}
                    data={data} 
                    isSimulationMode={false}
                    onError={handle3DError}
                    onLoaded={() => console.log("3D view loaded successfully")}
                  />
                  {has3DError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                      <div className="text-center p-4">
                        <h3 className="text-lg font-medium mb-2">3D Visualization Unavailable</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Your device may not support WebGL or 3D rendering is currently unavailable.
                        </p>
                        <button 
                          onClick={() => {
                            setRenderAttempt(prev => prev + 1);
                            setHas3DError(false);
                          }}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  )}
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
