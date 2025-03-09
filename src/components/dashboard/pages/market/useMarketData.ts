import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { MarketData } from "@/components/market/types";
import { useToast } from "@/hooks/use-toast";
import { generateEmergencyMarketData } from "./enhanced/utils/emergencyDataGenerator";

export const useMarketData = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("market");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedMarket, setSelectedMarket] = useState<string>("all");
  const [uniqueMarkets, setUniqueMarkets] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchMarketData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Fetching market data...");
      
      // First try the primary data source
      const { data: primaryData, error: primaryError } = await supabase.functions.invoke('fetch-market-data');
      
      if (!primaryError && primaryData && Array.isArray(primaryData) && primaryData.length > 0) {
        console.log("Successfully received market data from primary source:", primaryData.length, "items");
        setMarketData(primaryData as MarketData[]);
        
        // Extract unique markets
        const markets = [...new Set(primaryData.map((item: any) => item.market))];
        setUniqueMarkets(markets.filter(Boolean) as string[]);
        
        toast({
          title: "Market data updated",
          description: `Successfully fetched data for ${primaryData.length} markets`,
          duration: 3000,
        });
        
        setIsLoading(false);
        return;
      }
      
      if (primaryError) {
        console.error("Error from primary source:", primaryError);
      } else {
        console.log("Primary source returned invalid data, trying fallback");
      }
      
      // Try the fallback source
      const { data: fallbackData, error: fallbackError } = await supabase.functions.invoke('market-data-collector');
      
      if (fallbackError) {
        console.error("Error from fallback source:", fallbackError);
        throw new Error(`Fallback data fetch failed: ${fallbackError.message}`);
      }
      
      let validData: MarketData[] = [];
      
      if (fallbackData) {
        if (Array.isArray(fallbackData)) {
          validData = fallbackData as MarketData[];
          console.log("Successfully received direct array from fallback source:", validData.length, "items");
        } else if (fallbackData.data && Array.isArray(fallbackData.data)) {
          validData = fallbackData.data as MarketData[];
          console.log("Successfully received data from fallback source data property:", validData.length, "items");
        }
        
        if (validData.length > 0) {
          setMarketData(validData);
          
          // Extract unique markets
          const markets = [...new Set(validData.map(item => item.market))];
          setUniqueMarkets(markets.filter(Boolean) as string[]);
          
          toast({
            title: "Market data updated",
            description: `Successfully fetched fallback data for ${validData.length} markets`,
            duration: 3000,
          });
          
          setIsLoading(false);
          return;
        }
      }
      
      // If no valid data from either source, use emergency data
      console.warn("No valid data from any source, using emergency generated data");
      const emergencyData = generateEmergencyMarketData();
      setMarketData(emergencyData);
      
      // Extract unique markets
      const markets = [...new Set(emergencyData.map(item => item.market))];
      setUniqueMarkets(markets.filter(Boolean) as string[]);
      
      toast({
        title: "Using backup market data",
        description: "Could not connect to market data services. Using backup data instead.",
        variant: "warning",
        duration: 5000,
      });
      
    } catch (error) {
      console.error("Error fetching market data:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      
      // Use emergency data in case of error
      const emergencyData = generateEmergencyMarketData();
      setMarketData(emergencyData);
      
      // Extract unique markets from emergency data
      const markets = [...new Set(emergencyData.map(item => item.market))];
      setUniqueMarkets(markets.filter(Boolean) as string[]);
      
      toast({
        title: "Data Error",
        description: error instanceof Error ? error.message : "Failed to fetch market data. Using backup data.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMarketData();
    
    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(() => {
      fetchMarketData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  const sortData = (data: MarketData[]) => {
    if (!Array.isArray(data) || data.length === 0) return [];
    
    return [...data].sort((a, b) => {
      // Handle numeric fields
      if (["price", "volume", "change24h", "high24h", "low24h"].includes(sortField)) {
        const aValue = a[sortField as keyof MarketData] as number;
        const bValue = b[sortField as keyof MarketData] as number;
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      // Handle string fields
      const aValue = String(a[sortField as keyof MarketData] || '');
      const bValue = String(b[sortField as keyof MarketData] || '');
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    });
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const handleSortChange = (field: string) => {
    if (field === sortField) {
      toggleSortDirection();
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Add defensive checks to ensure marketData is always an array
  const filteredData = Array.isArray(marketData) 
    ? marketData.filter(item => selectedMarket === "all" || item.market === selectedMarket)
    : [];
  
  const sortedAndFilteredData = sortData(filteredData);

  return {
    marketData: sortedAndFilteredData,
    isLoading,
    error,
    sortField,
    sortDirection,
    selectedMarket,
    uniqueMarkets,
    fetchMarketData,
    toggleSortDirection,
    handleSortChange,
    setSelectedMarket,
  };
};
