
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MarketData } from "@/components/market/types";
import { useToast } from "@/hooks/use-toast";

export const useMarketData = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortField, setSortField] = useState<string>("market");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedMarket, setSelectedMarket] = useState<string>("all");
  const [uniqueMarkets, setUniqueMarkets] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchMarketData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-market-data');
      
      if (error) {
        throw error;
      }
      
      if (data && Array.isArray(data)) {
        console.log("Successfully received market data:", data.length, "items");
        setMarketData(data as MarketData[]);
        
        // Extract unique markets
        const markets = [...new Set(data.map((item: any) => item.market))];
        setUniqueMarkets(markets.filter(Boolean) as string[]);
        
        toast({
          title: "Market data updated",
          description: `Successfully fetched data for ${data.length} markets`,
          duration: 3000,
        });
      } else {
        console.error("Invalid market data format:", data);
        setMarketData([]); // Set to empty array if data is invalid
        setUniqueMarkets([]);
        toast({
          title: "Data Error",
          description: "Market data format is invalid. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching market data:", error);
      setMarketData([]);
      setUniqueMarkets([]);
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
