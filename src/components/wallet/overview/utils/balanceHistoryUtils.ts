
import { WalletType } from "../../types/walletTypes";

export interface BalanceHistoryDataPoint {
  date: string;
  fullDate: string;
  balance: number;
}

/**
 * Generates mock historical balance data
 */
export const generateMockBalanceData = (walletType: WalletType): BalanceHistoryDataPoint[] => {
  const result: BalanceHistoryDataPoint[] = [];
  const now = new Date();
  
  // Start with a base value and add some randomness
  let baseValue = walletType === 'crypto' ? 10000 : 5000;
  
  // Volatility is higher for crypto, lower for fiat
  const volatility = walletType === 'crypto' ? 0.48 : 0.1;
  const maxChange = walletType === 'crypto' ? 500 : 100;
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some randomness to simulate price movements
    // More weight to previous value to simulate realistic price movements
    const randomChange = (Math.random() - volatility) * maxChange;
    baseValue = baseValue + randomChange;
    
    // For yearly data, we'll format differently to avoid crowding
    const formattedDate = i % 30 === 0 || i === 0 || i === 364 ? 
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 
      "";
    
    result.push({
      date: formattedDate,
      fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      balance: Math.max(baseValue, walletType === 'crypto' ? 1000 : 500) // Ensure we don't go below minimum
    });
  }
  
  return result;
};
