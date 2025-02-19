
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
    <div className="w-full bg-secondary/30 backdrop-blur-lg border border-secondary/50 rounded-lg shadow-lg transition-all duration-300">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
          Markt Overzicht
        </h2>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 bg-background/50 backdrop-blur-md">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-primary/20 data-[state=active]:backdrop-blur-lg transition-all duration-300"
            >
              Overzicht
            </TabsTrigger>
            <TabsTrigger 
              value="volume" 
              className="data-[state=active]:bg-primary/20 data-[state=active]:backdrop-blur-lg transition-all duration-300"
            >
              Volume Analyse
            </TabsTrigger>
            <TabsTrigger 
              value="price" 
              className="data-[state=active]:bg-primary/20 data-[state=active]:backdrop-blur-lg transition-all duration-300"
            >
              Prijstrends
            </TabsTrigger>
          </TabsList>

          <div className="h-[500px] transition-all duration-500 ease-in-out">
            <TabsContent value="overview" className="mt-0 h-full animate-in fade-in-50 duration-500">
              <MarketCharts 
                data={chartData} 
                isLoading={isLoading} 
                type="overview" 
              />
            </TabsContent>

            <TabsContent value="volume" className="mt-0 h-full animate-in fade-in-50 duration-500">
              <MarketCharts 
                data={chartData} 
                isLoading={isLoading} 
                type="volume" 
              />
            </TabsContent>

            <TabsContent value="price" className="mt-0 h-full animate-in fade-in-50 duration-500">
              <MarketCharts 
                data={chartData} 
                isLoading={isLoading} 
                type="price" 
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketOverview;
