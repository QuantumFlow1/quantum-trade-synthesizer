
import { useQuery } from '@tanstack/react-query';
import { useToast } from "./use-toast";
import { MarketData } from '@/components/market/types';

export const useMarketData = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['marketData'],
    queryFn: async () => {
      try {
        console.log('Fetching market data...');
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-market-data`, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        });
        
        if (!response.ok) {
          console.error('Market data fetch failed:', response.status);
          throw new Error('Failed to fetch market data');
        }
        
        const data = await response.json();
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
