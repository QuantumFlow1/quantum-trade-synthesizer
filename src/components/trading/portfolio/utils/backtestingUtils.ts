
// Generate simulated backtesting results for agents
export const generateBacktestResults = (
  currentData: any,
  tradingAgents: any[]
) => {
  const backtestResults = [];
  const ticker = currentData?.symbol || "BTC";
  const currentPrice = currentData?.price || 45000;
  
  // Create some simulated dates for backtest (last 10 days)
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
    
    for (const date of dates) {
      // Generate a simulated prediction and outcome
      const confidence = Math.floor(60 + Math.random() * 35);
      
      // Action prediction for this historical date
      let predictedAction: string;
      const actionRoll = Math.random();
      
      if (actionRoll > 0.65) {
        predictedAction = "BUY";
      } else if (actionRoll > 0.3) {
        predictedAction = "HOLD";
      } else {
        predictedAction = "SELL";
      }
      
      // Randomly determine if the prediction was correct (weighted by agent's quality)
      const accuracyRoll = Math.random();
      const isCorrect = accuracyRoll < baseAccuracy;
      
      // Add to results
      backtestResults.push({
        agentId: agent.id,
        date,
        predictedAction,
        actualOutcome: isCorrect ? predictedAction : (predictedAction === "BUY" ? "SELL" : "BUY"), 
        isCorrect,
        confidence,
        price: Math.round(currentPrice * (0.9 + Math.random() * 0.2)), // Random price within ±10%
        priceLater: Math.round(currentPrice * (0.85 + Math.random() * 0.3)) // Random price within wider range
      });
    }
  }
  
  return backtestResults;
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
      date: result.date
    }));
    
    accuracy[agentId] = {
      overall: overallAccuracy,
      recent: recentAccuracy,
      confidence: [lowerConfidence, upperConfidence],
      sampleSize: totalPredictions,
      predictionHistory
    };
  }
  
  return accuracy;
};
