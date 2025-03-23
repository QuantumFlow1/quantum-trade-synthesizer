
import { MarketData } from "@/components/trading/types";
import { MarketAnalysisResult } from "@/types/market-analysis";

export class MarketAnalyzer {
  // Basic Moving Average calculation
  static calculateMA(prices: number[], windowSize: number): number {
    if (prices.length < windowSize) {
      throw new Error("Insufficient data for MA calculation");
    }
    
    const sum = prices.slice(-windowSize).reduce((a, b) => a + b, 0);
    return sum / windowSize;
  }

  // Exponential Moving Average calculation
  static calculateEMA(prices: number[], windowSize: number): number {
    if (prices.length < windowSize) {
      throw new Error("Insufficient data for EMA calculation");
    }
    
    // Smoothing factor
    const k = 2 / (windowSize + 1);
    
    // Start with SMA for the first EMA value
    let ema = this.calculateMA(prices.slice(0, windowSize), windowSize);
    
    // Calculate EMA for remaining prices
    for (let i = windowSize; i < prices.length; i++) {
      ema = prices[i] * k + ema * (1 - k);
    }
    
    return ema;
  }

  // Relative Strength Index calculation
  static calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length <= period) {
      throw new Error("Insufficient data for RSI calculation");
    }
    
    // Calculate price changes
    const changes = [];
    for (let i = 1; i < prices.length; i++) {
      changes.push(prices[i] - prices[i - 1]);
    }
    
    // Separate gains and losses
    const gains = changes.filter(change => change > 0);
    const losses = changes.filter(change => change < 0).map(loss => Math.abs(loss));
    
    if (gains.length === 0) return 0;
    if (losses.length === 0) return 100;
    
    // Calculate average gain and average loss
    const avgGain = gains.reduce((sum, gain) => sum + gain, 0) / period;
    const avgLoss = losses.reduce((sum, loss) => sum + loss, 0) / period;
    
    if (avgLoss === 0) return 100;
    
    // Calculate RS and RSI
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    
    return rsi;
  }

  // MACD calculation
  static calculateMACD(prices: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9): { 
    macd: number;
    signal: number;
    histogram: number;
  } {
    if (prices.length < Math.max(fastPeriod, slowPeriod, signalPeriod)) {
      throw new Error("Insufficient data for MACD calculation");
    }
    
    // Calculate fast and slow EMAs
    const fastEMA = this.calculateEMA(prices, fastPeriod);
    const slowEMA = this.calculateEMA(prices, slowPeriod);
    
    // Calculate MACD line
    const macdLine = fastEMA - slowEMA;
    
    // Calculate MACD prices for the signal calculation
    const macdPrices = [];
    for (let i = 0; i < prices.length - slowPeriod; i++) {
      const fastEMA = this.calculateEMA(prices.slice(0, slowPeriod + i), fastPeriod);
      const slowEMA = this.calculateEMA(prices.slice(0, slowPeriod + i), slowPeriod);
      macdPrices.push(fastEMA - slowEMA);
    }
    
    // Calculate signal line (9-day EMA of MACD)
    const signalLine = this.calculateEMA(macdPrices, signalPeriod);
    
    // Calculate histogram (MACD line - Signal line)
    const histogram = macdLine - signalLine;
    
    return {
      macd: macdLine,
      signal: signalLine,
      histogram: histogram
    };
  }

  // Bollinger Bands calculation
  static calculateBollingerBands(prices: number[], period: number = 20, standardDeviations: number = 2): {
    middle: number;
    upper: number;
    lower: number;
    bandwidth: number;
  } {
    if (prices.length < period) {
      throw new Error("Insufficient data for Bollinger Bands calculation");
    }
    
    // Middle band is SMA
    const middle = this.calculateMA(prices, period);
    
    // Calculate standard deviation
    const sum = prices.slice(-period).reduce((sum, price) => {
      return sum + Math.pow(price - middle, 2);
    }, 0);
    const std = Math.sqrt(sum / period);
    
    // Upper and lower bands
    const upper = middle + (standardDeviations * std);
    const lower = middle - (standardDeviations * std);
    
    // Bandwidth = (Upper - Lower) / Middle
    const bandwidth = (upper - lower) / middle;
    
    return { middle, upper, lower, bandwidth };
  }

  // Combined market trend analysis with multiple indicators
  static analyzeMarketTrend(data: MarketData[], windowSize: number = 10): MarketAnalysisResult {
    console.log(`Analyzing market trend with window size: ${windowSize}`);
    
    if (data.length < windowSize * 2) {
      return {
        error: `Need at least ${windowSize * 2} data points for trend analysis`,
        trend: "neutral",
        currentMA: 0,
        previousMA: 0,
        difference: 0,
        windowSize
      };
    }

    try {
      const prices = data.map(d => d.price);
      
      // Calculate moving averages
      const currentMA = this.calculateMA(prices, windowSize);
      const previousMA = this.calculateMA(prices.slice(0, -windowSize), windowSize);
      const difference = (currentMA - previousMA) / previousMA;
      
      // Calculate additional technical indicators
      let rsi = 0;
      let macdData = { macd: 0, signal: 0, histogram: 0 };
      let bollingerBands = { middle: 0, upper: 0, lower: 0, bandwidth: 0 };
      
      try {
        rsi = this.calculateRSI(prices);
        macdData = this.calculateMACD(prices);
        bollingerBands = this.calculateBollingerBands(prices);
      } catch (indicatorError) {
        console.warn("Could not calculate some indicators due to insufficient data");
      }
      
      // Determine trend using multiple indicators
      let trend: "rising" | "falling" | "neutral" = "neutral";
      let confidence = 0;
      let signals = 0;
      
      // Moving Average signal
      if (Math.abs(difference) < 0.01) {
        trend = "neutral";
        confidence += 0;
      } else {
        trend = difference > 0 ? "rising" : "falling";
        confidence += Math.min(Math.abs(difference) * 100, 30); // Cap at 30%
      }
      signals++;
      
      // RSI signal
      if (rsi > 0) {
        if (rsi > 70) {
          if (trend === "rising") confidence += 10;
          else confidence -= 10;
        } else if (rsi < 30) {
          if (trend === "falling") confidence += 10;
          else confidence -= 10;
        }
        signals++;
      }
      
      // MACD signal
      if (macdData.macd !== 0) {
        const macdTrend = macdData.histogram > 0 ? "rising" : "falling";
        if (macdTrend === trend) {
          confidence += 20;
        } else {
          confidence -= 20;
        }
        signals++;
      }
      
      // Bollinger Bands signal
      if (bollingerBands.middle !== 0) {
        const currentPrice = prices[prices.length - 1];
        if (currentPrice > bollingerBands.upper) {
          if (trend === "rising") confidence += 15;
          else confidence -= 15;
        } else if (currentPrice < bollingerBands.lower) {
          if (trend === "falling") confidence += 15;
          else confidence -= 15;
        }
        signals++;
      }
      
      // Normalize confidence
      confidence = confidence / signals;
      
      // Final trend determination
      if (confidence < 10) {
        trend = "neutral";
      } else {
        trend = confidence > 0 ? "rising" : "falling";
      }
      
      console.log(`Detected trend: ${trend} with confidence: ${Math.abs(confidence)}%`);

      return {
        trend,
        currentMA,
        previousMA,
        difference,
        windowSize,
        indicators: {
          rsi,
          macd: macdData,
          bollingerBands
        },
        confidence: Math.abs(confidence)
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Unknown error during analysis",
        trend: "neutral",
        currentMA: 0,
        previousMA: 0,
        difference: 0,
        windowSize
      };
    }
  }

  // Backtesting framework
  static backtestStrategy(
    historicalData: MarketData[], 
    strategy: (data: MarketData[], currentIndex: number) => "buy" | "sell" | "hold",
    initialCapital: number = 10000,
    feePercentage: number = 0.001
  ): {
    trades: Array<{ action: string; price: number; timestamp: number | Date; profit: number }>;
    finalCapital: number;
    totalReturn: number;
    winRate: number;
    maxDrawdown: number;
  } {
    if (historicalData.length < 10) {
      throw new Error("Insufficient historical data for backtesting");
    }
    
    let capital = initialCapital;
    let inPosition = false;
    let positionPrice = 0;
    let trades = [];
    let winningTrades = 0;
    let totalTrades = 0;
    let maxCapital = initialCapital;
    let maxDrawdown = 0;
    
    // Run through historical data
    for (let i = 10; i < historicalData.length; i++) {
      const currentData = historicalData.slice(0, i + 1);
      const action = strategy(currentData, i);
      const currentPrice = historicalData[i].price;
      
      // Process action
      if (action === "buy" && !inPosition) {
        // Buy position
        const fee = capital * feePercentage;
        const buyAmount = capital - fee;
        positionPrice = currentPrice;
        inPosition = true;
        capital -= fee;
        
        trades.push({
          action: "buy",
          price: currentPrice,
          timestamp: historicalData[i].timestamp || new Date(),
          profit: -fee
        });
      } 
      else if (action === "sell" && inPosition) {
        // Sell position
        const grossProfit = (currentPrice / positionPrice - 1) * capital;
        const fee = (capital + grossProfit) * feePercentage;
        const netProfit = grossProfit - fee;
        
        capital += netProfit;
        inPosition = false;
        
        if (netProfit > 0) winningTrades++;
        totalTrades++;
        
        trades.push({
          action: "sell",
          price: currentPrice,
          timestamp: historicalData[i].timestamp || new Date(),
          profit: netProfit
        });
        
        // Update maximum capital
        if (capital > maxCapital) {
          maxCapital = capital;
        }
        
        // Update maximum drawdown
        const drawdown = (maxCapital - capital) / maxCapital;
        if (drawdown > maxDrawdown) {
          maxDrawdown = drawdown;
        }
      }
    }
    
    // If still in position at the end, simulate selling at last price
    if (inPosition) {
      const currentPrice = historicalData[historicalData.length - 1].price;
      const grossProfit = (currentPrice / positionPrice - 1) * capital;
      const fee = (capital + grossProfit) * feePercentage;
      const netProfit = grossProfit - fee;
      
      capital += netProfit;
      
      if (netProfit > 0) winningTrades++;
      totalTrades++;
      
      trades.push({
        action: "sell (end)",
        price: currentPrice,
        timestamp: historicalData[historicalData.length - 1].timestamp || new Date(),
        profit: netProfit
      });
    }
    
    const totalReturn = (capital - initialCapital) / initialCapital * 100;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    
    return {
      trades,
      finalCapital: capital,
      totalReturn,
      winRate,
      maxDrawdown: maxDrawdown * 100
    };
  }

  // Analyze sentiment based on sentiment data
  static analyzeSentiment(
    sentimentData: Array<{ source: string; score: number; weight: number }>
  ): {
    overallSentiment: number;
    bullishSources: string[];
    bearishSources: string[];
    confidenceScore: number;
  } {
    if (!sentimentData || sentimentData.length === 0) {
      return {
        overallSentiment: 0,
        bullishSources: [],
        bearishSources: [],
        confidenceScore: 0
      };
    }
    
    let totalSentiment = 0;
    let totalWeight = 0;
    const bullishSources = [];
    const bearishSources = [];
    
    // Calculate weighted sentiment
    for (const item of sentimentData) {
      totalSentiment += item.score * item.weight;
      totalWeight += item.weight;
      
      if (item.score > 0.2) {
        bullishSources.push(item.source);
      } else if (item.score < -0.2) {
        bearishSources.push(item.source);
      }
    }
    
    const overallSentiment = totalWeight > 0 ? totalSentiment / totalWeight : 0;
    
    // Calculate confidence based on consensus and sample size
    const consensusScore = Math.abs(overallSentiment) * 50; // 0-50 based on sentiment strength
    const sampleSizeScore = Math.min(sentimentData.length / 10, 1) * 50; // 0-50 based on sample size
    const confidenceScore = consensusScore + sampleSizeScore;
    
    return {
      overallSentiment,
      bullishSources,
      bearishSources,
      confidenceScore
    };
  }
}
