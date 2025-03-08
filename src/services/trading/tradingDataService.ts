
import { TradingDataPoint, generateTradingData } from "@/utils/tradingData";

/**
 * Basic trading data service that provides simulated data
 */
class TradingDataService {
  private data: TradingDataPoint[] = [];
  
  constructor() {
    this.refreshData();
  }
  
  /**
   * Get current trading data
   */
  getData(): TradingDataPoint[] {
    return this.data;
  }
  
  /**
   * Refresh data with newly generated data
   */
  refreshData(timeframe: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w" = "1h"): TradingDataPoint[] {
    this.data = generateTradingData(timeframe);
    return this.data;
  }
}

export const tradingDataService = new TradingDataService();
