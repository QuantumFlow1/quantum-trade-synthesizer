
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MarketData } from "@/components/market/types";
import { useToast } from "./use-toast";

export const useMarketWebSocket = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const { toast } = useToast();

  // Lokale analyse functie
  const analyzeMarketData = (data: MarketData) => {
    // Basis analyse regels
    if (data.change24h > 3) {
      return {
        recommendation: "KOOP",
        confidence: 0.8,
        reason: "Sterke positieve trend"
      };
    } else if (data.change24h < -3) {
      return {
        recommendation: "VERKOOP",
        confidence: 0.8,
        reason: "Sterke negatieve trend"
      };
    } else if (data.volume > 1000000) {
      return {
        recommendation: "OBSERVEER",
        confidence: 0.6,
        reason: "Hoog handelsvolume"
      };
    }
    
    return {
      recommendation: "HOUDEN",
      confidence: 0.7,
      reason: "Stabiele markt"
    };
  };

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
    fetchInitialData();

    const channel = supabase
      .channel('market-updates')
      .on('broadcast', { event: 'market-data' }, (payload) => {
        console.log('Received market data:', payload);
        if (payload.payload) {
          const newMarketData = payload.payload as MarketData[];
          setMarketData(newMarketData);
          
          // Analyse voor elk marktsymbool
          for (const data of newMarketData) {
            const analysis = analyzeMarketData(data);
            console.log(`Analyse voor ${data.symbol}:`, analysis);
          }
        }
      })
      .subscribe((status) => {
        console.log('Connection status:', status);
        if (status === 'SUBSCRIBED') {
          toast({
            title: "Verbinding Actief",
            description: "Je ontvangt nu live market updates.",
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('market-data-collector');
      
      if (error) throw error;

      if (data) {
        setMarketData(data as MarketData[]);
        // Initiële analyse
        for (const item of data as MarketData[]) {
          const analysis = analyzeMarketData(item);
          console.log(`Initiële analyse voor ${item.symbol}:`, analysis);
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
    reconnect,
    analyzeMarket: analyzeMarketData // Export de analyse functie voor gebruik in andere componenten
  };
};
