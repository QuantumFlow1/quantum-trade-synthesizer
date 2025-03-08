
import { useState, useCallback } from 'react';
import { 
  TradingAgent, 
  AgentAccuracy, 
  AgentCollaborationMessage 
} from '../types/portfolioTypes';
import { AgentRecommendation, PortfolioDecision, TradeAction } from '@/types/agent';
import { 
  calculateWeightedAction, 
  calculateWeightedConfidence 
} from '../utils/recommendationUtils';
import { generateCollaborativeReasoning } from '../utils/collaborationUtils';

export const usePortfolioDecisions = () => {
  const [portfolioDecision, setPortfolioDecision] = useState<PortfolioDecision | null>(null);
  const [riskScore, setRiskScore] = useState(35); // 0-100 scale

  const generatePortfolioDecision = useCallback((
    recommendations: AgentRecommendation[],
    tradingAgents: TradingAgent[],
    accuracyMetrics: Record<string, AgentAccuracy>,
    collaborationMessages: AgentCollaborationMessage[],
    collaborationScore: number,
    currentData: any
  ) => {
    if (!recommendations.length || !currentData) return null;

    const ticker = currentData?.symbol || "BTC";
    const currentPrice = currentData?.price || 45000;
    const randomSeed = Math.random();

    // Apply weighted voting to calculate the action
    const weightedAction = calculateWeightedAction(recommendations, tradingAgents, accuracyMetrics);
    
    // Calculate average confidence with weights
    const weightedConfidence = calculateWeightedConfidence(recommendations, tradingAgents, accuracyMetrics);
    
    // Calculate new risk score
    const newRiskScore = Math.round(30 + randomSeed * 40);
    setRiskScore(newRiskScore);
    
    // Generate portfolio decision with more detailed parameters
    const newDecision: PortfolioDecision = {
      action: weightedAction,
      ticker,
      amount: randomSeed > 0.7 ? 0.05 : (randomSeed > 0.4 ? 0.02 : 0.01),
      price: currentPrice,
      stopLoss: weightedAction === "BUY" ? Math.round(currentPrice * 0.95) : undefined,
      takeProfit: weightedAction === "BUY" ? Math.round(currentPrice * 1.15) : undefined,
      confidence: weightedConfidence,
      riskScore: newRiskScore,
      contributors: recommendations.map(rec => rec.agentId),
      reasoning: generateCollaborativeReasoning(recommendations, collaborationMessages, newRiskScore, collaborationScore),
      timestamp: new Date().toISOString()
    };
    
    setPortfolioDecision(newDecision);
    return newDecision;
  }, []);

  return {
    portfolioDecision,
    riskScore,
    generatePortfolioDecision,
    setPortfolioDecision
  };
};
