
import { MarketData } from '@/components/market/types';

/**
 * Generates emergency market data as a fallback when API calls fail
 * to ensure the application can still function with meaningful data
 */
export const generateEmergencyMarketData = (): MarketData[] => {
  const markets = ['NYSE', 'NASDAQ', 'Crypto', 'AEX', 'DAX'];
  const symbols = [
    { market: 'NYSE', symbol: 'AAPL', name: 'Apple Inc.', basePrice: 180 },
    { market: 'NYSE', symbol: 'MSFT', name: 'Microsoft Corp.', basePrice: 390 },
    { market: 'NASDAQ', symbol: 'GOOGL', name: 'Alphabet Inc.', basePrice: 142 },
    { market: 'NASDAQ', symbol: 'AMZN', name: 'Amazon.com Inc.', basePrice: 175 },
    { market: 'Crypto', symbol: 'BTC/USD', name: 'Bitcoin', basePrice: 45000 },
    { market: 'Crypto', symbol: 'ETH/USD', name: 'Ethereum', basePrice: 2500 },
    { market: 'AEX', symbol: 'ASML', name: 'ASML Holding NV', basePrice: 850 },
    { market: 'DAX', symbol: 'SAP', name: 'SAP SE', basePrice: 175 },
  ];
  
  return symbols.map(({ market, symbol, name, basePrice }) => {
    // Generate random price within a range
    const randomFactor = 0.95 + Math.random() * 0.1;
    const price = basePrice * randomFactor;
    
    const change24h = parseFloat(((randomFactor - 1) * 100).toFixed(2));
    
    // Calculate high/low for current price display
    const highValue = parseFloat((price * (1 + Math.random() * 0.02)).toFixed(2));
    const lowValue = parseFloat((price * (1 - Math.random() * 0.02)).toFixed(2));
    
    // Calculate high24h/low24h for 24-hour ranges
    const high24h = parseFloat((price * (1 + Math.random() * 0.02)).toFixed(2));
    const low24h = parseFloat((price * (1 - Math.random() * 0.02)).toFixed(2));

    return {
      market,
      symbol,
      name,
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000 + 1000000),
      change24h,
      high: highValue,
      low: lowValue,
      high24h,
      low24h,
      marketCap: parseFloat((price * (Math.random() * 1000000000 + 100000000)).toFixed(2)),
      timestamp: Date.now(),
      totalVolume24h: Math.floor(Math.random() * 10000000 + 1000000),
      circulatingSupply: Math.floor(Math.random() * 1000000000 + 100000000),
      lastUpdated: new Date().toISOString()
    };
  });
};
