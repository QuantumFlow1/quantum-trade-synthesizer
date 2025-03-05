
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { MarketData } from "@/components/market/types";
import { useToast } from "./use-toast";
import { RealtimeChannel } from "@supabase/supabase-js";
import { generateEmergencyMarketData } from "@/components/dashboard/pages/market/enhanced/utils/emergencyDataGenerator";

export const useMarketWebSocket = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const retryDelay = 5000; // 5 seconds

  // Function to fetch initial market data
  const fetchInitialData = useCallback(async () => {
    try {
      console.log('Fetching initial market data...');
      setConnectionStatus('connecting');
      
      // First, try fetch-market-data which is more detailed
      const { data: fetchData, error: fetchError } = await supabase.functions.invoke('fetch-market-data');
      
      if (fetchError) {
        console.error('Error from fetch-market-data:', fetchError);
        throw new Error(`Failed to fetch market data: ${fetchError.message}`);
      }
      
      if (fetchData && Array.isArray(fetchData) && fetchData.length > 0) {
        console.log('Successfully received data from fetch-market-data:', fetchData.length, 'items');
        setMarketData(fetchData as MarketData[]);
        setConnectionStatus('connected');
        setRetryCount(0); // Reset retry count on success
        return true;
      }
      
      // If that fails, try the market-data-collector as fallback
      console.log('No data from fetch-market-data, trying market-data-collector...');
      const { data: collectorData, error: collectorError } = await supabase.functions.invoke('market-data-collector');
      
      if (collectorError) {
        console.error('Error from market-data-collector:', collectorError);
        throw new Error(`Fallback data fetch failed: ${collectorError.message}`);
      }
      
      if (collectorData && collectorData.status === "success" && Array.isArray(collectorData.data)) {
        console.log('Successfully received data from market-data-collector:', collectorData.data.length, 'items');
        setMarketData(collectorData.data as MarketData[]);
        setConnectionStatus('connected');
        setRetryCount(0); // Reset retry count on success
        return true;
      }
      
      // Create some emergency backup market data if nothing else works
      console.warn('No valid data received, using emergency generated market data');
      const emergencyData = generateEmergencyMarketData();
      setMarketData(emergencyData);
      setConnectionStatus('connected');
      
      toast({
        title: "Fallback marktdata geladen",
        description: "Kon geen verbinding maken met marktdata services. Lokale backup data wordt getoond.",
        variant: "warning",
      });
      
      return false;
    } catch (error) {
      console.error('Market data fetch error:', error);
      setConnectionStatus('disconnected');
      
      // Create emergency data for error case
      const emergencyData = generateEmergencyMarketData();
      setMarketData(emergencyData);
      
      toast({
        title: "Data Error",
        description: error instanceof Error ? error.message : "Kon geen marktdata ophalen. Controleer uw internetverbinding.",
        variant: "destructive",
      });
      
      return false;
    }
  }, [toast]);

  // Function to reconnect
  const reconnect = useCallback(async () => {
    console.log('Attempting to reconnect to market data service...');
    setConnectionStatus('connecting');
    
    if (await fetchInitialData()) {
      toast({
        title: "Verbinding hersteld",
        description: "Marktdata verbinding is hersteld.",
      });
    } else if (retryCount < maxRetries) {
      setRetryCount(prevCount => prevCount + 1);
      toast({
        title: "Herverbinden mislukt",
        description: `Poging ${retryCount + 1}/${maxRetries} mislukt. Opnieuw proberen over ${retryDelay / 1000} seconden.`,
        variant: "destructive",
      });
      
      setTimeout(reconnect, retryDelay);
    } else {
      toast({
        title: "Verbinding mislukt",
        description: "Maximaal aantal pogingen bereikt. Probeer het later opnieuw.",
        variant: "destructive",
      });
    }
  }, [fetchInitialData, retryCount, maxRetries, toast]);

  // Websocket setup and initial data fetch
  useEffect(() => {
    let isSubscribed = true;
    let currentChannel: RealtimeChannel | null = null;

    const setupConnection = async () => {
      if (!isSubscribed) return;
      
      try {
        // First fetch initial data
        await fetchInitialData();
        if (!isSubscribed) return;
        
        // Then set up realtime channel for updates
        const channel = supabase
          .channel('market-updates')
          .on('broadcast', { event: 'market-data' }, (payload) => {
            if (!isSubscribed) return;
            
            console.log('Received market data update:', payload);
            if (payload.payload && Array.isArray(payload.payload)) {
              try {
                // Validate the received data
                const newData = payload.payload as MarketData[];
                const isValidData = newData.every(item => 
                  item &&
                  typeof item.market === 'string' &&
                  typeof item.symbol === 'string' &&
                  typeof item.price === 'number'
                );
                
                if (isValidData) {
                  setMarketData(newData);
                } else {
                  console.error('Received invalid market data structure in update');
                }
              } catch (err) {
                console.error('Error processing market data update:', err);
              }
            }
          })
          .subscribe((status) => {
            if (!isSubscribed) return;
            
            console.log('Market data websocket status:', status);
            if (status === 'SUBSCRIBED') {
              setConnectionStatus('connected');
            } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
              setConnectionStatus('disconnected');
              
              // Auto-retry when channel unexpectedly closes
              if (retryCount < maxRetries) {
                const nextRetry = retryCount + 1;
                setRetryCount(nextRetry);
                
                console.log(`Connection lost. Auto-retry ${nextRetry}/${maxRetries} in ${retryDelay}ms...`);
                setTimeout(reconnect, retryDelay);
              }
            }
          });
        
        currentChannel = channel;
      } catch (error) {
        console.error('Error setting up market data connection:', error);
        setConnectionStatus('disconnected');
      }
    };

    // Initialize connection
    setupConnection();

    // Cleanup function
    return () => {
      console.log('Cleaning up market data websocket...');
      isSubscribed = false;
      
      if (currentChannel) {
        supabase.removeChannel(currentChannel);
      }
    };
  }, [fetchInitialData, reconnect, retryCount, maxRetries]);

  return { 
    marketData, 
    connectionStatus,
    reconnect
  };
};
