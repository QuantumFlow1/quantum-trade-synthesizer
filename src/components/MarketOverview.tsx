
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketCharts } from "./market/MarketCharts";
import { useMarketWebSocket } from "@/hooks/use-market-websocket";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, RefreshCcw, BrainCircuit } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { AIMarketAnalysis } from "./market/AIMarketAnalysis";

const MarketOverview = () => {
  const { marketData, reconnect, connectionStatus } = useMarketWebSocket();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showAIInsights, setShowAIInsights] = useState(false);
  const { toast } = useToast();

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
      if (!marketData) {
        console.log('No market data received');
        setErrorMessage("Geen marktdata ontvangen");
        setHasError(true);
        return;
      }

      if (!Array.isArray(marketData)) {
        console.error('Market data is not an array:', marketData);
        setErrorMessage("Ongeldig dataformaat ontvangen");
        setHasError(true);
        return;
      }

      if (marketData.length === 0) {
        console.log('Empty market data array received');
        setErrorMessage("Lege marktdata ontvangen");
        setHasError(true);
        return;
      }

      // Validation for data structure
      const isValidData = marketData.every(item => 
        item && 
        typeof item.market === 'string' &&
        typeof item.symbol === 'string' &&
        typeof item.price === 'number'
      );

      if (!isValidData) {
        console.error('Invalid data structure in market data');
        setErrorMessage("Ongeldige datastructuur");
        setHasError(true);
        return;
      }

      setHasError(false);
      setErrorMessage("");
    } catch (error) {
      console.error('Error processing market data:', error);
      setErrorMessage(error instanceof Error ? error.message : "Onbekende fout");
      setHasError(true);
    }
  }, [marketData]);

  const handleRetry = () => {
    setHasError(false);
    setIsInitialLoading(true);
    reconnect();
    toast({
      title: "Herverbinden...",
      description: "Bezig met het herstellen van de marktdata verbinding",
    });
  };

  const toggleAIInsights = () => {
    setShowAIInsights(!showAIInsights);
    toast({
      title: showAIInsights ? "AI Insights Disabled" : "AI Insights Enabled",
      description: showAIInsights 
        ? "Standard market view restored" 
        : "AI-powered market analysis activated",
      duration: 3000,
    });
  };

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

  // Error state with retry button
  if (hasError || connectionStatus === 'disconnected') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Er is een probleem opgetreden</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>De marktdata kon niet correct worden verwerkt: {errorMessage || "Verbinding verbroken"}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry}
            className="w-fit"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Opnieuw proberen
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // If no data after initial loading, show message
  if (!marketData.length) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Geen marktdata beschikbaar</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>Er is momenteel geen marktdata beschikbaar. Dit kan komen door onderhoud of een tijdelijke storing.</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry}
            className="w-fit"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Vernieuwen
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Add debug logging for marketData
  console.log('Processing marketData for charts:', {
    items: marketData.length,
    firstItem: marketData[0],
    markets: [...new Set(marketData.map(item => item.market))]
  });

  const groupedData = marketData.reduce((acc, item) => {
    if (!acc[item.market]) {
      acc[item.market] = [];
    }
    acc[item.market].push({
      name: item.symbol,
      volume: item.volume || 0,
      price: item.price,
      change: item.change24h || 0,
      high: item.high24h || item.price,
      low: item.low24h || item.price
    });
    return acc;
  }, {} as Record<string, any[]>);

  // Log the grouped data for debugging
  console.log('Grouped chart data:', {
    markets: Object.keys(groupedData),
    sampleMarket: Object.keys(groupedData)[0] ? groupedData[Object.keys(groupedData)[0]][0] : null
  });

  const marketOrder = ['NYSE', 'NASDAQ', 'AEX', 'DAX', 'CAC40', 'NIKKEI', 'HSI', 'SSE', 'Crypto'];

  // Get the first available market data for AI analysis
  const firstMarketData = marketData.length > 0 ? marketData[0] : null;

  return (
    <div className="w-full bg-secondary/30 backdrop-blur-lg border border-secondary/50 rounded-lg shadow-lg will-change-transform hover:shadow-xl transition-all duration-300 ease-out">
      <div className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/5 pointer-events-none" />
        
        <div className="relative flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
            Wereldwijde Markten
          </h2>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1.5 hover:bg-primary/20"
            onClick={toggleAIInsights}
          >
            <BrainCircuit className="h-4 w-4" />
            {showAIInsights ? "Hide AI Insights" : "Show AI Insights"}
          </Button>
        </div>
        
        {showAIInsights && (
          <div className="mb-6">
            <AIMarketAnalysis 
              marketData={firstMarketData || undefined} 
              className="h-[300px]"
            />
          </div>
        )}
        
        <Tabs defaultValue={marketOrder.find(market => groupedData[market]?.length > 0) || marketOrder[0]} className="w-full">
          <TabsList className="mb-6 bg-background/50 backdrop-blur-md relative flex flex-wrap gap-1">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50" />
            {marketOrder.map((market) => (
              groupedData[market]?.length > 0 && (
                <TabsTrigger 
                  key={market}
                  value={market} 
                  className="relative data-[state=active]:bg-primary/20 data-[state=active]:backdrop-blur-lg transition-all duration-300 ease-out hover:bg-primary/10"
                >
                  {market}
                </TabsTrigger>
              )
            ))}
          </TabsList>

          <div className="h-[500px] transition-transform will-change-transform duration-500 ease-out">
            {marketOrder.map((market) => (
              groupedData[market]?.length > 0 && (
                <TabsContent 
                  key={market}
                  value={market} 
                  className="mt-0 h-full animate-in fade-in-50 duration-500 ease-out"
                >
                  <MarketCharts 
                    data={groupedData[market] || []} 
                    isLoading={!marketData.length} 
                    type="overview" 
                  />
                </TabsContent>
              )
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketOverview;
