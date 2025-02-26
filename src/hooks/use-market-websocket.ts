
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { MarketData } from "@/components/market/types";
import { useToast } from "./use-toast";
import { RealtimeChannel } from "@supabase/supabase-js";

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
      
      const { data, error } = await supabase.functions.invoke('market-data-collector');
      
      if (error) {
        console.error('Error fetching market data:', error);
        throw error;
      }

      if (data && Array.isArray(data)) {
        console.log('Successfully received market data:', data.length, 'items');
        setMarketData(data as MarketData[]);
        setConnectionStatus('connected');
        setRetryCount(0); // Reset retry count on success
        
        return true;
      } else {
        console.error('Received invalid market data format:', data);
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Market data fetch error:', error);
      setConnectionStatus('disconnected');
      
      toast({
        title: "Data Error",
        description: "Could not fetch market data. Check your internet connection.",
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
        title: "Connection Restored",
        description: "Market data service connection has been restored.",
      });
    } else if (retryCount < maxRetries) {
      setRetryCount(prevCount => prevCount + 1);
      toast({
        title: "Reconnection Failed",
        description: `Retry ${retryCount + 1}/${maxRetries} failed. Trying again in ${retryDelay / 1000} seconds.`,
        variant: "destructive",
      });
      
      setTimeout(reconnect, retryDelay);
    } else {
      toast({
        title: "Connection Failed",
        description: "Maximum retry attempts reached. Please try again later.",
        variant: "destructive",
      });
    }
  }, [fetchInitialData, retryCount, maxRetries, toast]);

  // Set up websocket connection and fetch initial data
  useEffect(() => {
    let isSubscribed = true;
    let currentChannel: RealtimeChannel | null = null;

    const setupConnection = async () => {
      if (!isSubscribed) return;
      
      try {
        // First fetch initial data
        const success = await fetchInitialData();
        if (!success || !isSubscribed) return;
        
        // Then set up realtime channel for updates
        const channel = supabase
          .channel('market-updates')
          .on('broadcast', { event: 'market-data' }, (payload) => {
            if (!isSubscribed) return;
            
            console.log('Received market data update:', payload);
            if (payload.payload && Array.isArray(payload.payload)) {
              const newMarketData = payload.payload as MarketData[];
              setMarketData(newMarketData);
            }
          })
          .subscribe((status) => {
            if (!isSubscribed) return;
            
            console.log('Market data websocket status:', status);
            if (status === 'SUBSCRIBED') {
              setConnectionStatus('connected');
            } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
              setConnectionStatus('disconnected');
              
              // Auto-retry if channel closes unexpectedly
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

    // Clean up function
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
