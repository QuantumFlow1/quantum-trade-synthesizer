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
  trendData: { date: string; value: number }[];
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
  trendData: generateSampleTrendData(),
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
        const marketTrend = determineMarketTrend(marketData.btcDominance);
        
        set({
          totalMarketCap: formatLargeNumber(marketData.totalMarketCap),
          btcDominance: parseFloat(marketData.btcDominance.toFixed(2)),
          ethDominance: parseFloat(marketData.ethDominance.toFixed(2)),
          totalVolume: formatLargeNumber(marketData.totalVolume24h),
          activeCryptocurrencies: marketData.activeCryptocurrencies,
          activeExchanges: marketData.activeExchanges,
          lastUpdated: marketData.lastUpdated,
          marketDirection: marketTrend,
          trendData: updateTrendData(marketData.totalMarketCap),
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

function generateSampleTrendData() {
  const data = [];
  const now = new Date();
  const baseValue = 2100000000000; // 2.1T base value
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Create slight randomness in the trend with a general upward trajectory
    const randomChange = (Math.random() - 0.3) * 0.05; // -3% to +2% daily change
    const value = baseValue * (1 + (i * 0.01) + randomChange); // slight upward trend over time
    
    data.push({
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
      value: Math.round(value)
    });
  }
  
  return data;
}

function updateTrendData(newMarketCap: number) {
  const store = useAssetStore.getState();
  const currentData = [...store.trendData];
  
  // Remove oldest data point if we have more than 30 days
  if (currentData.length >= 30) {
    currentData.shift();
  }
  
  // Add new data point with today's date
  const today = new Date().toISOString().split('T')[0];
  
  // If we already have a data point for today, update it
  const todayIndex = currentData.findIndex(item => item.date === today);
  if (todayIndex >= 0) {
    currentData[todayIndex].value = newMarketCap;
  } else {
    // Otherwise add a new point
    currentData.push({
      date: today,
      value: newMarketCap
    });
  }
  
  return currentData;
}

function determineMarketTrend(btcDominance: number): "up" | "down" | "neutral" {
  const store = useAssetStore.getState();
  const currentTrendData = store.trendData;
  
  if (currentTrendData.length < 2) return "neutral";
  
  const latest = currentTrendData[currentTrendData.length - 1].value;
  const previous = currentTrendData[currentTrendData.length - 2].value;
  
  if (latest > previous * 1.005) return "up"; // Up if increased by 0.5% or more
  if (latest < previous * 0.995) return "down"; // Down if decreased by 0.5% or more
  return "neutral";
}

export default useAssetStore;
