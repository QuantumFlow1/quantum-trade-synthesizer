
import { useState, useCallback } from 'react';

export const usePortfolioDecisions = () => {
  const [portfolioDecision, setPortfolioDecision] = useState<any>(null);
  const [riskScore, setRiskScore] = useState<number>(50);

  const calculateMajorityAction = useCallback((recommendations: any[]) => {
    const actionCounts: Record<string, number> = {};
    const actionConfidence: Record<string, number[]> = {};
    
    recommendations.forEach(rec => {
      actionCounts[rec.action] = (actionCounts[rec.action] || 0) + 1;
      actionConfidence[rec.action] = actionConfidence[rec.action] || [];
      actionConfidence[rec.action].push(rec.confidence);
    });
    
    // Find the action with the most votes
    let majorityAction = "HOLD";
    let maxCount = 0;
    
    for (const action in actionCounts) {
      if (actionCounts[action] > maxCount) {
        maxCount = actionCounts[action];
        majorityAction = action;
      }
    }
    
    // Calculate the average confidence for the majority action
    const avgConfidence = actionConfidence[majorityAction].reduce((sum, val) => sum + val, 0) / 
                          actionConfidence[majorityAction].length;
    
    return {
      action: majorityAction,
      confidence: Math.round(avgConfidence),
      votes: maxCount,
      totalVotes: recommendations.length
    };
  }, []);

  const calculateRiskScore = useCallback((
    recommendations: any[], 
    majority: { action: string, confidence: number }
  ) => {
    // Base risk on the variance of recommendations and confidence levels
    const recommendationVariance = recommendations.reduce((variance, rec) => {
      return variance + (rec.action !== majority.action ? 1 : 0);
    }, 0) / recommendations.length;
    
    // Risk increases with variance and decreases with confidence
    const baseRisk = 50; // Neutral starting point
    const varianceImpact = recommendationVariance * 40; // Higher variance = higher risk
    const confidenceImpact = majority.confidence * 0.3; // Higher confidence = lower risk
    
    // Calculate final risk (0-100 scale)
    const calculatedRisk = Math.min(
      100, 
      Math.max(
        0, 
        baseRisk + varianceImpact - confidenceImpact
      )
    );
    
    return Math.round(calculatedRisk);
  }, []);

  const generatePortfolioDecision = useCallback((
    recommendations: any[],
    agents: any[],
    accuracyMetrics: any,
    collaborationMessages: any[],
    collaborationScore: number,
    currentData: any
  ) => {
    if (!recommendations.length) return null;
    
    const ticker = currentData?.symbol || "BTC";
    const currentPrice = currentData?.price || 45000;
    
    // Calculate the majority action and its confidence
    const majority = calculateMajorityAction(recommendations);
    
    // Calculate a risk score based on recommendation variance and confidence
    const newRiskScore = calculateRiskScore(recommendations, majority);
    setRiskScore(newRiskScore);
    
    // Determine contributors (agents that recommended the majority action)
    const contributors = recommendations
      .filter(rec => rec.action === majority.action)
      .map(rec => rec.agentId);
    
    // Generate reasoning based on majority action and collaboration
    let reasoning = `Based on the analysis of ${majority.votes} out of ${majority.totalVotes} agents`;
    
    if (collaborationScore > 70) {
      reasoning += ` with high collaboration (${collaborationScore}%)`;
    }
    
    reasoning += `, the portfolio recommends to ${majority.action} ${ticker} at the current price of $${currentPrice}.`;
    
    if (newRiskScore > 70) {
      reasoning += ` This recommendation comes with high risk (${newRiskScore}/100).`;
    } else if (newRiskScore < 30) {
      reasoning += ` This recommendation has relatively low risk (${newRiskScore}/100).`;
    }
    
    // Determine amount based on confidence and risk
    const baseAmount = 0.1; // Base amount to trade
    const adjustedAmount = baseAmount * (majority.confidence / 100) * (1 - (newRiskScore / 200));
    const amount = Math.max(0.01, Math.round(adjustedAmount * 100) / 100); // Min 0.01, rounded to 2 decimals
    
    const decision = {
      action: majority.action,
      ticker,
      amount,
      price: currentPrice,
      confidence: majority.confidence,
      riskScore: newRiskScore,
      contributors,
      reasoning,
      timestamp: new Date().toISOString()
    };
    
    setPortfolioDecision(decision);
    return decision;
  }, [calculateMajorityAction, calculateRiskScore]);

  return {
    portfolioDecision,
    riskScore,
    generatePortfolioDecision,
    setPortfolioDecision
  };
};
