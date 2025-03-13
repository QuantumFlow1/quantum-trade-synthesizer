
import { create } from 'zustand';

interface GasPriceState {
  standardGasPrice: number | null;
  fastGasPrice: number | null;
  lastFetched: number;
  fetchGasPrices: () => Promise<void>;
}

const useGasPriceStore = create<GasPriceState>((set) => ({
  standardGasPrice: null,
  fastGasPrice: null,
  lastFetched: 0,
  fetchGasPrices: async () => {
    try {
      // Using Etherscan API to fetch gas prices
      const response = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKey');
      const data = await response.json();
      
      if (data.status === '1') {
        set({
          standardGasPrice: parseInt(data.result.ProposeGasPrice),
          fastGasPrice: parseInt(data.result.FastGasPrice),
          lastFetched: Date.now()
        });
      } else {
        console.error('Failed to fetch gas prices:', data.message);
      }
    } catch (error) {
      console.error('Error fetching gas prices:', error);
    }
  }
}));

export default useGasPriceStore;
