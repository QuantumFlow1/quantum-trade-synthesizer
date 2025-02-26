
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

  // Functie om initiële marktdata op te halen
  const fetchInitialData = useCallback(async () => {
    try {
      console.log('Fetching initial market data...');
      setConnectionStatus('connecting');
      
      const { data, error } = await supabase.functions.invoke('market-data-collector');
      
      if (error) {
        console.error('Error fetching market data:', error);
        throw error;
      }

      // Valideer data voordat we het verwerken
      if (!data) {
        console.error('No data received from market-data-collector');
        throw new Error('No market data received');
      }

      if (!Array.isArray(data)) {
        console.error('Received invalid market data format:', data);
        throw new Error('Invalid data format received: data is not an array');
      }

      // Extra validatie voor de datastructuur
      const isValidDataStructure = data.every(item => 
        item && 
        typeof item.market === 'string' &&
        typeof item.symbol === 'string' &&
        typeof item.price === 'number' &&
        typeof item.volume === 'number'
      );

      if (!isValidDataStructure) {
        console.error('Invalid data structure in received data:', data);
        throw new Error('Invalid data structure received');
      }

      console.log('Successfully received market data:', data.length, 'items');
      setMarketData(data as MarketData[]);
      setConnectionStatus('connected');
      setRetryCount(0); // Reset retry count on success
      
      return true;
    } catch (error) {
      console.error('Market data fetch error:', error);
      setConnectionStatus('disconnected');
      
      toast({
        title: "Data Error",
        description: error instanceof Error ? error.message : "Could not fetch market data. Check your internet connection.",
        variant: "destructive",
      });
      
      return false;
    }
  }, [toast]);

  // Functie om opnieuw te verbinden
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

  // Websocket verbinding opzetten en initiële data ophalen
  useEffect(() => {
    let isSubscribed = true;
    let currentChannel: RealtimeChannel | null = null;

    const setupConnection = async () => {
      if (!isSubscribed) return;
      
      try {
        // Eerste initiële data ophalen
        const success = await fetchInitialData();
        if (!success || !isSubscribed) return;
        
        // Daarna realtime kanaal opzetten voor updates
        const channel = supabase
          .channel('market-updates')
          .on('broadcast', { event: 'market-data' }, (payload) => {
            if (!isSubscribed) return;
            
            console.log('Received market data update:', payload);
            if (payload.payload && Array.isArray(payload.payload)) {
              try {
                // Valideer de ontvangen data
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
              
              // Auto-retry bij onverwacht afsluiten van kanaal
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

    // Initialiseer verbinding
    setupConnection();

    // Cleanup functie
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
