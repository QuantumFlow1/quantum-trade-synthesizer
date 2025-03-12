
import { useState, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const useMarketDataFetcher = () => {
  const { toast } = useToast();
  const [realMarketData, setRealMarketData] = useState<any[]>([]);

  // Fetch real market data for backtesting
  const fetchRealMarketData = useCallback(async () => {
    try {
      console.log("Fetching real market data for backtesting portfolio strategies...");
      
      const { data, error } = await supabase.functions.invoke('real-crypto-data');
      
      if (error) {
        console.error("Error fetching real market data:", error);
        return;
      }
      
      if (data && data.success && Array.isArray(data.data)) {
        console.log("Successfully fetched real market data for backtesting:", data.data.length, "items");
        setRealMarketData(data.data);
        toast({
          title: "Real Market Data Ready",
          description: `Loaded ${data.data.length} market data points for backtesting`,
          duration: 3000
        });
      }
    } catch (err) {
      console.error("Failed to fetch real market data:", err);
    }
  }, [toast]);

  // Effect to fetch real market data on mount
  useEffect(() => {
    fetchRealMarketData();
    
    // Set up an interval to refresh market data periodically
    const intervalId = setInterval(fetchRealMarketData, 60000); // refresh every minute
    
    return () => clearInterval(intervalId);
  }, [fetchRealMarketData]);

  return {
    realMarketData,
    fetchRealMarketData,
    hasRealMarketData: realMarketData.length > 0
  };
};
