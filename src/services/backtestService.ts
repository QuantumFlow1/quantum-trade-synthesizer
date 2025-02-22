
import { BacktestConfig, MarketData, TradeResult, TradeSetup, Strategy } from '@/types/trading';

export class BacktestEngine {
  private config: BacktestConfig;
  private strategy: Strategy;
  private capital: number;
  private trades: TradeResult[];
  private currentPrice: number = 0;

  constructor(strategy: Strategy, config: BacktestConfig) {
    this.strategy = strategy;
    this.config = config;
    this.capital = config.initialCapital;
    this.trades = [];
  }

  private calculatePosition(setup: TradeSetup): number {
    const riskAmount = this.capital * this.config.riskPerTrade;
    const stopDistance = Math.abs(setup.entry - setup.stopLoss);
    return riskAmount / stopDistance;
  }

  private updateCapital(trade: TradeResult) {
    this.capital += trade.pnl;
  }

  private calculateMetrics(): { winRate: number; profitFactor: number; maxDrawdown: number; sharpeRatio: number } {
    const wins = this.trades.filter(t => t.pnl > 0).length;
    const winRate = (wins / this.trades.length) * 100;

    const profits = this.trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
    const losses = Math.abs(this.trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));
    const profitFactor = profits / (losses || 1);

    let maxDrawdown = 0;
    let peak = this.config.initialCapital;
    let runningCapital = this.config.initialCapital;

    for (const trade of this.trades) {
      runningCapital += trade.pnl;
      if (runningCapital > peak) {
        peak = runningCapital;
      }
      const drawdown = (peak - runningCapital) / peak * 100;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    // Calculate Sharpe Ratio (simplified)
    const returns = this.trades.map(t => t.pnl / this.config.initialCapital);
    const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / returns.length);
    const sharpeRatio = meanReturn / stdDev;

    return { winRate, profitFactor, maxDrawdown, sharpeRatio };
  }

  async run(data: MarketData[]): Promise<{
    trades: TradeResult[];
    finalCapital: number;
    metrics: {
      winRate: number;
      profitFactor: number;
      maxDrawdown: number;
      sharpeRatio: number;
    };
  }> {
    const warmupData = data.slice(0, this.config.warmup);
    const testData = data.slice(this.config.warmup);

    // Train strategy if supported
    if (this.strategy.train) {
      await this.strategy.train(warmupData);
    }

    for (let i = 0; i < testData.length; i++) {
      const currentBar = testData[i];
      this.currentPrice = currentBar.close;

      const setup = await this.strategy.analyze(testData.slice(0, i + 1));
      
      if (setup.length > 0) {
        for (const s of setup) {
          const position = this.calculatePosition(s);
          const exit = s.type === 'long' ? s.stopLoss : s.takeProfit;
          const pnl = (exit - s.entry) * position * (s.type === 'long' ? 1 : -1);

          const trade: TradeResult = {
            entry: s.entry,
            exit,
            pnl,
            type: s.type,
            timestamp: currentBar.timestamp,
            strategy: s.strategy
          };

          this.trades.push(trade);
          this.updateCapital(trade);
        }
      }
    }

    const metrics = this.calculateMetrics();

    return {
      trades: this.trades,
      finalCapital: this.capital,
      metrics
    };
  }
}
