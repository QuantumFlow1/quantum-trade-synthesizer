
import { 
  MarketData, 
  Strategy, 
  BacktestConfig, 
  BacktestResults, 
  TradeResult, 
  TradeSetup 
} from '@/types/trading';

export class BacktestEngine {
  private strategies: Strategy[];
  private historicalData: MarketData[];
  private results: TradeResult[];

  constructor(strategies: Strategy[]) {
    this.strategies = strategies;
    this.historicalData = [];
    this.results = [];
  }

  setHistoricalData(data: MarketData[]) {
    this.historicalData = data;
  }

  private calculateMaxDrawdown(equityCurve: number[]): number {
    let maxDrawdown = 0;
    let peak = equityCurve[0];
    
    for (const value of equityCurve) {
      if (value > peak) peak = value;
      const drawdown = (peak - value) / peak;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }
    
    return maxDrawdown;
  }

  private calculateSharpeRatio(returns: number[]): number {
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length
    );
    return stdDev === 0 ? 0 : (meanReturn / stdDev) * Math.sqrt(252); // Annualized
  }

  private simulateTrade(setup: TradeSetup, dataIndex: number): TradeResult {
    const entryPrice = this.historicalData[dataIndex].close;
    let exitPrice = entryPrice;
    let exitIndex = dataIndex;

    // Simulate trade execution
    for (let i = dataIndex + 1; i < this.historicalData.length; i++) {
      const currentPrice = this.historicalData[i];
      
      if (setup.type === 'long') {
        if (currentPrice.low <= setup.stopLoss) {
          exitPrice = setup.stopLoss;
          exitIndex = i;
          break;
        }
        if (currentPrice.high >= setup.takeProfit) {
          exitPrice = setup.takeProfit;
          exitIndex = i;
          break;
        }
      } else {
        if (currentPrice.high >= setup.stopLoss) {
          exitPrice = setup.stopLoss;
          exitIndex = i;
          break;
        }
        if (currentPrice.low <= setup.takeProfit) {
          exitPrice = setup.takeProfit;
          exitIndex = i;
          break;
        }
      }
    }

    const pnl = setup.type === 'long' 
      ? exitPrice - entryPrice 
      : entryPrice - exitPrice;

    return {
      entry: entryPrice,
      exit: exitPrice,
      pnl,
      type: setup.type,
      timestamp: this.historicalData[exitIndex].timestamp,
      strategy: setup.strategy
    };
  }

  private rankSetups(setups: TradeSetup[]): TradeSetup | null {
    if (setups.length === 0) return null;
    
    return setups.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );
  }

  async runBacktest(config: BacktestConfig): Promise<BacktestResults> {
    console.log('Starting backtest with config:', config);
    const results: TradeResult[] = [];
    let equity = config.initialCapital;
    const equityCurve: number[] = [equity];
    
    for (let i = config.warmup; i < this.historicalData.length; i++) {
      const windowData = this.historicalData.slice(i - config.warmup, i);
      
      try {
        // Parallel strategy analysis
        const setupPromises = this.strategies.map(strategy => 
          strategy.analyze(windowData)
        );
        
        const allSetups = await Promise.all(setupPromises);
        const bestSetup = this.rankSetups(allSetups.flat());

        if (bestSetup) {
          const tradeResult = this.simulateTrade(bestSetup, i);
          results.push(tradeResult);
          equity += tradeResult.pnl * config.initialCapital * config.riskPerTrade;
          equityCurve.push(equity);
        }
      } catch (error) {
        console.error('Error during backtest at index', i, error);
      }
    }

    const returns = equityCurve.map((eq, i) => 
      i === 0 ? 0 : (eq - equityCurve[i-1]) / equityCurve[i-1]
    );

    return {
      totalTrades: results.length,
      winRate: results.filter(r => r.pnl > 0).length / results.length || 0,
      profitFactor: Math.abs(
        results.reduce((sum, r) => r.pnl > 0 ? sum + r.pnl : sum, 0) /
        results.reduce((sum, r) => r.pnl < 0 ? sum + Math.abs(r.pnl) : sum, 0) || 1
      ),
      maxDrawdown: this.calculateMaxDrawdown(equityCurve),
      sharpeRatio: this.calculateSharpeRatio(returns),
      trades: results
    };
  }
}

