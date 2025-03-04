
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { generateTradingData } from "@/utils/tradingData";

// Define the types for market data sources
interface MarketDataSource {
  name: string;
  priority: number;
  fetch: () => Promise<any>;
}

// Function to fetch data from multiple sources with fallback
export async function fetchMarketDataWithFallback() {
  const sources: MarketDataSource[] = [
    {
      name: "Primary API",
      priority: 1,
      fetch: async () => {
        const { data, error } = await supabase.functions.invoke('fetch-market-data');
        if (error) throw error;
        return data;
      }
    },
    {
      name: "Secondary API",
      priority: 2,
      fetch: async () => {
        const { data, error } = await supabase.functions.invoke('market-data-collector');
        if (error) throw error;
        return data;
      }
    },
    {
      name: "Cached Data",
      priority: 3,
      fetch: async () => {
        const { data, error } = await supabase
          .from('market_data_cache')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (error) throw error;
        return JSON.parse(data.data);
      }
    },
    {
      name: "Emergency Fallback",
      priority: 4,
      fetch: () => Promise.resolve(generateTradingData())
    }
  ];

  // Sort sources by priority
  sources.sort((a, b) => a.priority - b.priority);

  // Try each source in order
  for (const source of sources) {
    try {
      console.log(`Attempting to fetch market data from ${source.name}`);
      const data = await source.fetch();
      
      // Validate the data using our enhanced validator
      const { data: validationResult, error } = await supabase.functions.invoke(
        'market-data-validator-enhanced',
        { body: { marketData: data, source: source.name } }
      );
      
      if (error) {
        console.error(`Error validating data from ${source.name}:`, error);
        continue;
      }
      
      if (!validationResult.valid) {
        console.error(`Invalid data from ${source.name}:`, validationResult.errors);
        continue;
      }
      
      console.log(`Successfully fetched data from ${source.name}`);
      
      // Cache the data for future use if it's from a live source
      if (source.priority < 3) {
        try {
          await supabase
            .from('market_data_cache')
            .insert({
              source: source.name,
              data: JSON.stringify(data),
              created_at: new Date().toISOString()
            });
        } catch (cacheError) {
          console.error("Failed to cache market data:", cacheError);
        }
      }
      
      // Log the successful fetch to the audit log
      try {
        await supabase.functions.invoke('log-api-call', {
          body: {
            endpoint: 'market-data',
            source: source.name,
            status: 'success',
            timestamp: new Date().toISOString()
          }
        });
      } catch (logError) {
        console.error("Failed to log API call:", logError);
      }
      
      // Only show a toast for fallback sources
      if (source.priority > 1) {
        toast({
          title: "Using Fallback Data Source",
          description: `Primary data source unavailable. Using ${source.name.toLowerCase()}.`,
          variant: "warning",
        });
      }
      
      return validationResult.data;
    } catch (error) {
      console.error(`Failed to fetch data from ${source.name}:`, error);
      
      // Log the failed fetch to the audit log
      try {
        await supabase.functions.invoke('log-api-call', {
          body: {
            endpoint: 'market-data',
            source: source.name,
            status: 'error',
            error_message: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
          }
        });
      } catch (logError) {
        console.error("Failed to log API call:", logError);
      }
    }
  }
  
  // If all sources fail, return an error
  toast({
    title: "Data Fetch Failed",
    description: "All market data sources failed. Please try again later.",
    variant: "destructive",
  });
  
  // Return empty data array
  return [];
}

// Function to periodically refresh the cache to ensure we always have recent data
export async function startCacheRefreshService(intervalMinutes = 15) {
  // Initial fetch to populate cache
  try {
    await fetchMarketDataWithFallback();
  } catch (error) {
    console.error("Initial cache population failed:", error);
  }
  
  // Set up interval for periodic refresh
  setInterval(async () => {
    try {
      await fetchMarketDataWithFallback();
    } catch (error) {
      console.error("Cache refresh failed:", error);
    }
  }, intervalMinutes * 60 * 1000);
}
