
/**
 * Functions for generating recommendations based on specific agent types
 */

import { 
  generateBuyRecommendation, 
  generateSellRecommendation, 
  generateHoldRecommendation 
} from './agentRecommendationHelpers';
import { AgentRecommendation } from '../types/portfolioTypes';

// Generate recommendation for specific agent type
export const generateRecommendationByAgentType = (
  agent: any, 
  ticker: string, 
  price: number
): AgentRecommendation | null => {
  const roll = Math.random();
  
  // Value investor tends to focus on fundamentals
  if (agent.id === 'value-investor') {
    if (roll > 0.6) {
      return generateBuyRecommendation(agent, ticker, price);
    } else if (roll > 0.3) {
      return generateHoldRecommendation(agent, ticker, price);
    } else {
      return generateSellRecommendation(agent, ticker, price);
    }
  }
  
  // Technical analyst focuses on chart patterns
  else if (agent.id === 'technical-analyst') {
    if (roll > 0.6) {
      return generateSellRecommendation(agent, ticker, price);
    } else if (roll > 0.2) {
      return generateBuyRecommendation(agent, ticker, price);
    } else {
      return generateHoldRecommendation(agent, ticker, price);
    }
  }
  
  // Sentiment analyzer focuses on market sentiment
  else if (agent.id === 'sentiment-analyst') {
    if (roll > 0.6) {
      return generateHoldRecommendation(agent, ticker, price);
    } else if (roll > 0.3) {
      return generateBuyRecommendation(agent, ticker, price);
    } else {
      return generateSellRecommendation(agent, ticker, price);
    }
  }
  
  // News analyzer focuses on recent news
  else if (agent.id === 'news-analyzer') {
    if (roll > 0.7) {
      return generateBuyRecommendation(agent, ticker, price);
    } else if (roll > 0.4) {
      return generateHoldRecommendation(agent, ticker, price);
    } else {
      return generateSellRecommendation(agent, ticker, price);
    }
  }
  
  // Risk manager is usually more conservative
  else if (agent.id === 'risk-manager') {
    if (roll > 0.7) {
      return generateHoldRecommendation(agent, ticker, price);
    } else if (roll > 0.3) {
      return generateSellRecommendation(agent, ticker, price);
    } else {
      return generateBuyRecommendation(agent, ticker, price);
    }
  }
  
  // Fallback for any other agent type
  else {
    if (roll > 0.6) {
      return generateBuyRecommendation(agent, ticker, price);
    } else if (roll > 0.3) {
      return generateHoldRecommendation(agent, ticker, price);
    } else {
      return generateSellRecommendation(agent, ticker, price);
    }
  }
};
