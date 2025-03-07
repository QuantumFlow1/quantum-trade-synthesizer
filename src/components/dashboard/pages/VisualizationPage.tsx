
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Market3DView } from "@/components/visualization/Market3DView";
import { useTradingChartData } from "@/hooks/use-trading-chart-data";
import { useSimulationMode } from "@/hooks/use-simulation-mode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BoxIcon, InfoIcon, RefreshCcwIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export const VisualizationPage = () => {
  const [activeTab, setActiveTab] = useState<string>("3d-view");
  const [hasViewError, setHasViewError] = useState(false);
  const [viewLoaded, setViewLoaded] = useState(false);
  
  // Use our extracted hook for API and data fetching with simulation mode
  const {
    data,
    apiStatus,
    handleRetryConnection,
    rawMarketData,
    isLoading: dataLoading,
    refresh: refreshData
  } = useTradingChartData(true); // Default to simulation mode
  
  // Use simulation mode hook
  const { forceSimulation, toggleSimulationMode } = useSimulationMode(handleRetryConnection);
  
  // Make sure we have some data before rendering
  const [hasData, setHasData] = useState(false);
  useEffect(() => {
    if (data && data.length > 0) {
      console.log("VisualizationPage received data:", data.length, "points");
      setHasData(true);
    } else {
      console.log("VisualizationPage waiting for data...");
    }
  }, [data]);
  
  // Handle 3D view error
  const handleViewError = () => {
    console.log("3D view error detected");
    setHasViewError(true);
    setViewLoaded(false);
  };
  
  // Handle 3D view loaded
  const handleViewLoaded = () => {
    console.log("3D view loaded successfully");
    setHasViewError(false);
    setViewLoaded(true);
  };
  
  // Handle manual refresh request
  const handleRefresh = () => {
    console.log("Manual refresh requested");
    refreshData();
    toast({
      title: "Refreshing Visualization",
      description: "Fetching new market data for the 3D view..."
    });
  };
  
  return (
    <div className="space-y-6">
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <BoxIcon className="w-5 h-5 mr-2" /> 
              3D Market Visualization
            </h2>
            <p className="text-muted-foreground mt-1">Explore market data in an immersive 3D environment</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
              onClick={handleRefresh}
            >
              <RefreshCcwIcon className="w-4 h-4" />
              Refresh
            </Button>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="3d-view" className="flex items-center">
                  <BoxIcon className="w-4 h-4 mr-2" />
                  3D View
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center">
                  <InfoIcon className="w-4 h-4 mr-2" />
                  About
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <TabsContent value="3d-view" className="mt-0">
          {hasData ? (
            <Market3DView 
              data={data}
              isSimulationMode={forceSimulation}
              onError={handleViewError}
              onLoaded={handleViewLoaded}
            />
          ) : (
            <Card className="relative backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 h-[500px] flex justify-center items-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin h-8 w-8 rounded-full border-4 border-primary border-t-transparent mb-4"></div>
                <p className="text-muted-foreground">Loading market data...</p>
              </div>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="about" className="mt-6 space-y-4">
          <Alert variant="default" className="bg-secondary/20">
            <AlertDescription className="space-y-4">
              <p>The 3D Market Visualization provides an immersive way to visualize market data. This dedicated view offers better performance by running independently from the trading interface.</p>
              
              <h3 className="font-semibold text-lg mt-2">Features</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Real-time 3D rendering of market data</li>
                <li>Interactive visualization you can rotate and zoom</li>
                <li>Visual representation of price and volume data</li>
                <li>Market sentiment indicators</li>
                <li>Optimized performance with WebGL acceleration</li>
              </ul>
              
              <h3 className="font-semibold text-lg mt-2">Tips</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Click and drag to rotate the view</li>
                <li>Scroll to zoom in and out</li>
                <li>The visualization automatically updates as new market data arrives</li>
                <li>If you experience performance issues, try the Refresh button</li>
                <li>For best performance, close other browser tabs and applications</li>
              </ul>
              
              <h3 className="font-semibold text-lg mt-2">Troubleshooting</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>If the view appears black or broken, click the Refresh button</li>
                <li>Some browsers may need WebGL enabled in settings</li>
                <li>Make sure your graphics drivers are up to date</li>
                <li>Chrome and Firefox typically provide the best support for 3D visualization</li>
              </ul>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Card>
    </div>
  );
};
