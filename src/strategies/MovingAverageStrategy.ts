
import { Strategy, MarketData, TradeSetup } from '@/types/trading';

export class MovingAverageStrategy implements Strategy {
  private shortPeriod: number;
  private longPeriod: number;

  constructor(shortPeriod: number = 10, longPeriod: number = 20) {
    this.shortPeriod = shortPeriod;
    this.longPeriod = longPeriod;
  }

  private calculateMA(data: MarketData[], period: number): number[] {
    const ma: number[] = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data
        .slice(i - period + 1, i + 1)
        .reduce((acc, candle) => acc + candle.close, 0);
      ma.push(sum / period);
    }
    return ma;
  }

  async analyze(data: MarketData[]): Promise<TradeSetup[]> {
    if (data.length < this.longPeriod) {
      return [];
    }

    const shortMA = this.calculateMA(data, this.shortPeriod);
    const longMA = this.calculateMA(data, this.longPeriod);

    const setups: TradeSetup[] = [];
    const lastShortMA = shortMA[shortMA.length - 1];
    const lastLongMA = longMA[longMA.length - 1];
    const prevShortMA = shortMA[shortMA.length - 2];
    const prevLongMA = longMA[longMA.length - 2];

    // Crossing detection
    if (prevShortMA <= prevLongMA && lastShortMA > lastLongMA) {
      setups.push({
        type: 'long',
        entry: data[data.length - 1].close,
        stopLoss: Math.min(...data.slice(-5).map(d => d.low)),
        takeProfit: data[data.length - 1].close * 1.02, // 2% target
        confidence: 0.6,
        strategy: 'MovingAverage',
        timestamp: data[data.length - 1].timestamp
      });
    } else if (prevShortMA >= prevLongMA && lastShortMA < lastLongMA) {
      setups.push({
        type: 'short',
        entry: data[data.length - 1].close,
        stopLoss: Math.max(...data.slice(-5).map(d => d.high)),
        takeProfit: data[data.length - 1].close * 0.98, // 2% target
        confidence: 0.6,
        strategy: 'MovingAverage',
        timestamp: data[data.length - 1].timestamp
      });
    }

    return setups;
  }
}

