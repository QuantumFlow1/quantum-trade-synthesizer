
// Generate simulated agent recommendations
export const generateAgentRecommendations = (
  currentData: any,
  tradingAgents: any[],
  accuracyMetrics: Record<string, any> = {}
) => {
  if (!currentData) return [];
  
  const recommendations = [];
  const ticker = currentData?.symbol || "BTC";
  const currentPrice = currentData?.price || 45000;
  
  for (const agent of tradingAgents) {
    // Use agent's accuracy metrics if available, otherwise use defaults
    const agentAccuracy = accuracyMetrics[agent.id] || { 
      overall: 60,
      recent: 55,
      confidence: [40, 80]
    };
    
    // Bias the random seed based on:
    // 1. Current market data (trend)
    // 2. Agent's specialization
    // 3. Small random factor
    const marketTrend = currentData?.trend || 0; // -1 to 1 range
    const specialBias = getSpecializationBias(agent.specialization, currentData);
    const randomFactor = Math.random() * 0.3 - 0.15; // Small random adjustment (-0.15 to 0.15)
    
    // Combine all factors, weighted appropriately
    const biasedSeed = 0.5 + (marketTrend * 0.2) + (specialBias * 0.3) + randomFactor;
    
    // Make decisions based on biased seed
    let action, confidence, reasoning;
    
    // Decision logic based on agent specialization
    switch(agent.specialization) {
      case "fundamental":
        // Value investors generally prefer buying undervalued assets
        action = biasedSeed > 0.6 ? "BUY" : (biasedSeed > 0.4 ? "HOLD" : "SELL");
        confidence = Math.round(70 + (biasedSeed * 20));
        reasoning = `Based on fundamental analysis, the current ${ticker} price at $${currentPrice} ${biasedSeed > 0.55 ? "represents a good value" : "appears slightly overvalued"}.`;
        break;
        
      case "technical":
        // Technical analysts look for patterns and momentum
        action = biasedSeed > 0.65 ? "BUY" : (biasedSeed > 0.35 ? "HOLD" : "SELL");
        confidence = Math.round(65 + (biasedSeed * 25));
        
        if (biasedSeed > 0.65) {
          reasoning = `Technical indicators show a bullish pattern with strong support at $${Math.floor(currentPrice * 0.95)}.`;
        } else if (biasedSeed < 0.35) {
          reasoning = `Technical indicators show a bearish pattern with resistance at $${Math.floor(currentPrice * 1.05)}.`;
        } else {
          reasoning = `${ticker} is consolidating between support at $${Math.floor(currentPrice * 0.95)} and resistance at $${Math.floor(currentPrice * 1.05)}.`;
        }
        break;
        
      case "sentiment":
        // Sentiment analysts are more influenced by market sentiment and volatility
        action = biasedSeed > 0.7 ? "BUY" : (biasedSeed > 0.3 ? "HOLD" : "SELL");
        confidence = Math.round(60 + (biasedSeed * 30));
        
        if (biasedSeed > 0.7) {
          reasoning = `Market sentiment for ${ticker} is bullish with increasing social media mentions.`;
        } else if (biasedSeed < 0.3) {
          reasoning = `Market sentiment for ${ticker} is bearish with negative social media trends.`;
        } else {
          reasoning = `Market sentiment for ${ticker} is mixed with neutral engagement metrics.`;
        }
        break;
        
      case "risk":
        // Risk managers are more conservative
        action = biasedSeed > 0.75 ? "BUY" : (biasedSeed > 0.4 ? "HOLD" : "SELL");
        confidence = Math.round(75 + (biasedSeed * 15)); // Generally higher confidence
        
        if (biasedSeed > 0.75) {
          reasoning = `Risk assessment indicates favorable conditions for ${ticker} with manageable downside.`;
        } else if (biasedSeed < 0.4) {
          reasoning = `Risk assessment shows elevated risk levels for ${ticker}; recommend reducing exposure.`;
        } else {
          reasoning = `Risk levels for ${ticker} are within acceptable parameters; maintain current position.`;
        }
        break;
        
      case "volatility":
        // Volatility experts focus on market fluctuations
        action = biasedSeed > 0.6 ? "BUY" : (biasedSeed > 0.45 ? "HOLD" : "SELL");
        confidence = Math.round(65 + (biasedSeed * 25));
        
        if (biasedSeed > 0.6) {
          reasoning = `Volatility patterns suggest a potential upward movement for ${ticker} in the near term.`;
        } else if (biasedSeed < 0.45) {
          reasoning = `Volatility metrics indicate increased downside risk for ${ticker} at current levels.`;
        } else {
          reasoning = `Volatility for ${ticker} is expected to remain stable in the short term.`;
        }
        break;
        
      case "macro":
        // Macro economists look at broader economic indicators
        action = biasedSeed > 0.55 ? "BUY" : (biasedSeed > 0.45 ? "HOLD" : "SELL");
        confidence = Math.round(70 + (biasedSeed * 20));
        
        if (biasedSeed > 0.55) {
          reasoning = `Macroeconomic conditions favor ${ticker} with positive market correlations.`;
        } else if (biasedSeed < 0.45) {
          reasoning = `Macroeconomic indicators suggest caution for ${ticker} due to market headwinds.`;
        } else {
          reasoning = `Macroeconomic environment is neutral for ${ticker} with mixed signals.`;
        }
        break;
        
      default:
        action = biasedSeed > 0.5 ? "BUY" : "SELL";
        confidence = Math.round(60 + (biasedSeed * 30));
        reasoning = `Analysis of ${ticker} at $${currentPrice} suggests a ${action} recommendation.`;
    }
    
    // Factor in the agent's historical accuracy
    if (agentAccuracy.overall < 50 && Math.random() > 0.7) {
      // For agents with poor track records, occasionally flip their recommendation
      action = action === "BUY" ? "SELL" : (action === "SELL" ? "BUY" : "HOLD");
      reasoning += " However, my recent predictions have been inconsistent.";
    }
    
    recommendations.push({
      agentId: agent.id,
      action,
      confidence,
      reasoning,
      timestamp: new Date().toISOString()
    });
  }
  
  return recommendations;
};

// Helper function to determine specialization bias based on market data
function getSpecializationBias(specialization: string, marketData: any): number {
  if (!marketData) return 0;
  
  const trend = marketData.trend || 0;
  const volatility = marketData.volatility || 0.5;
  const volume = marketData.volume || 0.5;
  
  switch (specialization) {
    case "fundamental":
      // Value investors may see opportunity in downtrends if the asset is undervalued
      return trend < 0 ? 0.1 : (trend > 0 ? 0.2 : 0);
      
    case "technical":
      // Technical analysts follow momentum
      return trend * 0.3;
      
    case "sentiment":
      // Sentiment analysts are more sensitive to trend changes
      return trend * 0.4;
      
    case "risk":
      // Risk managers prefer stability and are cautious in volatile markets
      return -volatility * 0.4;
      
    case "volatility":
      // Volatility experts may see opportunity in volatility
      return (volatility - 0.5) * 0.3;
      
    case "macro":
      // Macro economists consider broader trends and volume
      return (trend * 0.2) + ((volume - 0.5) * 0.2);
      
    default:
      return 0;
  }
}
