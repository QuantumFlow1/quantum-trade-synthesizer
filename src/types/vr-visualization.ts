
import { TradingDataPoint } from "@/utils/tradingData";
import { MarketData } from "@/components/market/types";

/**
 * Core data structure for 3D market visualizations
 * This will be used by both web 3D and VR/AR visualizations
 */
export interface Market3DData {
  // Market identification
  symbol: string;
  name?: string;
  
  // Current price data
  currentPrice: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  
  // Visual properties
  position?: {
    x: number;
    y: number;
    z: number;
  };
  color?: string;
  scale?: number;
  
  // Historical data for visualization
  priceHistory: TradingDataPoint[];
  
  // Additional data
  volume24h?: number;
  marketCap?: number;
  
  // Metadata for VR/AR
  vrMetadata?: {
    interactable: boolean;
    detailLevel: 'low' | 'medium' | 'high';
    renderPriority: number;
    loadDistance: number;
  };
}

/**
 * Structure for the entire VR trading floor
 */
export interface TradingFloor {
  markets: Market3DData[];
  layout: 'grid' | 'circular' | 'clustered' | 'free';
  floorSize: {
    width: number;
    depth: number;
    height: number;
  };
  sectors?: {
    name: string;
    position: {
      x: number;
      y: number;
      z: number;
    };
    markets: string[]; // symbols of markets in this sector
  }[];
}

/**
 * Convert standard market data to 3D visualization format
 */
export const convertToMarket3DData = (
  marketData: MarketData[],
  tradingData: TradingDataPoint[]
): Market3DData[] => {
  if (!marketData || !tradingData) return [];
  
  return marketData.map((market, index) => {
    return {
      symbol: market.symbol,
      name: market.name || market.symbol,
      currentPrice: market.price,
      priceChange24h: market.change24h || 0,
      priceChangePercent24h: (market.change24h || 0) / market.price * 100,
      position: {
        x: (index % 5) * 4 - 8,
        y: 0,
        z: Math.floor(index / 5) * 4 - 8
      },
      color: (market.change24h || 0) >= 0 ? "#10b981" : "#ef4444",
      scale: 1,
      priceHistory: tradingData,
      volume24h: market.volume,
      marketCap: market.marketCap,
      vrMetadata: {
        interactable: true,
        detailLevel: 'medium',
        renderPriority: 1,
        loadDistance: 50
      }
    };
  });
};

/**
 * Generate a trading floor layout
 */
export const generateTradingFloor = (
  markets: Market3DData[],
  layout: TradingFloor['layout'] = 'grid'
): TradingFloor => {
  return {
    markets,
    layout,
    floorSize: {
      width: 100,
      depth: 100,
      height: 30
    },
    sectors: [
      {
        name: "Cryptocurrencies",
        position: { x: -30, y: 0, z: -30 },
        markets: markets
          .filter(m => m.symbol.includes("BTC") || m.symbol.includes("ETH"))
          .map(m => m.symbol)
      },
      {
        name: "Tech Stocks",
        position: { x: 30, y: 0, z: -30 },
        markets: markets
          .filter(m => !m.symbol.includes("BTC") && !m.symbol.includes("ETH"))
          .map(m => m.symbol)
      }
    ]
  };
};
