import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MarketData } from "@/components/market/types";
import { useToast } from "./use-toast";

export const useMarketWebSocket = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const { toast } = useToast();

  const analyzeTradingData = async (symbol: string, data: MarketData) => {
    try {
      const { data: analysisResult, error } = await supabase.functions.invoke('trading-analysis', {
        body: { symbol }
      });

      if (error) throw error;
      
      console.log('Analysis result:', analysisResult);
      return analysisResult;
    } catch (error) {
      console.error('Trading analysis error:', error);
      toast({
        title: "Analyse Fout",
        description: "Kon geen trading analyse uitvoeren.",
        variant: "destructive",
      });
    }
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
      .on('broadcast', { event: 'market-data' }, async (payload) => {
        console.log('Received market data:', payload);
        if (payload.payload) {
          const newMarketData = payload.payload as MarketData[];
          setMarketData(newMarketData);
          
          // Analyse per symbool
          for (const data of newMarketData) {
            await analyzeTradingData(data.symbol, data);
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
        for (const item of data as MarketData[]) {
          await analyzeTradingData(item.symbol, item);
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

  return { marketData, reconnect };
};
