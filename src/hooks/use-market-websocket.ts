
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
    // Initiële data laden
    fetchInitialData();

    // Real-time channel setup
    const channel = supabase
      .channel('market-updates')
      .on('broadcast', { event: 'market-data' }, (payload) => {
        console.log('Received real-time market data:', payload);
        if (payload.payload) {
          setMarketData(payload.payload as MarketData[]);
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
