
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketCharts } from "./market/MarketCharts";
import { useMarketData } from "@/hooks/use-market-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const MarketOverview = () => {
  const { data: marketData, isLoading, error } = useMarketData();

  console.log('MarketOverview received data:', marketData);

  const groupedData = marketData?.reduce((acc, item) => {
    if (!acc[item.market]) {
      acc[item.market] = [];
    }
    acc[item.market].push({
      name: item.symbol,
      volume: item.volume,
      price: item.price,
      change: item.change24h,
      high: item.high24h,
      low: item.low24h
    });
    return acc;
  }, {} as Record<string, any[]>) || {};

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
    <div className="w-full bg-secondary/30 backdrop-blur-lg border border-secondary/50 rounded-lg shadow-lg will-change-transform hover:shadow-xl transition-all duration-300 ease-out">
      <div className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/5 pointer-events-none" />
        
        <h2 className="relative text-2xl font-semibold mb-6 bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
          Markt Overzicht
        </h2>
        
        <Tabs defaultValue="Crypto" className="w-full">
          <TabsList className="mb-6 bg-background/50 backdrop-blur-md relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50" />
            <TabsTrigger 
              value="Crypto" 
              className="relative data-[state=active]:bg-primary/20 data-[state=active]:backdrop-blur-lg transition-all duration-300 ease-out hover:bg-primary/10"
            >
              Crypto
            </TabsTrigger>
            <TabsTrigger 
              value="NASDAQ" 
              className="relative data-[state=active]:bg-primary/20 data-[state=active]:backdrop-blur-lg transition-all duration-300 ease-out hover:bg-primary/10"
            >
              NASDAQ
            </TabsTrigger>
            <TabsTrigger 
              value="EU" 
              className="relative data-[state=active]:bg-primary/20 data-[state=active]:backdrop-blur-lg transition-all duration-300 ease-out hover:bg-primary/10"
            >
              Europese Markten
            </TabsTrigger>
          </TabsList>

          <div className="h-[500px] transition-transform will-change-transform duration-500 ease-out">
            {Object.entries(groupedData).map(([market, data]) => (
              <TabsContent 
                key={market}
                value={market} 
                className="mt-0 h-full animate-in fade-in-50 duration-500 ease-out"
              >
                <MarketCharts 
                  data={data} 
                  isLoading={isLoading} 
                  type="overview" 
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketOverview;
