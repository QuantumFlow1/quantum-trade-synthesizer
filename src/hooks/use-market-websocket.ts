
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MarketData } from "@/components/market/types";
import { useToast } from "./use-toast";

export const useMarketWebSocket = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const { toast } = useToast();

  const analyzeTradingData = async (symbol: string, data: MarketData[]) => {
    try {
      console.log('Sending data for analysis:', { symbol, data });
      const { data: analysisResult, error } = await supabase.functions.invoke('trading-analysis', {
        body: { symbol, marketData: data }
      });

      if (error) {
        console.error('Trading analysis error:', error);
        throw error;
      }

      console.log('Analysis result:', analysisResult);
      return analysisResult;
    } catch (error) {
      console.error('Error in trading analysis:', error);
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
    // Initiële data laden
    fetchInitialData();

    // Real-time channel setup
    const channel = supabase
      .channel('market-updates')
      .on('broadcast', { event: 'market-data' }, async (payload) => {
        console.log('Received real-time market data:', payload);
        if (payload.payload) {
          const newMarketData = payload.payload as MarketData[];
          setMarketData(newMarketData);
          
          // Voor elk symbool een analyse uitvoeren
          for (const data of newMarketData) {
            await analyzeTradingData(data.symbol, [data]);
          }
        }
      })
      .subscribe((status) => {
        console.log('Real-time connection status:', status);
        
        if (status === 'SUBSCRIBED') {
          toast({
            title: "Real-time Verbinding Actief",
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
      
      if (error) {
        console.error('Error fetching initial market data:', error);
        toast({
          title: "Data Error",
          description: "Kon geen verbinding maken met de markt data.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setMarketData(data as MarketData[]);
        
        // Analyze initial data
        for (const marketItem of data as MarketData[]) {
          await analyzeTradingData(marketItem.symbol, [marketItem]);
        }
      }
    } catch (error) {
      console.error('Market data fetch error:', error);
      toast({
        title: "Connectie Error",
        description: "Er is een probleem met de market data verbinding.",
        variant: "destructive",
      });
    }
  };

  return { marketData, reconnect };
};
