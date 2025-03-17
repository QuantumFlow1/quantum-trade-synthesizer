
import { useTradingForm } from "@/hooks/use-trading-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ApiStatus } from "@/hooks/use-trading-chart-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockbotChat } from "./minimal/components/stockbot/StockbotChat";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AssetDetailCard } from "./minimal/components/AssetDetailCard";
import { MarketSummary } from "./minimal/components/MarketSummary";
import { MarketMetrics } from "./minimal/components/trading-view/MarketMetrics";

interface TradingOrderSectionProps {
  apiStatus: ApiStatus;
  marketData: any;
  onSimulationToggle: (enabled: boolean) => void;
  isSimulationMode: boolean;
  apiKeysAvailable: boolean;
  isLoading?: boolean;
}

export function TradingOrderSection({
  apiStatus,
  marketData,
  onSimulationToggle,
  isSimulationMode,
  apiKeysAvailable,
  isLoading = false
}: TradingOrderSectionProps) {
  // Get the first item from market data array, or use the market data object if it's not an array
  const primaryAsset = Array.isArray(marketData) && marketData.length > 0 
    ? marketData[0] 
    : (marketData || {});

  return (
    <div className="space-y-4">
      <Card className="backdrop-blur-xl bg-secondary/10 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Market Overview</CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="simulation-mode" className="text-xs">Simulation</Label>
              <Switch 
                id="simulation-mode" 
                checked={isSimulationMode} 
                onCheckedChange={onSimulationToggle} 
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="h-36 flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Loading market data...</div>
            </div>
          ) : (
            <MarketMetrics data={Array.isArray(marketData) ? marketData : [primaryAsset]} useRealData={!isSimulationMode} />
          )}
          
          {/* Asset Detail Card showing detailed information */}
          <AssetDetailCard assetData={primaryAsset} />
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur-xl bg-secondary/10 border border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
        <CardHeader className="pb-3">
          <CardTitle>Trading Advisor</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="assistant">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
              <TabsTrigger value="summary">Market Summary</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assistant" className="mt-0">
              <StockbotChat />
            </TabsContent>
            
            <TabsContent value="summary" className="mt-0">
              <MarketSummary />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
