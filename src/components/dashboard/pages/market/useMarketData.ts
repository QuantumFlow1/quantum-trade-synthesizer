
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MarketData } from "@/components/market/types";
import { useToast } from "@/hooks/use-toast";

export const useMarketData = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sortField, setSortField] = useState<string>("market");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedMarket, setSelectedMarket] = useState<string>("all");
  const [uniqueMarkets, setUniqueMarkets] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchMarketData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('market-data-collector');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Type assertion to ensure data is treated as MarketData[]
        setMarketData(data as MarketData[]);
        
        // Extract unique markets with proper type handling
        const marketsArray = data as MarketData[];
        const markets = [...new Set(marketsArray.map((item) => item.market))];
        setUniqueMarkets(markets);
      }
    } catch (error) {
      console.error("Error fetching market data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch market data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    
    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchMarketData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const sortData = (data: MarketData[]) => {
    return [...data].sort((a, b) => {
      // Handle numeric fields
      if (["price", "volume", "change24h", "high24h", "low24h"].includes(sortField)) {
        const aValue = a[sortField as keyof MarketData] as number;
        const bValue = b[sortField as keyof MarketData] as number;
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      // Handle string fields
      const aValue = String(a[sortField as keyof MarketData]);
      const bValue = String(b[sortField as keyof MarketData]);
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

  const filteredData = marketData.filter(item => 
    selectedMarket === "all" || item.market === selectedMarket
  );
  
  const sortedAndFilteredData = sortData(filteredData);

  return {
    marketData,
    isLoading,
    sortField,
    sortDirection,
    selectedMarket,
    uniqueMarkets,
    sortedAndFilteredData,
    fetchMarketData,
    toggleSortDirection,
    handleSortChange,
    setSelectedMarket,
  };
};
