
import { MarketData } from "@/components/market/types";

export const generateEmergencyMarketData = (): MarketData[] => {
  console.log("Generating emergency market data as fallback");
  
  // Ensure we include Crypto market data in the emergency fallback
  const emergencyData: MarketData[] = [
    // Crypto markets
    {
      market: "Crypto",
      symbol: "BTC/USD",
      name: "Bitcoin",
      price: 45000 + (Math.random() * 2000),
      change24h: -1.2 + (Math.random() * 3),
      marketCap: 850000000000,
      volume: 28000000000,
      rank: 1,
      circulatingSupply: 19000000,
      totalSupply: 21000000,
      priceChange7d: -3.5 + (Math.random() * 7),
      priceChange30d: -5.2 + (Math.random() * 12),
      ath: 69000,
      atl: 3000,
      athDate: "2021-11-10T00:00:00Z",
      atlDate: "2019-01-01T00:00:00Z",
      lastUpdated: new Date().toISOString()
    },
    {
      market: "Crypto",
      symbol: "ETH/USD",
      name: "Ethereum",
      price: 2500 + (Math.random() * 300),
      change24h: 0.8 + (Math.random() * 2),
      marketCap: 310000000000,
      volume: 15000000000,
      rank: 2,
      circulatingSupply: 120000000,
      totalSupply: 120000000,
      priceChange7d: 2.1 + (Math.random() * 5),
      priceChange30d: -1.2 + (Math.random() * 8),
      ath: 4800,
      atl: 80,
      athDate: "2021-11-08T00:00:00Z",
      atlDate: "2018-12-18T00:00:00Z",
      lastUpdated: new Date().toISOString()
    },
    {
      market: "Crypto",
      symbol: "SOL/USD",
      name: "Solana",
      price: 110 + (Math.random() * 30),
      change24h: 3.5 + (Math.random() * 4),
      marketCap: 50000000000,
      volume: 5000000000,
      rank: 5,
      circulatingSupply: 410000000,
      totalSupply: 550000000,
      priceChange7d: 8.2 + (Math.random() * 6),
      priceChange30d: 15.3 + (Math.random() * 10),
      ath: 260,
      atl: 0.5,
      athDate: "2021-11-06T00:00:00Z",
      atlDate: "2020-03-18T00:00:00Z",
      lastUpdated: new Date().toISOString()
    },
    
    // Stock markets
    {
      market: "NYSE",
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 180 + (Math.random() * 10),
      change24h: 0.5 + (Math.random() * 1),
      marketCap: 2950000000000,
      volume: 8000000000,
      rank: 1,
      circulatingSupply: 16000000000,
      totalSupply: 16000000000,
      priceChange7d: 1.2 + (Math.random() * 2),
      priceChange30d: 3.5 + (Math.random() * 3),
      lastUpdated: new Date().toISOString()
    },
    {
      market: "NASDAQ",
      symbol: "MSFT",
      name: "Microsoft Corporation",
      price: 370 + (Math.random() * 20),
      change24h: 0.3 + (Math.random() * 1.5),
      marketCap: 2750000000000,
      volume: 6000000000,
      rank: 2,
      circulatingSupply: 7400000000,
      totalSupply: 7400000000,
      priceChange7d: 0.8 + (Math.random() * 2),
      priceChange30d: 2.1 + (Math.random() * 3),
      lastUpdated: new Date().toISOString()
    }
  ];
  
  return emergencyData;
};
