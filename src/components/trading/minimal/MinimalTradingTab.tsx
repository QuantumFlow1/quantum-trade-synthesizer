
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MinimalPriceChart } from "./MinimalPriceChart";
import { MinimalTradingControls } from "./MinimalTradingControls";
import { MinimalMarketData } from "./MinimalMarketData";
import { tradingDataService } from "@/services/trading/tradingDataService";
import { Market3DView } from "@/components/visualization/Market3DView";
import { useThemeDetection } from "@/hooks/use-theme-detection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Boxes, LineChart, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "@/components/visualization/3d/LoadingState";
import { TradingDataPoint } from "@/utils/tradingData";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const MinimalTradingTab = () => {
  const [data, setData] = useState<TradingDataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<"1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w">("1h");
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<"3d" | "2d">("2d"); // Default to 2D for better compatibility
  const [has3DError, setHas3DError] = useState(false);
  const [renderAttempt, setRenderAttempt] = useState(0);
  const [webGLAvailable, setWebGLAvailable] = useState<boolean | null>(null);
  const theme = useThemeDetection();
  const { toast } = useToast();

  // Check WebGL availability once on component mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const isWebGLAvailable = !!gl;
      
      setWebGLAvailable(isWebGLAvailable);
      
      if (!isWebGLAvailable) {
        setHas3DError(true);
        toast({
          title: "3D View Unavailable",
          description: "Your browser doesn't support WebGL. Using 2D chart instead.",
          variant: "destructive"
        });
      }
      
      // Clean up
      if (gl) {
        if (gl instanceof WebGLRenderingContext) {
          gl.getExtension('WEBGL_lose_context')?.loseContext();
        }
      }
    } catch (e) {
      console.error("Error checking WebGL availability:", e);
      setWebGLAvailable(false);
      setHas3DError(true);
    }
  }, [toast]);

  const fetchData = (tf: typeof timeframe) => {
    setIsLoading(true);
    const newData = tradingDataService.refreshData(tf);
    setData(newData);
    setIsLoading(false);
  };

  const refreshData = () => fetchData(timeframe);

  const handleTimeframeChange = (newTimeframe: typeof timeframe) => {
    setTimeframe(newTimeframe);
    fetchData(newTimeframe);
  };

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

  const handleViewChange = (view: "3d" | "2d") => {
    // Only allow switching to 3D if WebGL is available
    if (view === "3d" && webGLAvailable === false) {
      toast({
        title: "3D View Unavailable",
        description: "Your browser or device doesn't support WebGL, which is required for 3D visualization.",
        variant: "destructive"
      });
      return;
    }
    
    setActiveView(view);
    
    if (view === "3d" && has3DError) {
      setRenderAttempt(0);
      setHas3DError(false);
    }
  };

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
                    disabled={webGLAvailable === false}
                    aria-label="3D View"
                  >
                    <Boxes className="mr-2 h-4 w-4" />
                    3D View
                    {webGLAvailable === false && <AlertTriangle className="ml-1 h-3 w-3 text-amber-500" />}
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
            
            {webGLAvailable === false && activeView === "3d" && (
              <Alert variant="destructive" className="mb-4 mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  WebGL is not available or supported by your browser. Please use the 2D chart view.
                </AlertDescription>
              </Alert>
            )}
            
            <Tabs value={activeView} className="mt-4 h-[calc(100%-40px)]">
              <TabsContent value="3d" className="mt-0 h-full">
                {webGLAvailable === false ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center p-6">
                      <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
                      <h3 className="text-lg font-medium mb-2">3D Visualization Not Available</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Your browser doesn't support WebGL, which is required for 3D visualizations. 
                        Please switch to the 2D chart view or try a different browser like Chrome or Firefox.
                      </p>
                      <button 
                        onClick={() => handleViewChange("2d")}
                        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
                      >
                        Switch to 2D View
                      </button>
                    </div>
                  </div>
                ) : (
                  <ErrorBoundary 
                    fallback={
                      <div className="h-full flex items-center justify-center text-destructive p-4 text-center">
                        <div>
                          <h3 className="text-lg font-medium mb-2">3D Visualization Failed</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            There was a problem rendering the 3D view.
                          </p>
                          <div className="flex justify-center space-x-4">
                            <button 
                              onClick={() => {
                                setRenderAttempt(prev => prev + 1);
                                setHas3DError(false);
                              }}
                              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
                            >
                              Try Again
                            </button>
                            <button 
                              onClick={() => handleViewChange("2d")}
                              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm"
                            >
                              Use 2D Chart
                            </button>
                          </div>
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
                              <div className="flex justify-center space-x-4">
                                <button 
                                  onClick={() => {
                                    setRenderAttempt(prev => prev + 1);
                                    setHas3DError(false);
                                  }}
                                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
                                >
                                  Try Again
                                </button>
                                <button 
                                  onClick={() => handleViewChange("2d")}
                                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm"
                                >
                                  Use 2D Chart
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </ErrorBoundary>
                )}
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
