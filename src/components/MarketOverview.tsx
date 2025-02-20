
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketCharts } from "./market/MarketCharts";
import { useMarketWebSocket } from "@/hooks/use-market-websocket";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const MarketOverview = () => {
  const { marketData } = useMarketWebSocket();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Set initial loading state
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Handle data validation
    try {
      if (marketData && !Array.isArray(marketData)) {
        console.error('Market data is not an array:', marketData);
        setHasError(true);
      } else {
        setHasError(false);
      }
    } catch (error) {
      console.error('Error processing market data:', error);
      setHasError(true);
    }
  }, [marketData]);

  // Early return for initial loading state
  if (isInitialLoading) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center bg-secondary/30 backdrop-blur-lg border border-secondary/50 rounded-lg">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Marktdata wordt geladen...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Er is een probleem opgetreden</AlertTitle>
        <AlertDescription>
          De marktdata kon niet correct worden verwerkt. Probeer de pagina te verversen.
        </AlertDescription>
      </Alert>
    );
  }

  // Ensure marketData is an array and handle empty state
  const marketDataArray = Array.isArray(marketData) ? marketData : [];

  // If no data after initial loading, show message
  if (!marketDataArray.length && !isInitialLoading) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Geen marktdata beschikbaar</AlertTitle>
        <AlertDescription>
          Er is momenteel geen marktdata beschikbaar. Dit kan komen door onderhoud of een tijdelijke storing.
        </AlertDescription>
      </Alert>
    );
  }

  const groupedData = marketDataArray.reduce((acc, item) => {
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
  }, {} as Record<string, any[]>);

  const marketOrder = ['NYSE', 'NASDAQ', 'AEX', 'DAX', 'CAC40', 'NIKKEI', 'HSI', 'SSE', 'Crypto'];

  return (
    <div className="w-full bg-secondary/30 backdrop-blur-lg border border-secondary/50 rounded-lg shadow-lg will-change-transform hover:shadow-xl transition-all duration-300 ease-out">
      <div className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/5 pointer-events-none" />
        
        <h2 className="relative text-2xl font-semibold mb-6 bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
          Wereldwijde Markten
        </h2>
        
        <Tabs defaultValue={marketOrder[0]} className="w-full">
          <TabsList className="mb-6 bg-background/50 backdrop-blur-md relative flex flex-wrap gap-1">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50" />
            {marketOrder.map((market) => (
              <TabsTrigger 
                key={market}
                value={market} 
                className="relative data-[state=active]:bg-primary/20 data-[state=active]:backdrop-blur-lg transition-all duration-300 ease-out hover:bg-primary/10"
              >
                {market}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="h-[500px] transition-transform will-change-transform duration-500 ease-out">
            {marketOrder.map((market) => (
              <TabsContent 
                key={market}
                value={market} 
                className="mt-0 h-full animate-in fade-in-50 duration-500 ease-out"
              >
                <MarketCharts 
                  data={groupedData[market] || []} 
                  isLoading={!marketDataArray.length} 
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
