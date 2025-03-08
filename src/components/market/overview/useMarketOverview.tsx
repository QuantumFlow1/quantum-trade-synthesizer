
import { useEffect, useState } from "react";
import { useMarketWebSocket } from "@/hooks/use-market-websocket";
import { useToast } from "@/hooks/use-toast";

export const useMarketOverview = () => {
  const { marketData, reconnect, connectionStatus } = useMarketWebSocket();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
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

  const groupMarketData = (data: any[]) => {
    return data.reduce((acc, item) => {
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
  };

  const groupedData = marketData ? groupMarketData(marketData) : {};
  const marketOrder = ['NYSE', 'NASDAQ', 'AEX', 'DAX', 'CAC40', 'NIKKEI', 'HSI', 'SSE', 'Crypto'];

  return {
    marketData,
    groupedData,
    marketOrder,
    isInitialLoading,
    hasError,
    errorMessage,
    connectionStatus,
    handleRetry,
  };
};
