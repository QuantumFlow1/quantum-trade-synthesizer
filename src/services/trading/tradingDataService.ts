
import { TradingDataPoint, generateTradingData } from "@/utils/tradingData";

/**
 * Basic trading data service that provides simulated data
 */
class TradingDataService {
  private data: TradingDataPoint[] = [];
  private lastUpdate: Date = new Date();
  
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
    // Add timestamp for debugging
    console.log(`Refreshing trading data for timeframe: ${timeframe} at ${new Date().toISOString()}`);
    
    // Generate new data
    this.data = generateTradingData(timeframe);
    this.lastUpdate = new Date();
    
    console.log(`Generated ${this.data.length} trading data points`);
    return this.data;
  }
  
  /**
   * Check if data is fresh (less than 30 seconds old)
   */
  isDataFresh(): boolean {
    const now = new Date();
    const diffInMs = now.getTime() - this.lastUpdate.getTime();
    return diffInMs < 30000; // 30 seconds
  }
  
  /**
   * Get last update time
   */
  getLastUpdateTime(): Date {
    return this.lastUpdate;
  }
}

export const tradingDataService = new TradingDataService();
