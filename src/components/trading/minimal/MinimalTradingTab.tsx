
import { useEffect, useState, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MinimalPriceChart } from "./MinimalPriceChart";
import { MinimalTradingControls } from "./MinimalTradingControls";
import { MinimalMarketData } from "./MinimalMarketData";
import { tradingDataService } from "@/services/trading/tradingDataService";
import { TradingDataPoint } from "@/utils/tradingData";
import { Market3DView } from "@/components/visualization/Market3DView";
import { useThemeDetection } from "@/hooks/use-theme-detection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Boxes, LineChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "../visualization/3d/LoadingState";

export const MinimalTradingTab = () => {
  const [data, setData] = useState<TradingDataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<"1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w">("1h");
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<"3d" | "2d">("3d");
  const [has3DError, setHas3DError] = useState(false);
  const [renderAttempt, setRenderAttempt] = useState(0);
  const theme = useThemeDetection();
  const { toast } = useToast();

  // Function to fetch data with the given timeframe
  const fetchData = (tf: typeof timeframe) => {
    setIsLoading(true);
    const newData = tradingDataService.refreshData(tf);
    setData(newData);
    setIsLoading(false);
  };

  // Function to refresh data with current timeframe
  const refreshData = () => fetchData(timeframe);

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe: typeof timeframe) => {
    setTimeframe(newTimeframe);
    fetchData(newTimeframe);
  };

  // Handle 3D view error
  const handle3DError = () => {
    if (activeView === "3d") {
      if (renderAttempt < 2) {
        setRenderAttempt(prev => prev + 1);
        setHas3DError(false);
        toast({
          title: "Retrying 3D View",
          description: `Attempt ${renderAttempt + 1} of 3`,
          variant: "default"
        });
      } else {
        setActiveView("2d");
        setHas3DError(true);
        toast({
          title: "3D View Unavailable",
          description: "Switched to 2D chart. Your device may not support WebGL.",
          variant: "destructive"
        });
      }
    }
  };

  // Handle view change
  const handleViewChange = (view: string) => {
    const newView = view as "3d" | "2d";
    setActiveView(newView);
    
    // Reset error state when switching back to 3D
    if (newView === "3d" && has3DError) {
      setRenderAttempt(0);
      setHas3DError(false);
    }
  };

  // Initial data load and auto-refresh
  useEffect(() => {
    refreshData();
    const intervalId = setInterval(refreshData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <MinimalMarketData />
      
      <div className="flex-1">
        <Card className="h-full">
          <CardHeader className="pb-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <CardTitle>Trading Chart</CardTitle>
              <Tabs value={activeView} onValueChange={handleViewChange} className="mt-2 sm:mt-0">
                <TabsList>
                  <TabsTrigger 
                    value="3d" 
                    className="flex items-center"
                    disabled={has3DError && renderAttempt >= 2}
                    aria-label="3D View"
                  >
                    <Boxes className="mr-2 h-4 w-4" />
                    3D View
                  </TabsTrigger>
                  <TabsTrigger value="2d" className="flex items-center" aria-label="2D Chart">
                    <LineChart className="mr-2 h-4 w-4" />
                    2D Chart
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="h-[calc(100%-80px)]">
            <MinimalTradingControls
              onRefresh={refreshData}
              onTimeframeChange={handleTimeframeChange}
              currentTimeframe={timeframe}
            />
            
            <Tabs value={activeView} className="mt-4 h-[calc(100%-40px)]">
              <TabsContent value="3d" className="mt-0 h-full">
                <ErrorBoundary 
                  fallback={
                    <div className="h-full flex items-center justify-center text-destructive p-4 text-center">
                      <div>
                        <h3 className="text-lg font-medium mb-2">3D Visualization Failed</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          There was a problem rendering the 3D view.
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
                  }
                  onError={() => {
                    handle3DError();
                    console.error("3D rendering error caught by boundary");
                  }}
                  resetKeys={[renderAttempt]}
                >
                  {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <LoadingState message="Initializing 3D visualization..." />
                    </div>
                  ) : (
                    <div className="h-full relative">
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
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="2d" className="mt-0 h-full">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <LoadingState message="Loading chart data..." />
                  </div>
                ) : (
                  <div className="h-full">
                    <MinimalPriceChart data={data} />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
