
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MarketData } from "@/components/market/types";
import { useToast } from "./use-toast";

export const useMarketWebSocket = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const { toast } = useToast();

  const reconnect = async () => {
    try {
      await fetchInitialData();
      toast({
        title: "Verbinding hersteld",
        description: "De marktdata wordt nu opnieuw opgehaald.",
      });
    } catch (error) {
      console.error('Reconnection error:', error);
      toast({
        title: "Verbinding mislukt",
        description: "Kon geen nieuwe verbinding maken met de marktdata service.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      if (!isSubscribed) return;
      await fetchInitialData();
    };

    fetchData();

    const channel = supabase
      .channel('market-updates')
      .on('broadcast', { event: 'market-data' }, async (payload) => {
        if (!isSubscribed) return;
        
        console.log('Received market data:', payload);
        if (payload.payload) {
          const newMarketData = payload.payload as MarketData[];
          setMarketData(newMarketData);
          
          // Server-side analyse aanroepen
          try {
            const { data: analysisData, error } = await supabase.functions.invoke('market-analysis', {
              body: { marketData: newMarketData }
            });
            
            if (error) throw error;
            
            if (analysisData?.analyses) {
              console.log('Market analyses:', analysisData.analyses);
            }
          } catch (error) {
            console.error('Analysis error:', error);
          }
        }
      })
      .subscribe((status) => {
        if (!isSubscribed) return;
        
        console.log('Connection status:', status);
        if (status === 'SUBSCRIBED') {
          toast({
            title: "Verbinding Actief",
            description: "Je ontvangt nu live market updates.",
          });
        }
      });

    return () => {
      isSubscribed = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('market-data-collector');
      
      if (error) throw error;

      if (data && Array.isArray(data)) {
        setMarketData(data as MarketData[]);
        
        // Initiële server-side analyse
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
        }
      }
    } catch (error) {
      console.error('Market data error:', error);
      toast({
        title: "Data Error",
        description: "Kon geen markt data ophalen.",
        variant: "destructive",
      });
    }
  };

  return { 
    marketData, 
    reconnect
  };
};
