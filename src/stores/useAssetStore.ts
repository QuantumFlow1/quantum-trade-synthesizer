
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface AssetState {
  totalMarketCap: string;
  btcDominance: number;
  ethDominance: number;
  totalVolume: string;
  activeCryptocurrencies: number;
  activeExchanges: number;
  lastUpdated: string;
  marketDirection: "up" | "down" | "neutral";
  isLoading: boolean;
  error: string | null;
  fetchMarketData: () => Promise<void>;
}

const formatLargeNumber = (num: number): string => {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(2) + 'T';
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  } else {
    return num.toFixed(2);
  }
};

const useAssetStore = create<AssetState>((set) => ({
  totalMarketCap: "2.1T",
  btcDominance: 48.5,
  ethDominance: 16.2,
  totalVolume: "82.3B",
  activeCryptocurrencies: 0,
  activeExchanges: 0,
  lastUpdated: new Date().toISOString(),
  marketDirection: "up",
  isLoading: false,
  error: null,
  fetchMarketData: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log('Fetching global market data from CoinMarketCap...');
      
      const { data: response, error } = await supabase.functions.invoke('coinmarketcap-global-metrics');
      
      if (error) {
        console.error('Error fetching market data:', error);
        set({ 
          error: error.message,
          isLoading: false
        });
        return;
      }
      
      if (response && response.success && response.data) {
        const marketData = response.data;
        
        set({
          totalMarketCap: formatLargeNumber(marketData.totalMarketCap),
          btcDominance: parseFloat(marketData.btcDominance.toFixed(2)),
          ethDominance: parseFloat(marketData.ethDominance.toFixed(2)),
          totalVolume: formatLargeNumber(marketData.totalVolume24h),
          activeCryptocurrencies: marketData.activeCryptocurrencies,
          activeExchanges: marketData.activeExchanges,
          lastUpdated: marketData.lastUpdated,
          marketDirection: "up", // This is hardcoded for now, could be calculated based on previous data
          isLoading: false
        });
        
        console.log('Global market data updated successfully');
      } else {
        console.error('Invalid response format:', response);
        set({ 
          error: 'Invalid data format received',
          isLoading: false
        });
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      set({ 
        error: error.message,
        isLoading: false
      });
    }
  }
}));

export default useAssetStore;
