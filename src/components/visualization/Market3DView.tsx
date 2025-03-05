
import { useState } from "react";
import { Market3DVisualization } from "./Market3DVisualization";
import { useMarket3DData } from "@/hooks/use-market-3d-data";
import { TradingDataPoint } from "@/utils/tradingData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, Zap, Info, Box } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Market3DViewProps {
  data: TradingDataPoint[];
  isSimulationMode?: boolean;
}

export const Market3DView = ({ data, isSimulationMode = false }: Market3DViewProps) => {
  const { visualizationData, stats } = useMarket3DData(data);
  const [activeTab, setActiveTab] = useState<string>("3d-view");
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <Card className="bg-background/60 backdrop-blur-sm border border-purple-500/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Box className="h-5 w-5 text-purple-500" />
            <span>3D Market Visualization</span>
            <Badge variant="outline" className="ml-2 bg-purple-500/10 text-purple-400 border-purple-500/30">
              Beta
            </Badge>
          </CardTitle>
          
          <Button variant="ghost" size="sm" className="h-7 gap-1">
            <Info className="h-3.5 w-3.5" />
            <span className="text-xs">About 3D View</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="pb-2">
          <TabsList className="grid grid-cols-2 w-48">
            <TabsTrigger value="3d-view" className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>3D View</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              <span>Stats</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="3d-view" className="pt-4">
            <Market3DVisualization 
              data={visualizationData} 
              isSimulationMode={isSimulationMode} 
            />
            <div className="mt-3 text-sm text-muted-foreground">
              <p>This 3D visualization shows price bars (green/red) and volume indicators (purple) for recent market data.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-secondary/20 backdrop-blur-sm">
                <h3 className="text-sm font-medium mb-2">Price Statistics</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Average:</span>
                    <span className="font-medium">${stats.avgPrice.toFixed(2)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Maximum:</span>
                    <span className="font-medium">${stats.maxPrice.toFixed(2)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Minimum:</span>
                    <span className="font-medium">${stats.minPrice.toFixed(2)}</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg bg-secondary/20 backdrop-blur-sm">
                <h3 className="text-sm font-medium mb-2">Price Change</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Net:</span>
                    <span className={`font-medium ${stats.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${stats.priceChange.toFixed(2)}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Percentage:</span>
                    <span className={`font-medium ${stats.priceChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stats.priceChangePercent.toFixed(2)}%
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Volatility:</span>
                    <span className="font-medium">
                      {(stats.maxPrice - stats.minPrice).toFixed(2)}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-4 rounded-lg bg-blue-900/10 border border-blue-900/20">
              <h3 className="flex items-center gap-2 text-sm font-medium text-blue-400 mb-2">
                <Info className="h-4 w-4" />
                VR/AR Potential
              </h3>
              <p className="text-sm text-blue-300">
                In VR/AR environments, this data will be visualized as an immersive trading floor where you can walk among the price bars and interact with market data points directly.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
