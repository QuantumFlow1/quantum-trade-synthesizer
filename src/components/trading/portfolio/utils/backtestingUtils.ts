
// Generate simulated backtesting results for agents
export const generateBacktestResults = (
  currentData: any,
  tradingAgents: any[],
  realMarketData?: any[]
) => {
  const backtestResults = [];
  const ticker = currentData?.symbol || "BTC";
  const currentPrice = currentData?.price || 45000;
  
  // Use real market data if available
  const useRealData = !!realMarketData && Array.isArray(realMarketData) && realMarketData.length > 0;
  console.log(`Backtesting with ${useRealData ? 'real' : 'simulated'} market data for ${ticker}`);
  
  // Create some dates for backtest (last 10 days)
  const dates = [];
  for (let i = 10; i > 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString());
  }
  
  // For each agent, generate backtesting results
  for (const agent of tradingAgents) {
    // Simulate agent accuracy based on its weight/quality
    const baseAccuracy = 0.5 + (agent.weight * 0.3);
    
    // Map dates to data points if using real data
    const dataPoints = useRealData 
      ? mapDatesToPriceData(dates, realMarketData)
      : generateSimulatedPriceData(dates, currentPrice);
    
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const dataPoint = dataPoints[i];
      
      // Generate a simulated prediction and outcome
      const confidence = Math.floor(60 + Math.random() * 35);
      
      // Action prediction for this historical date
      let predictedAction: string;
      
      if (useRealData && dataPoint.predictedDirection) {
        // Use trend direction from real data to influence prediction
        const actionRoll = Math.random();
        predictedAction = dataPoint.predictedDirection === 'up' 
          ? (actionRoll > 0.3 ? "BUY" : (actionRoll > 0.1 ? "HOLD" : "SELL"))
          : (actionRoll > 0.3 ? "SELL" : (actionRoll > 0.1 ? "HOLD" : "BUY"));
      } else {
        // Fallback to random prediction if no real data trend
        const actionRoll = Math.random();
        predictedAction = actionRoll > 0.65 ? "BUY" : (actionRoll > 0.3 ? "HOLD" : "SELL");
      }
      
      // Determine if the prediction was correct based on agent quality and data
      const accuracyRoll = Math.random();
      const dataBasedCorrectness = useRealData 
        ? evaluatePredictionWithRealData(predictedAction, dataPoint) 
        : null;
      
      // Use data-based evaluation if available, otherwise use random with weight
      const isCorrect = dataBasedCorrectness !== null 
        ? dataBasedCorrectness 
        : (accuracyRoll < baseAccuracy);
      
      // Add to results
      backtestResults.push({
        agentId: agent.id,
        date,
        predictedAction,
        actualOutcome: isCorrect ? predictedAction : (predictedAction === "BUY" ? "SELL" : "BUY"), 
        isCorrect,
        confidence,
        price: dataPoint.price,
        priceLater: dataPoint.nextPrice
      });
    }
  }
  
  return backtestResults;
};

// Map real dates to price data points
const mapDatesToPriceData = (dates: string[], marketData: any[]) => {
  // Since we may not have exact date matches, we'll create an approximation
  return dates.map((date, index) => {
    const dateObj = new Date(date);
    
    // Find the closest data point, or use random if no good match
    let matchingData = marketData.find(item => 
      isSameDay(new Date(item.lastUpdated || item.timestamp), dateObj)
    );
    
    if (!matchingData && marketData.length > 0) {
      // Take a random data point if no date match
      matchingData = marketData[Math.floor(Math.random() * marketData.length)];
    }
    
    // Get next price (for later comparison)
    const nextPrice = index < dates.length - 1
      ? marketData.find(item => isSameDay(new Date(item.lastUpdated || item.timestamp), new Date(dates[index + 1])))?.price
      : null;
    
    // If we have real data
    if (matchingData) {
      // Determine trend direction
      const predictedDirection = matchingData.change24h >= 0 ? 'up' : 'down';
      
      return {
        price: matchingData.price || matchingData.close || 45000,
        nextPrice: nextPrice || matchingData.price * (1 + (Math.random() * 0.1 - 0.05)),
        predictedDirection,
        volume: matchingData.volume || matchingData.totalVolume24h || 1000000,
        change: matchingData.change24h || 0
      };
    }
    
    // Fallback to simulated data
    return generateSimulatedPricePoint(45000);
  });
};

// Helper to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// Generate simulated price data for dates
const generateSimulatedPriceData = (dates: string[], basePrice: number) => {
  let currentPrice = basePrice;
  
  return dates.map((date, index) => {
    // Random walk for price
    const priceChange = currentPrice * (Math.random() * 0.06 - 0.03);
    const price = currentPrice + priceChange;
    
    // Get next price or simulate one
    const nextPrice = index < dates.length - 1
      ? price * (1 + (Math.random() * 0.06 - 0.03))
      : price * (1 + (Math.random() * 0.04 - 0.02));
    
    // Update current price for next iteration
    currentPrice = price;
    
    // Calculate other metrics
    const predictedDirection = priceChange >= 0 ? 'up' : 'down';
    
    return {
      price,
      nextPrice,
      predictedDirection,
      volume: 1000000 + Math.random() * 2000000,
      change: (priceChange / currentPrice) * 100
    };
  });
};

// Generate a simulated price data point
const generateSimulatedPricePoint = (basePrice: number) => {
  const price = basePrice * (0.9 + Math.random() * 0.2);
  const nextPrice = price * (0.95 + Math.random() * 0.1);
  const priceChange = nextPrice - price;
  
  return {
    price,
    nextPrice,
    predictedDirection: priceChange >= 0 ? 'up' : 'down',
    volume: 1000000 + Math.random() * 2000000,
    change: (priceChange / price) * 100
  };
};

// Evaluate a prediction based on real data
const evaluatePredictionWithRealData = (
  prediction: string, 
  dataPoint: { price: number; nextPrice: number; predictedDirection: string }
): boolean | null => {
  // If we don't have price data, we can't evaluate
  if (!dataPoint.price || !dataPoint.nextPrice) return null;
  
  // Calculate price change and direction
  const priceChange = dataPoint.nextPrice - dataPoint.price;
  const actualDirection = priceChange > 0 ? 'up' : (priceChange < 0 ? 'down' : 'flat');
  
  // Evaluate based on prediction type
  switch (prediction) {
    case "BUY":
      return actualDirection === 'up';
    case "SELL":
      return actualDirection === 'down';
    case "HOLD":
      return Math.abs(priceChange / dataPoint.price) < 0.01; // Less than 1% change is good for HOLD
    default:
      return null;
  }
};

// Calculate agent accuracy metrics from backtest results
export const calculateAgentAccuracy = (backtestResults: any[]) => {
  const accuracy: Record<string, any> = {};
  
  // Group results by agent
  const resultsByAgent: Record<string, any[]> = {};
  
  for (const result of backtestResults) {
    if (!resultsByAgent[result.agentId]) {
      resultsByAgent[result.agentId] = [];
    }
    resultsByAgent[result.agentId].push(result);
  }
  
  // Calculate accuracy metrics for each agent
  for (const agentId in resultsByAgent) {
    const agentResults = resultsByAgent[agentId];
    const totalPredictions = agentResults.length;
    
    if (totalPredictions === 0) continue;
    
    // Calculate overall accuracy
    const correctPredictions = agentResults.filter(r => r.isCorrect).length;
    const overallAccuracy = Math.round((correctPredictions / totalPredictions) * 100);
    
    // Calculate recent accuracy (last 5 predictions)
    const recentResults = agentResults.slice(-5);
    const recentCorrect = recentResults.filter(r => r.isCorrect).length;
    const recentAccuracy = Math.round((recentCorrect / recentResults.length) * 100);
    
    // Calculate confidence interval
    const confidenceMargin = Math.round(15 + Math.random() * 10); // Random margin 15-25%
    const lowerConfidence = Math.max(0, overallAccuracy - confidenceMargin);
    const upperConfidence = Math.min(100, overallAccuracy + confidenceMargin);
    
    // Generate a prediction history for display
    const predictionHistory = agentResults.slice(-7).map(result => ({
      prediction: result.predictedAction,
      correct: result.isCorrect,
      date: result.date,
      price: result.price,
      priceLater: result.priceLater
    }));
    
    // Calculate profit/loss based on historical predictions
    const profitLoss = calculateProfitLoss(agentResults);
    
    accuracy[agentId] = {
      overall: overallAccuracy,
      recent: recentAccuracy,
      confidence: [lowerConfidence, upperConfidence],
      sampleSize: totalPredictions,
      predictionHistory,
      profitLoss
    };
  }
  
  return accuracy;
};

// Calculate simulated profit/loss based on predictions
const calculateProfitLoss = (predictions: any[]) => {
  let balance = 1000; // Starting with $1000
  let holdings = 0;
  let entryPrice = 0;
  
  const balanceHistory = [{ date: new Date().toISOString(), balance }];
  
  // Sort predictions by date
  const sortedPredictions = [...predictions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  for (const prediction of sortedPredictions) {
    const price = prediction.price;
    
    if (prediction.predictedAction === "BUY" && balance > 0) {
      // Buy with all available balance
      holdings = balance / price;
      entryPrice = price;
      balance = 0;
    } 
    else if (prediction.predictedAction === "SELL" && holdings > 0) {
      // Sell all holdings
      balance = holdings * price;
      holdings = 0;
    }
    
    // Calculate current total value (balance + holdings)
    const totalValue = balance + (holdings * price);
    
    // Add to history
    balanceHistory.push({
      date: prediction.date,
      balance: totalValue,
      action: prediction.predictedAction,
      price
    });
  }
  
  // Calculate final P&L metrics
  const initialBalance = balanceHistory[0].balance;
  const finalBalance = balanceHistory[balanceHistory.length - 1].balance;
  const absoluteReturn = finalBalance - initialBalance;
  const percentReturn = ((finalBalance / initialBalance) - 1) * 100;
  
  return {
    initialBalance,
    finalBalance,
    absoluteReturn,
    percentReturn: Math.round(percentReturn * 100) / 100,
    balanceHistory
  };
};
