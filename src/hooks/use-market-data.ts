
import { useQuery } from '@tanstack/react-query';
import { useToast } from "./use-toast";
import { MarketData } from '@/components/market/types';

export const useMarketData = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['marketData'],
    queryFn: async () => {
      const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/fetch-market-data`, {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }
      
      return response.json() as Promise<MarketData[]>;
    },
    refetchInterval: 5000,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Fout bij het laden van marktdata",
          variant: "destructive",
        });
      }
    }
  });
};
