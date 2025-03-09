import { AgentRecommendation } from '../types/portfolioTypes';
import { supabase } from "@/lib/supabase";

// Function to initialize Groq-powered trading agent
// This is a placeholder for potential future implementation
export const setGroqAgentInstance = async (groqAgent: any) => {
  try {
    if (!groqAgent) {
      return null;
    }
    
    console.log(`Initializing Groq-powered agent`);
    return {
      isActive: true,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error initializing Groq agent:`, error);
    return null;
  }
};

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
      try {
        const { data, error } = await supabase.functions.invoke('real-crypto-data', {
          body: { action: 'analyze', symbol: ticker, price: currentPrice }
        });
        
        if (!error && data?.recommendations) {
          console.log("Using enhanced recommendations from real market data");
          return data.recommendations;
        }
      } catch (e) {
        console.error("Error getting enhanced recommendations:", e);
        // Fall back to simulated recommendations
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
      let recommendation: AgentRecommendation | null = null;
      
      // Add randomness but favor certain actions based on agent type
      const roll = Math.random();
      
      // Value investor tends to focus on fundamentals
      if (agent.id === 'value-investor') {
        if (roll > 0.6) {
          recommendation = generateBuyRecommendation(agent, ticker, currentPrice);
        } else if (roll > 0.3) {
          recommendation = generateHoldRecommendation(agent, ticker, currentPrice);
        } else {
          recommendation = generateSellRecommendation(agent, ticker, currentPrice);
        }
      }
      // Technical analyst focuses on chart patterns
      else if (agent.id === 'technical-analyst') {
        if (roll > 0.6) {
          recommendation = generateSellRecommendation(agent, ticker, currentPrice);
        } else if (roll > 0.2) {
          recommendation = generateBuyRecommendation(agent, ticker, currentPrice);
        } else {
          recommendation = generateHoldRecommendation(agent, ticker, currentPrice);
        }
      }
      // Sentiment analyzer focuses on market sentiment
      else if (agent.id === 'sentiment-analyst') {
        if (roll > 0.6) {
          recommendation = generateHoldRecommendation(agent, ticker, currentPrice);
        } else if (roll > 0.3) {
          recommendation = generateBuyRecommendation(agent, ticker, currentPrice);
        } else {
          recommendation = generateSellRecommendation(agent, ticker, currentPrice);
        }
      }
      // News analyzer focuses on recent news
      else if (agent.id === 'news-analyzer') {
        if (roll > 0.7) {
          recommendation = generateBuyRecommendation(agent, ticker, currentPrice);
        } else if (roll > 0.4) {
          recommendation = generateHoldRecommendation(agent, ticker, currentPrice);
        } else {
          recommendation = generateSellRecommendation(agent, ticker, currentPrice);
        }
      }
      // Risk manager is usually more conservative
      else if (agent.id === 'risk-manager') {
        if (roll > 0.7) {
          recommendation = generateHoldRecommendation(agent, ticker, currentPrice);
        } else if (roll > 0.3) {
          recommendation = generateSellRecommendation(agent, ticker, currentPrice);
        } else {
          recommendation = generateBuyRecommendation(agent, ticker, currentPrice);
        }
      }
      // Fallback for any other agent type
      else {
        if (roll > 0.6) {
          recommendation = generateBuyRecommendation(agent, ticker, currentPrice);
        } else if (roll > 0.3) {
          recommendation = generateHoldRecommendation(agent, ticker, currentPrice);
        } else {
          recommendation = generateSellRecommendation(agent, ticker, currentPrice);
        }
      }
      
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

// Helper function to generate a BUY recommendation
const generateBuyRecommendation = (
  agent: any, 
  ticker: string, 
  price: number
): AgentRecommendation => {
  const baseReasoning = {
    'value-investor': `${ticker} appears undervalued at the current price of $${price}. Based on fundamentals analysis, the fair value is higher.`,
    'technical-analyst': `Technical indicators for ${ticker} show a bullish pattern. The price of $${price} has formed a support level and RSI indicates oversold conditions.`,
    'sentiment-analyst': `Market sentiment for ${ticker} is turning positive. Social media metrics show increasing interest and positive mentions at the $${price} level.`,
    'news-analyzer': `Recent news for ${ticker} is positive. Several developments suggest potential growth that isn't reflected in the current $${price}.`,
    'risk-manager': `Risk assessment for ${ticker} at $${price} shows favorable risk-reward ratio. Downside risk is limited compared to upside potential.`
  };
  
  return {
    agentId: agent.id,
    action: "BUY",
    ticker,
    confidence: 65 + Math.floor(Math.random() * 20),
    reasoning: baseReasoning[agent.id] || `Analysis suggests ${ticker} is a good buy at $${price}.`,
    timestamp: new Date().toISOString()
  };
};

// Helper function to generate a SELL recommendation
const generateSellRecommendation = (
  agent: any, 
  ticker: string, 
  price: number
): AgentRecommendation => {
  const baseReasoning = {
    'value-investor': `${ticker} appears overvalued at the current price of $${price}. Based on fundamentals analysis, the fair value is lower.`,
    'technical-analyst': `Technical indicators for ${ticker} show a bearish pattern. The price of $${price} has broken through support levels and RSI indicates overbought conditions.`,
    'sentiment-analyst': `Market sentiment for ${ticker} is turning negative. Social media metrics show decreasing interest and negative mentions at the $${price} level.`,
    'news-analyzer': `Recent news for ${ticker} is concerning. Several developments suggest potential risks that aren't reflected in the current $${price}.`,
    'risk-manager': `Risk assessment for ${ticker} at $${price} shows unfavorable risk-reward ratio. Downside risk exceeds upside potential.`
  };
  
  return {
    agentId: agent.id,
    action: "SELL",
    ticker,
    confidence: 65 + Math.floor(Math.random() * 20),
    reasoning: baseReasoning[agent.id] || `Analysis suggests ${ticker} is a sell at $${price}.`,
    timestamp: new Date().toISOString()
  };
};

// Helper function to generate a HOLD recommendation
const generateHoldRecommendation = (
  agent: any, 
  ticker: string, 
  price: number
): AgentRecommendation => {
  const baseReasoning = {
    'value-investor': `${ticker} appears fairly valued at the current price of $${price}. Based on fundamentals analysis, the price reflects fair value.`,
    'technical-analyst': `Technical indicators for ${ticker} are mixed. The price of $${price} is within a consolidation range and no clear trend is visible.`,
    'sentiment-analyst': `Market sentiment for ${ticker} is neutral. Social media metrics show stable interest without strong directional bias at the $${price} level.`,
    'news-analyzer': `Recent news for ${ticker} is mixed. There are both positive and negative developments that balance out at the current $${price}.`,
    'risk-manager': `Risk assessment for ${ticker} at $${price} shows balanced risk-reward ratio. Recommend holding current position.`
  };
  
  return {
    agentId: agent.id,
    action: "HOLD",
    ticker,
    confidence: 60 + Math.floor(Math.random() * 20),
    reasoning: baseReasoning[agent.id] || `Analysis suggests holding ${ticker} at $${price}.`,
    timestamp: new Date().toISOString()
  };
};
