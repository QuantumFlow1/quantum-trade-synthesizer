
import { BacktestResult, AgentAccuracy, TradingAgent } from "../types/portfolioTypes";
import { TradeAction } from "@/types/agent";

// Generate prediction history based on simulated backtesting
export const generateBacktestResults = (currentData: any, tradingAgents: TradingAgent[]): BacktestResult[] => {
  if (!currentData) return [];
  
  const ticker = currentData?.symbol || "BTC";
  const currentPrice = currentData?.price || 45000;
  const results: BacktestResult[] = [];
  
  // For each agent, generate some historical backtests
  tradingAgents.forEach(agent => {
    // Generate 10 historical predictions per agent
    for (let i = 0; i < 10; i++) {
      const daysAgo = i + 1;
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      // Simulated historical price (random variation from current)
      const historicalPrice = currentPrice * (1 + (Math.random() * 0.2 - 0.1));
      
      // Price 'later' after the prediction was made
      const priceLater = historicalPrice * (1 + (Math.random() * 0.3 - 0.15));
      
      // Determine actual outcome based on price difference
      const actualOutcome: TradeAction = priceLater > historicalPrice ? "BUY" : "SELL";
      
      // Simulate what the agent would have predicted
      const predictedAction: TradeAction = Math.random() > 0.4 ? actualOutcome : 
                                         (actualOutcome === "BUY" ? "SELL" : "BUY");
      
      // Determine if prediction was correct
      const isCorrect = predictedAction === actualOutcome;
      
      // Record the result
      results.push({
        agentId: agent.id,
        predictedAction,
        actualOutcome,
        isCorrect,
        date: date.toISOString(),
        confidence: Math.round(50 + Math.random() * 40),
        price: historicalPrice,
        priceLater
      });
    }
  });
  
  return results;
};

// Calculate agent accuracy metrics from backtest results
export const calculateAgentAccuracy = (backtests: BacktestResult[]): Record<string, AgentAccuracy> => {
  const accuracy: Record<string, AgentAccuracy> = {};
  
  // Group by agent
  const agentGroups = backtests.reduce((groups, test) => {
    if (!groups[test.agentId]) {
      groups[test.agentId] = [];
    }
    groups[test.agentId].push(test);
    return groups;
  }, {} as Record<string, BacktestResult[]>);
  
  // Calculate metrics for each agent
  Object.entries(agentGroups).forEach(([agentId, tests]) => {
    // Sort by date (newest first)
    const sortedTests = [...tests].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Calculate overall accuracy
    const correctCount = tests.filter(t => t.isCorrect).length;
    const overall = Math.round((correctCount / tests.length) * 100);
    
    // Calculate recent accuracy (last 5 tests)
    const recentTests = sortedTests.slice(0, 5);
    const recentCorrect = recentTests.filter(t => t.isCorrect).length;
    const recent = Math.round((recentCorrect / recentTests.length) * 100);
    
    // Generate confidence interval (overall ± 5-15%)
    const variability = Math.round(Math.random() * 10) + 5;
    const lowerBound = Math.max(0, overall - variability);
    const upperBound = Math.min(100, overall + variability);
    
    // Create prediction history
    const predictionHistory = sortedTests.map(test => ({
      correct: test.isCorrect,
      date: test.date,
      prediction: test.predictedAction
    }));
    
    accuracy[agentId] = {
      overall,
      recent,
      confidence: [lowerBound, upperBound] as [number, number],
      predictionHistory
    };
  });
  
  return accuracy;
};
