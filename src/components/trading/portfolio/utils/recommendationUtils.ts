
import { TradingAgent, AgentAccuracy } from "../types/portfolioTypes";
import { AgentRecommendation, TradeAction } from "@/types/agent";

// Generate agent recommendations with more specializations
export const generateAgentRecommendations = (
  currentData: any, 
  tradingAgents: TradingAgent[],
  accuracyMetrics: Record<string, AgentAccuracy>
): AgentRecommendation[] => {
  if (!currentData) return [];
  
  const ticker = currentData?.symbol || "BTC";
  const currentPrice = currentData?.price || 45000;
  const randomSeed = Math.random();
  const recommendations: AgentRecommendation[] = [];
  
  // Get recommendations from each agent type
  tradingAgents.forEach(agent => {
    // Determine action based on agent type and random factors
    let action: TradeAction = "HOLD";
    let confidence = 50 + Math.floor(Math.random() * 40);
    let reasoning = "";
    
    // Specialized logic per agent type
    switch(agent.specialization) {
      case "fundamental":
        action = randomSeed > 0.7 ? "BUY" : (randomSeed > 0.4 ? "HOLD" : "SELL");
        confidence = Math.round(60 + randomSeed * 30);
        reasoning = `Based on fundamental analysis, the current ${ticker} price at $${currentPrice} ${randomSeed > 0.6 ? "represents a good value" : "is slightly overvalued"}.`;
        break;
        
      case "technical":
        action = randomSeed > 0.5 ? "BUY" : "SELL";
        confidence = Math.round(50 + randomSeed * 40);
        reasoning = `Technical indicators show ${randomSeed > 0.5 ? "bullish" : "bearish"} momentum on ${ticker} with ${randomSeed > 0.7 ? "strong" : "moderate"} volume.`;
        break;
        
      case "sentiment":
        action = randomSeed > 0.6 ? "BUY" : (randomSeed > 0.3 ? "HOLD" : "SELL");
        confidence = Math.round(40 + randomSeed * 50);
        reasoning = `Market sentiment analysis indicates ${randomSeed > 0.6 ? "positive" : "mixed"} outlook for ${ticker} based on news and social media.`;
        break;
        
      case "risk":
        // Risk manager is more conservative
        action = randomSeed > 0.8 ? "BUY" : (randomSeed > 0.4 ? "HOLD" : "SELL");
        confidence = Math.round(70 + randomSeed * 25);
        reasoning = `Risk assessment shows ${randomSeed > 0.7 ? "manageable" : "elevated"} downside risk with recommended position size of ${Math.round(randomSeed * 5 + 2)}% of portfolio.`;
        break;
        
      case "volatility":
        action = randomSeed > 0.6 ? (randomSeed > 0.8 ? "BUY" : "HOLD") : "SELL";
        confidence = Math.round(55 + randomSeed * 35);
        reasoning = `Volatility metrics indicate ${randomSeed > 0.7 ? "decreasing" : "increasing"} market fluctuations with ${randomSeed > 0.5 ? "favorable" : "unfavorable"} trading conditions.`;
        break;
        
      case "macro":
        action = randomSeed > 0.65 ? "BUY" : (randomSeed > 0.4 ? "HOLD" : "SELL");
        confidence = Math.round(60 + randomSeed * 30);
        reasoning = `Macroeconomic indicators suggest ${randomSeed > 0.6 ? "supportive" : "challenging"} environment for ${ticker} with ${randomSeed > 0.5 ? "bullish" : "bearish"} implications.`;
        break;
        
      default:
        action = randomSeed > 0.5 ? "BUY" : "SELL";
        confidence = Math.round(50 + randomSeed * 30);
        reasoning = `Analysis indicates a ${randomSeed > 0.5 ? "favorable" : "unfavorable"} outlook for ${ticker}.`;
    }
    
    // Adjust confidence based on accuracy metrics
    if (accuracyMetrics[agent.id]) {
      // Make confidence slightly closer to historical accuracy
      const historicalAccuracy = accuracyMetrics[agent.id].overall;
      confidence = Math.round((confidence * 0.7) + (historicalAccuracy * 0.3));
    }
    
    recommendations.push({
      agentId: agent.id,
      action,
      confidence,
      reasoning,
      ticker,
      price: currentPrice,
      timestamp: new Date().toISOString()
    });
  });
  
  return recommendations;
};

// Calculate weighted action based on agent weights and accuracy
export const calculateWeightedAction = (
  recommendations: AgentRecommendation[], 
  agents: TradingAgent[],
  accuracyMetrics: Record<string, AgentAccuracy>
): TradeAction => {
  const actionScores: Record<TradeAction, number> = {
    "BUY": 0,
    "SELL": 0,
    "HOLD": 0,
    "SHORT": 0,
    "COVER": 0
  };
  
  let totalWeight = 0;
  
  recommendations.forEach(rec => {
    // Find the agent's weight
    const agent = agents.find(a => a.id === rec.agentId);
    if (agent) {
      // Calculate weight based on agent weight, confidence, and historical accuracy
      let weight = agent.weight;
      
      // Adjust weight by accuracy if available
      if (accuracyMetrics[agent.id]) {
        // Give more weight to agents with higher accuracy
        const accuracyFactor = accuracyMetrics[agent.id].overall / 100;
        // And more weight to agents with more consistent results
        const confidenceRange = accuracyMetrics[agent.id].confidence[1] - accuracyMetrics[agent.id].confidence[0];
        const consistencyFactor = 1 - (confidenceRange / 100);
        
        weight = weight * (0.5 + (accuracyFactor * 0.3) + (consistencyFactor * 0.2));
      }
      
      // Adjust by recommendation confidence
      weight = weight * (rec.confidence / 100);
      
      actionScores[rec.action] += weight;
      totalWeight += weight;
    } else {
      // Fallback if agent not found
      actionScores[rec.action] += rec.confidence;
      totalWeight += rec.confidence;
    }
  });
  
  // Find the action with the highest weighted score
  let bestAction: TradeAction = "HOLD"; // Default
  let highestScore = 0;
  
  (Object.keys(actionScores) as TradeAction[]).forEach(action => {
    if (actionScores[action] > highestScore) {
      highestScore = actionScores[action];
      bestAction = action;
    }
  });
  
  return bestAction;
};

// Calculate weighted confidence with accuracy considerations
export const calculateWeightedConfidence = (
  recommendations: AgentRecommendation[], 
  agents: TradingAgent[],
  accuracyMetrics: Record<string, AgentAccuracy>
): number => {
  let weightedConfidenceSum = 0;
  let totalWeight = 0;
  
  recommendations.forEach(rec => {
    const agent = agents.find(a => a.id === rec.agentId);
    if (agent) {
      let weight = agent.weight;
      
      // Apply accuracy weighting if available
      if (accuracyMetrics[agent.id]) {
        // Agents with higher accuracy get more weight in confidence calculation
        weight = weight * (accuracyMetrics[agent.id].overall / 100);
      }
      
      weightedConfidenceSum += rec.confidence * weight;
      totalWeight += weight;
    } else {
      weightedConfidenceSum += rec.confidence;
      totalWeight += 50; // Default weight
    }
  });
  
  return Math.round(weightedConfidenceSum / (totalWeight || 1));
};
