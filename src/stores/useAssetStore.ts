
import { create } from 'zustand';

interface AssetState {
  totalMarketCap: string;
  btcDominance: number;
  ethDominance: number;
  totalVolume: string;
  marketDirection: "up" | "down" | "neutral";
  fetchMarketData: () => Promise<void>;
}

const useAssetStore = create<AssetState>((set) => ({
  totalMarketCap: "2.1",
  btcDominance: 48.5,
  ethDominance: 16.2,
  totalVolume: "82.3",
  marketDirection: "up",
  fetchMarketData: async () => {
    try {
      // In a real app, this would fetch data from an API
      // For now we'll just simulate a successful fetch with mock data
      set({
        totalMarketCap: "2.1",
        btcDominance: 48.5,
        ethDominance: 16.2,
        totalVolume: "82.3",
        marketDirection: "up",
      });
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  }
}));

export default useAssetStore;
