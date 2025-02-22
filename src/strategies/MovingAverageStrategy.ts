
import { Strategy, MarketData, TradeSetup } from '@/types/trading';

export class MovingAverageStrategy implements Strategy {
  private shortPeriod: number;
  private longPeriod: number;
  private lastSignal?: 'long' | 'short';

  constructor(shortPeriod: number = 10, longPeriod: number = 20) {
    this.shortPeriod = shortPeriod;
    this.longPeriod = longPeriod;
  }

  private calculateSMA(data: MarketData[], period: number): number {
    const prices = data.slice(-period).map(d => d.close);
    return prices.reduce((sum, price) => sum + price, 0) / period;
  }

  async analyze(data: MarketData[]): Promise<TradeSetup[]> {
    if (data.length < this.longPeriod) {
      return [];
    }

    const shortSMA = this.calculateSMA(data, this.shortPeriod);
    const longSMA = this.calculateSMA(data, this.longPeriod);
    const currentPrice = data[data.length - 1].close;

    const setups: TradeSetup[] = [];

    // Generate trade setup on crossover
    if (shortSMA > longSMA && this.lastSignal !== 'long') {
      this.lastSignal = 'long';
      setups.push({
        type: 'long',
        entry: currentPrice,
        stopLoss: Math.min(...data.slice(-5).map(d => d.low)),
        takeProfit: currentPrice + (currentPrice - Math.min(...data.slice(-5).map(d => d.low))) * 2,
        confidence: 70,
        strategy: 'MovingAverage',
        timestamp: data[data.length - 1].timestamp
      });
    } else if (shortSMA < longSMA && this.lastSignal !== 'short') {
      this.lastSignal = 'short';
      setups.push({
        type: 'short',
        entry: currentPrice,
        stopLoss: Math.max(...data.slice(-5).map(d => d.high)),
        takeProfit: currentPrice - (Math.max(...data.slice(-5).map(d => d.high)) - currentPrice) * 2,
        confidence: 70,
        strategy: 'MovingAverage',
        timestamp: data[data.length - 1].timestamp
      });
    }

    return setups;
  }
}
