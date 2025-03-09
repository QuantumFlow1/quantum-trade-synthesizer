import { TradingAgent } from "../types/portfolioTypes";

interface PriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradeHistoryItem {
  date: string;
  balance: number;
  action?: "BUY" | "SELL" | "HOLD"; // Make action optional since it wasn't in the original type
}

interface BacktestResult {
  agentId: string;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  profit: number;
  roi: number;
  tradeHistory: TradeHistoryItem[];
}

// Function to generate random trade history for testing
const generateRandomTradeHistory = (initialBalance: number, days: number) => {
  let balance = initialBalance;
  const history = [];
  const startDate = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0];

    const randomChange = (Math.random() - 0.5) * 0.02; // Random change between -2% and 2%
    balance += balance * randomChange;
    history.push({ date: formattedDate, balance: balance });
  }

  return history;
};

// Simulate a trading strategy for a given agent
const simulateTradingStrategy = (
  agent: TradingAgent,
  priceData: PriceData[],
  initialBalance: number = 10000
): BacktestResult => {
  let balance = initialBalance;
  let shares = 0;
  let totalTrades = 0;
  let winningTrades = 0;
  let losingTrades = 0;
  const tradeHistory: TradeHistoryItem[] = [];

  priceData.forEach((data, index) => {
    if (index === 0) return; // Skip the first day

    const previousData = priceData[index - 1];
    const priceChange = (data.close - previousData.close) / previousData.close;

    // Simulate a simple strategy: buy if price increased, sell if decreased
    if (priceChange > 0.01 && balance > 0) {
      // Buy if price increased more than 1%
      const affordableShares = Math.floor(balance / data.close);
      if (affordableShares > 0) {
        const sharesToBuy = Math.min(affordableShares, 10); // Buy up to 10 shares
        shares += sharesToBuy;
        balance -= sharesToBuy * data.close;
        totalTrades++;
        tradeHistory.push({ date: data.date, balance: balance });
      }
    } else if (priceChange < -0.01 && shares > 0) {
      // Sell if price decreased more than 1%
      balance += shares * data.close;
      shares = 0;
      totalTrades++;
      tradeHistory.push({ date: data.date, balance: balance });
    }
  });

  // Calculate profit, ROI, and win/loss stats
  const finalBalance = balance + (shares * priceData[priceData.length - 1].close);
  const profit = finalBalance - initialBalance;
  const roi = (profit / initialBalance) * 100;

  tradeHistory.forEach((trade, index) => {
    if (index > 0) {
      if (trade.balance > tradeHistory[index - 1].balance) {
        winningTrades++;
      } else {
        losingTrades++;
      }
    }
  });

  return {
    agentId: agent.id,
    totalTrades,
    winningTrades,
    losingTrades,
    profit,
    roi,
    tradeHistory
  };
};

// Generate backtest results for all agents
export const generateBacktestResults = (
  currentData: any,
  agents: TradingAgent[],
  realMarketData?: any[] // Optional real market data
): BacktestResult[] => {
  // Use real market data if available, otherwise generate synthetic data
  const priceData: PriceData[] = realMarketData && realMarketData.length > 0
    ? realMarketData.map((item: any) => ({
        date: item.date,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume
      }))
    : generateSyntheticPriceData(currentData.price, 60); // Generate 60 days of data

  return agents.map(agent => simulateTradingStrategy(agent, priceData));
};

// Generate synthetic price data for testing
const generateSyntheticPriceData = (
  currentPrice: number,
  days: number
): PriceData[] => {
  const priceData: PriceData[] = [];
  const startDate = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0];

    // Simulate price fluctuations
    const priceChange = (Math.random() - 0.5) * 0.05; // Random change between -5% and 5%
    currentPrice += currentPrice * priceChange;

    // Ensure prices are positive
    currentPrice = Math.max(10, currentPrice);

    // Create a price data point
    const dataPoint: PriceData = {
      date: formattedDate,
      open: currentPrice * (1 + (Math.random() - 0.5) * 0.01),
      high: currentPrice * (1 + Math.random() * 0.02),
      low: currentPrice * (1 - Math.random() * 0.02),
      close: currentPrice,
      volume: Math.floor(Math.random() * 10000)
    };

    priceData.push(dataPoint);
  }

  return priceData;
};

// Calculate agent accuracy based on backtest results
export const calculateAgentAccuracy = (backtestResults: BacktestResult[]) => {
  const accuracyMetrics: { [agentId: string]: { overall: number; recent: number; confidence: [number, number]; predictionHistory?: Array<{correct: boolean, date: string, prediction: string}> } } = {};

  backtestResults.forEach(result => {
    const { agentId, totalTrades, winningTrades } = result;
    const overallAccuracy = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const recentAccuracy = totalTrades > 5 ? (winningTrades / totalTrades) * 100 : overallAccuracy;
    const confidenceInterval: [number, number] = [overallAccuracy - 5, overallAccuracy + 5]; // Example interval

    accuracyMetrics[agentId] = {
      overall: overallAccuracy,
      recent: recentAccuracy,
      confidence: confidenceInterval,
      predictionHistory: result.tradeHistory.map(trade => ({
        correct: trade.balance > 0,
        date: trade.date,
        prediction: trade.action || "HOLD"
      }))
    };
  });

  return accuracyMetrics;
};
