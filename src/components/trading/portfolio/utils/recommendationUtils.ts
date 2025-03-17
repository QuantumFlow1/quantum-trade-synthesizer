
import { AgentRecommendation } from '../types/portfolioTypes';
import { setGroqAgentInstance as initGroqAgent, getEnhancedRecommendations } from './groqAgentUtils';
import { generateRecommendationByAgentType } from './agentTypeRecommendations';

// Re-export the Groq agent initialization function to maintain the same public API
export const setGroqAgentInstance = initGroqAgent;

// Generate recommendations from trading agents
export const generateAgentRecommendations = async (
  currentData: any,
  agents: any[],
  accuracyMetrics: any = {},
  realMarketData?: any[]
): Promise<AgentRecommendation[]> => {
  const ticker = currentData?.symbol || "BTC";
  const currentPrice = currentData?.price || 45000;
  
  // Determine if we're using real data
  const usingRealData = !!realMarketData && Array.isArray(realMarketData) && realMarketData.length > 0;
  console.log(`Generating agent recommendations for ${ticker} at $${currentPrice} using ${usingRealData ? 'real' : 'simulated'} data`);
  
  try {
    // If we have real market data, try to get enhanced recommendations
    if (usingRealData) {
      const enhancedRecommendations = await getEnhancedRecommendations(ticker, currentPrice);
      if (enhancedRecommendations) {
        return enhancedRecommendations;
      }
    }
    
    // Fallback to simulated recommendations generation
    const recommendations: AgentRecommendation[] = [];
    
    // Process each agent
    for (const agent of agents) {
      // Skip inactive agents
      if (!agent.isActive) continue;
      
      // Get accuracy metrics for this agent if available
      const agentAccuracy = accuracyMetrics[agent.id] || { overall: 50, recent: 50 };
      
      // Generate recommendation based on agent type
      let recommendation = generateRecommendationByAgentType(agent, ticker, currentPrice);
      
      // Ensure we have a valid recommendation
      if (recommendation) {
        // Adjust confidence based on agent's accuracy metrics
        const accuracyBoost = Math.max(0, (agentAccuracy.overall - 50) / 2);
        recommendation.confidence = Math.min(95, recommendation.confidence + accuracyBoost);
        
        recommendations.push(recommendation);
      }
    }
    
    return recommendations;
  } catch (error) {
    console.error("Error generating agent recommendations:", error);
    return [];
  }
};
