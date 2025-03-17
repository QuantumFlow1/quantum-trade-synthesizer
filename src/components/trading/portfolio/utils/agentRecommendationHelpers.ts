
/**
 * Helper functions for generating agent-specific trading recommendations
 */

import { AgentRecommendation } from '../types/portfolioTypes';

// Helper function to generate a BUY recommendation
export const generateBuyRecommendation = (
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
export const generateSellRecommendation = (
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
export const generateHoldRecommendation = (
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
