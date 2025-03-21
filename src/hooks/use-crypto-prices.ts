
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';

export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h?: number;
  marketCap?: number;
  high24h?: number;
  low24h?: number;
  lastUpdated: string;
  thumbnail?: string;
  source?: string;
}

interface UseCryptoPricesOptions {
  symbols?: string[];
  refetchInterval?: number;
  enabled?: boolean;
  priority?: 'price' | 'accuracy';
}

export function useCryptoPrices({
  symbols = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP'],
  refetchInterval = 60000, // Default: 1 minute
  enabled = true,
  priority = 'accuracy'
}: UseCryptoPricesOptions = {}) {
  const { toast } = useToast();
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  return useQuery({
    queryKey: ['cryptoPrices', ...symbols, priority],
    queryFn: async () => {
      try {
        console.log(`Fetching crypto prices for: ${symbols.join(', ')}`);
        console.log(`Data priority: ${priority}`);

        const { data, error } = await supabase.functions.invoke('fetch-crypto-prices', {
          body: { 
            symbols,
            priority
          }
        });

        if (error) {
          console.error('Error fetching crypto prices:', error);
          throw new Error(`Failed to fetch crypto prices: ${error.message}`);
        }

        if (!data || !data.success || !Array.isArray(data.data)) {
          console.error('Invalid data format received:', data);
          throw new Error('Invalid data format received');
        }

        console.log(`Successfully received price data from ${data.source} for ${data.data.length} cryptocurrencies`);
        console.log(`First price (${data.data[0].symbol}): $${data.data[0].price}`);
        setRetryCount(0); // Reset retry count on success

        // Show toast for simulated data
        if (data.source === 'simulated') {
          toast({
            title: 'Using simulated prices',
            description: 'Could not connect to market data services. Using generated data instead.',
            variant: 'warning',
          });
        }

        return data.data as CryptoPrice[];
      } catch (error) {
        console.error('Error in crypto prices query:', error);
        
        // Handle retry logic
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
          
          toast({
            title: 'Connection Error',
            description: `Failed to fetch crypto prices. Retry ${retryCount + 1}/${maxRetries}...`,
            variant: 'destructive',
          });
          
          throw error; // Re-throw to trigger react-query retry
        }
        
        toast({
          title: 'Data Error',
          description: 'Failed to fetch crypto prices after multiple attempts.',
          variant: 'destructive',
        });
        
        throw error;
      }
    },
    refetchInterval: enabled ? refetchInterval : false,
    enabled,
    retry: maxRetries,
    refetchOnWindowFocus: enabled,
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}
