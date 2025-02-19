
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
        console.log('Fetching market data...');
        const { data, error } = await supabase.functions.invoke('fetch-market-data');
        
        if (error) {
          console.error('Market data fetch failed:', error);
          throw error;
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
