
import { useState, useEffect } from 'react';
import { AgentRecommendation, TradingAgent } from '../types/portfolioTypes';
import { AgentPerformance } from '../types/portfolioTypes';

export const useAgentPerformance = (agents: TradingAgent[], recommendations: AgentRecommendation[]) => {
  const [performance, setPerformance] = useState<Record<string, AgentPerformance>>({});

  useEffect(() => {
    if (!agents.length) return;

    // Calculate performance metrics for each agent
    const newPerformance: Record<string, AgentPerformance> = {};

    agents.forEach(agent => {
      const agentRecs = recommendations.filter(rec => rec.agentId === agent.id);
      const successRate = agent.performance?.accuracy || 0.7; // Default to 70% if no data
      
      // Create richer performance metrics
      newPerformance[agent.id] = {
        accuracy: agent.performance?.accuracy || 0.7,
        recentTrades: agent.performance?.recentTrades || [true, false, true],
        profitFactor: agent.performance?.profitFactor || 1.5,
        successRate: successRate,
        recentSuccess: Array(5).fill(0).map(() => Math.random() > 0.3 ? 1 : 0),
        averageConfidence: agentRecs.reduce((acc, rec) => acc + rec.confidence, 0) / (agentRecs.length || 1),
        totalCalls: agentRecs.length
      };
    });

    setPerformance(newPerformance);
  }, [agents, recommendations]);

  return performance;
};
