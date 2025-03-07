
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Market3DView } from "@/components/visualization/Market3DView";
import { TradingDataPoint } from "@/utils/tradingData";
import { useTradingChartData } from "@/hooks/use-trading-chart-data";
import { useSimulationMode } from "@/hooks/use-simulation-mode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CubeIcon, LineChartIcon, InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const VisualizationPage = () => {
  const [activeTab, setActiveTab] = useState<string>("3d-view");
  
  // Use our extracted hook for API and data fetching with simulation mode enabled by default
  const {
    data,
    apiStatus,
    handleRetryConnection,
    rawMarketData
  } = useTradingChartData(true); // Default to simulation mode for better performance
  
  // Use simulation mode hook
  const { forceSimulation, toggleSimulationMode } = useSimulationMode(handleRetryConnection);
  
  // Make sure we have some data before rendering
  const [hasData, setHasData] = useState(false);
  useEffect(() => {
    if (data && data.length > 0) {
      setHasData(true);
    }
  }, [data]);
  
  return (
    <div className="space-y-6">
      <Card className="col-span-full backdrop-blur-xl bg-secondary/10 border border-white/10 p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <CubeIcon className="w-5 h-5 mr-2" /> 
              3D Market Visualization
            </h2>
            <p className="text-muted-foreground mt-1">Explore market data in an immersive 3D environment</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4 md:mt-0">
            <TabsList>
              <TabsTrigger value="3d-view" className="flex items-center">
                <CubeIcon className="w-4 h-4 mr-2" />
                3D View
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center">
                <InfoIcon className="w-4 h-4 mr-2" />
                About
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <TabsContent value="3d-view" className="mt-0">
          {hasData ? (
            <Market3DView 
              data={data}
              isSimulationMode={forceSimulation}
            />
          ) : (
            <div className="flex justify-center items-center h-[500px]">
              <div className="animate-spin h-8 w-8 rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
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
                <li>If you experience performance issues, try refreshing the page</li>
              </ul>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Card>
    </div>
  );
};
