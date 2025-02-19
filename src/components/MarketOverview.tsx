
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketCharts } from "./market/MarketCharts";
import { useMarketData } from "@/hooks/use-market-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const MarketOverview = () => {
  const { data: marketData, isLoading, error } = useMarketData();

  console.log('MarketOverview received data:', marketData);

  const chartData = marketData?.map(item => ({
    name: item.symbol,
    volume: item.volume,
    price: item.price,
    change: item.change24h,
    high: item.high24h,
    low: item.low24h
  })) || [];

  // Als er een error is, toon een error message
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Er is een fout opgetreden bij het laden van de marktdata. 
          Probeer de pagina te verversen.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full p-4 rounded-lg border bg-card overflow-hidden">
      <h2 className="text-xl font-semibold mb-4">Markt Overzicht</h2>
      
      <Tabs defaultValue="overview" className="w-full h-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="volume">Volume Analyse</TabsTrigger>
          <TabsTrigger value="price">Prijstrends</TabsTrigger>
        </TabsList>

        <div className="overflow-auto max-h-[calc(100vh-16rem)]">
          <TabsContent value="overview" className="min-h-[400px]">
            <MarketCharts 
              data={chartData} 
              isLoading={isLoading} 
              type="overview" 
            />
          </TabsContent>

          <TabsContent value="volume" className="min-h-[400px]">
            <MarketCharts 
              data={chartData} 
              isLoading={isLoading} 
              type="volume" 
            />
          </TabsContent>

          <TabsContent value="price" className="min-h-[400px]">
            <MarketCharts 
              data={chartData} 
              isLoading={isLoading} 
              type="price" 
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default MarketOverview;
