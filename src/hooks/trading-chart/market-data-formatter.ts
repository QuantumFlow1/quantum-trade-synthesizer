
import { generateTradingData } from "@/utils/tradingData";

/**
 * Formats raw market data into the expected trading data point structure
 */
export const formatMarketData = (apiData: any) => {
  if (!apiData || !Array.isArray(apiData?.data)) {
    console.error("Invalid market data received:", apiData);
    return generateTradingData(); // Fallback to generated data
  }
  
  try {
    const mainAsset = apiData.data[0] || {};
    
    const formattedData = generateTradingData().map((item) => {
      const trendValue: "up" | "down" | "neutral" = 
        mainAsset.change24h !== undefined 
          ? (mainAsset.change24h >= 0 ? "up" : "down") 
          : item.trend;
          
      return {
        ...item,
        open: mainAsset.price ? mainAsset.price * (0.99 + Math.random() * 0.02) : item.open,
        close: mainAsset.price || item.close,
        high: mainAsset.high24h || (mainAsset.price ? mainAsset.price * 1.02 : item.high),
        low: mainAsset.low24h || (mainAsset.price ? mainAsset.price * 0.98 : item.low),
        volume: mainAsset.volume24h || item.volume,
        trend: trendValue
      };
    });
    
    return formattedData;
  } catch (error) {
    console.error("Error formatting market data:", error);
    return generateTradingData(); // Fallback to generated data
  }
};
