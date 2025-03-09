
import { useState, useEffect } from 'react';
import { AgentRecommendation, TradingAgent } from '../types/portfolioTypes';
import { AgentPerformance } from '../types/portfolioTypes';

export const useAgentPerformance = () => {
  const [performance, setPerformance] = useState<Record<string, AgentPerformance>>({});

  const updateAgentPerformance = (agents: TradingAgent[], accuracyMetrics: any) => {
    if (!agents || !agents.length) return;

    // Calculate performance metrics for each agent
    const newPerformance: Record<string, AgentPerformance> = {};

    agents.forEach(agent => {
      const successRate = agent.performance?.accuracy || 0.7; // Default to 70% if no data
      
      // Create richer performance metrics
      newPerformance[agent.id] = {
        accuracy: agent.performance?.accuracy || 0.7,
        recentTrades: agent.performance?.recentTrades || [true, false, true],
        profitFactor: agent.performance?.profitFactor || 1.5,
        successRate: successRate,
        recentSuccess: Array(5).fill(0).map(() => Math.random() > 0.3 ? 1 : 0),
        averageConfidence: Math.random() * 20 + 70, // Random value between 70-90
        totalCalls: Math.floor(Math.random() * 20) + 5
      };
    });

    setPerformance(newPerformance);
  };

  return { agentPerformance: performance, updateAgentPerformance };
};
