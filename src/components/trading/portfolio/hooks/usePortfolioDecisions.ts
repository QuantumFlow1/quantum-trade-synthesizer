
import { useState, useCallback } from 'react';
import { AgentRecommendation, PortfolioDecision as PortfolioDecisionType, TradeAction } from '@/types/agent';
import { TradingAgent } from '../types/portfolioTypes';

export const usePortfolioDecisions = () => {
  const [portfolioDecision, setPortfolioDecision] = useState<PortfolioDecisionType | null>(null);
  const [riskScore, setRiskScore] = useState<number>(50);
  
  // Generate a final portfolio decision based on agent recommendations
  const generatePortfolioDecision = useCallback((
    recommendations: AgentRecommendation[],
    agents: TradingAgent[],
    accuracyMetrics: Record<string, any>,
    collaborationMessages: any[],
    collaborationScore: number,
    marketData: any
  ) => {
    if (recommendations.length === 0) return;
    
    const ticker = marketData?.symbol || "BTC";
    const currentPrice = marketData?.price || 45000;
    
    // Count votes for each action, weighted by agent importance and accuracy
    const votes = {
      BUY: 0,
      SELL: 0,
      HOLD: 0,
      SHORT: 0,
      COVER: 0
    };
    
    // Track contributing agents
    const contributors: string[] = [];
    let totalWeightedConfidence = 0;
    let totalWeight = 0;
    
    // Calculate weighted votes
    recommendations.forEach(rec => {
      // Find the agent
      const agent = agents.find(a => a.id === rec.agentId);
      if (!agent) return;
      
      // Get accuracy metric for this agent
      const accuracy = accuracyMetrics[agent.id] ? accuracyMetrics[agent.id].overall / 100 : 0.5;
      
      // Calculate weight based on agent weight, accuracy, and confidence
      const weight = agent.weight * accuracy * (rec.confidence / 100);
      
      // Add weighted vote
      votes[rec.action as keyof typeof votes] += weight;
      totalWeight += weight;
      
      // Add to total confidence
      totalWeightedConfidence += rec.confidence * weight;
      
      // Add to contributors if significant contribution
      if (weight > 0.1) {
        contributors.push(agent.id);
      }
    });
    
    // Determine the final action (highest weighted vote)
    const finalDecision = Object.entries(votes).reduce((a, b) => a[1] > b[1] ? a : b)[0] as TradeAction;
    
    // Calculate overall confidence (weighted average of contributing agents)
    const confidence = totalWeight > 0 ? Math.round(totalWeightedConfidence / totalWeight) : 60;
    
    // Calculate simulated amount based on confidence and action
    const baseAmount = finalDecision === "BUY" ? 0.25 : (finalDecision === "SELL" ? 0.15 : 0);
    const adjustedAmount = baseAmount * (confidence / 70);
    const finalAmount = Math.round(adjustedAmount * 100) / 100;
    
    // Calculate risk score based on market volatility, action, and collaboration
    const volatility = marketData?.volatility || 0.3;
    const calculatedRiskScore = Math.round(
      (volatility * 50) + 
      (finalDecision === "BUY" ? 15 : finalDecision === "SELL" ? 10 : 0) + 
      ((1 - (confidence / 100)) * 20) - 
      (collaborationScore * 10)
    );
    
    setRiskScore(calculatedRiskScore);
    
    // Generate reasoning
    let reasoning = `Based on weighted analysis from ${contributors.length} trading agents`;
    
    if (collaborationScore > 0.6) {
      reasoning += ` with strong collaborative consensus (${Math.round(collaborationScore * 100)}%)`;
    }
    
    reasoning += `, the recommended action is to ${finalDecision} ${ticker} at the current price of $${currentPrice}.`;
    
    if (finalDecision === "BUY") {
      reasoning += ` Bullish signals outweigh bearish indicators by ${Math.round((votes.BUY - votes.SELL) * 100)}%.`;
    } else if (finalDecision === "SELL") {
      reasoning += ` Bearish signals outweigh bullish indicators by ${Math.round((votes.SELL - votes.BUY) * 100)}%.`;
    } else {
      reasoning += ` Market signals are mixed with insufficient conviction for a directional trade.`;
    }
    
    // Create the portfolio decision
    const decision: PortfolioDecisionType = {
      id: crypto.randomUUID(),
      action: finalDecision, // For backward compatibility
      finalDecision: finalDecision,
      ticker,
      amount: finalAmount,
      price: currentPrice,
      confidence,
      riskScore: calculatedRiskScore,
      contributors: contributors.slice(0, 3), // Top 3 contributors
      reasoning,
      timestamp: new Date().toISOString(),
      recommendedActions: recommendations.slice(0, 3) // Include top recommendations
    };
    
    setPortfolioDecision(decision);
  }, []);
  
  return {
    portfolioDecision,
    riskScore,
    generatePortfolioDecision,
    setPortfolioDecision
  };
};
