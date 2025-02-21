
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { MarketData } from "@/components/market/types";
import { useToast } from "./use-toast";
import { RealtimeChannel } from "@supabase/supabase-js";

export const useMarketWebSocket = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const { toast } = useToast();

  const reconnect = useCallback(async () => {
    setConnectionStatus('connecting');
    try {
      await fetchInitialData();
      toast({
        title: "Verbinding hersteld",
        description: "De marktdata wordt nu opnieuw opgehaald.",
      });
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Reconnection error:', error);
      setConnectionStatus('disconnected');
      toast({
        title: "Verbinding mislukt",
        description: "Kon geen nieuwe verbinding maken met de marktdata service. Probeer het later opnieuw.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    let isSubscribed = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 5000; // 5 seconds
    let currentChannel: RealtimeChannel | null = null;

    const setupWebSocket = async () => {
      if (!isSubscribed) return null;
      
      try {
        await fetchInitialData();
        
        const channel = supabase
          .channel('market-updates')
          .on('broadcast', { event: 'market-data' }, async (payload) => {
            if (!isSubscribed) return;
            
            console.log('Received market data:', payload);
            if (payload.payload) {
              const newMarketData = payload.payload as MarketData[];
              setMarketData(newMarketData);
              
              try {
                const { data: analysisData, error: analysisError } = await supabase.functions.invoke('market-analysis', {
                  body: { marketData: newMarketData }
                });
                
                if (analysisError) throw analysisError;
                
                if (analysisData?.analyses) {
                  console.log('Market analyses:', analysisData.analyses);
                  
                  const socialData = newMarketData.map(data => ({
                    text: `${data.symbol} ${data.change24h > 0 ? 'shows positive movement' : 'shows negative movement'} of ${Math.abs(data.change24h)}%`,
                    source: "market-data",
                    timestamp: new Date().toISOString(),
                    language: "en",
                    region: data.symbol.includes('EUR') ? 'EU' : 
                           data.symbol.includes('USD') ? 'US' : 
                           data.symbol.includes('JPY') ? 'ASIA' : 'global'
                  }));

                  const { data: sentimentData, error: sentimentError } = await supabase.functions.invoke('social-monitor', {
                    body: { socialData }
                  });

                  if (sentimentError) throw sentimentError;

                  if (sentimentData?.analyses) {
                    console.log('Global social sentiment analyses:', sentimentData.analyses);
                  }
                }
              } catch (error) {
                console.error('Analysis error:', error);
                toast({
                  title: "Analyse Fout",
                  description: "Er was een probleem bij het analyseren van de marktdata.",
                  variant: "destructive",
                });
              }
            }
          })
          .subscribe((status) => {
            if (!isSubscribed) return;
            
            console.log('Connection status:', status);
            if (status === 'SUBSCRIBED') {
              setConnectionStatus('connected');
              toast({
                title: "Verbinding Actief",
                description: "Je ontvangt nu live market updates.",
              });
            } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
              setConnectionStatus('disconnected');
              toast({
                title: "Verbinding Verbroken",
                description: "De verbinding met de marktdata service is verbroken.",
                variant: "destructive",
              });
              
              // Retry logic
              if (retryCount < maxRetries) {
                retryCount++;
                setTimeout(() => {
                  console.log(`Attempting reconnection (${retryCount}/${maxRetries})...`);
                  reconnect();
                }, retryDelay);
              }
            }
          });

        return channel;
      } catch (error) {
        console.error('WebSocket setup error:', error);
        setConnectionStatus('disconnected');
        toast({
          title: "Verbinding Fout",
          description: "Er was een probleem bij het opzetten van de marktdata verbinding.",
          variant: "destructive",
        });
        return null;
      }
    };

    // Initialize WebSocket connection
    setupWebSocket().then(channel => {
      if (channel) {
        currentChannel = channel;
      }
    });

    // Cleanup function
    return () => {
      isSubscribed = false;
      if (currentChannel) {
        supabase.removeChannel(currentChannel);
      }
    };
  }, [toast, reconnect]);

  const fetchInitialData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('market-data-collector');
      
      if (error) throw error;

      if (data && Array.isArray(data)) {
        setMarketData(data as MarketData[]);
        
        try {
          const { data: analysisData, error: analysisError } = await supabase.functions.invoke('market-analysis', {
            body: { marketData: data }
          });
          
          if (analysisError) throw analysisError;
          
          if (analysisData?.analyses) {
            console.log('Initial market analyses:', analysisData.analyses);
          }
        } catch (error) {
          console.error('Initial analysis error:', error);
          toast({
            title: "Analyse Fout",
            description: "Er was een probleem bij het analyseren van de initiële marktdata.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Market data error:', error);
      toast({
        title: "Data Error",
        description: "Kon geen marktdata ophalen. Controleer je internetverbinding.",
        variant: "destructive",
      });
      throw error; // Re-throw for the reconnect logic
    }
  };

  return { 
    marketData, 
    connectionStatus,
    reconnect
  };
};
