
import { useQuery } from '@tanstack/react-query';
import { useToast } from "./use-toast";
import { MarketData } from '@/components/market/types';
import { supabase } from '@/lib/supabase';

export const useMarketData = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['marketData'],
    queryFn: async () => {
      try {
        console.log('Checking Supabase connection...');
        const { data, error } = await supabase.functions.invoke('fetch-market-data', {
          method: 'GET'
        });
        
        if (error) {
          console.error('Market data fetch failed:', error);
          toast({
            title: "Connectie Error",
            description: "Er kon geen verbinding worden gemaakt met de server. Controleer je internetverbinding.",
            variant: "destructive",
          });
          throw error;
        }
        
        if (!data) {
          console.error('No market data received');
          toast({
            title: "Data Error",
            description: "Er zijn geen marktgegevens ontvangen. Probeer het later opnieuw.",
            variant: "destructive",
          });
          throw new Error('No market data received');
        }
        
        console.log('Market data received:', data);
        return data as MarketData[];
      } catch (error) {
        console.error('Market data error:', error);
        toast({
          title: "Error",
          description: "Fout bij het laden van marktdata. Probeer het later opnieuw.",
          variant: "destructive",
        });
        throw error;
      }
    },
    refetchInterval: 5000,
    retry: 3
  });
};
