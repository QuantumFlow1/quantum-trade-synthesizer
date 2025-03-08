
import { useState, useCallback } from 'react';
import { AgentPerformance, TradingAgent } from '../types/portfolioTypes';

export const useAgentPerformance = () => {
  const [agentPerformance, setAgentPerformance] = useState<Record<string, AgentPerformance>>({});

  const updateAgentPerformance = useCallback((agents: TradingAgent[], accuracyMetrics: any) => {
    const updatedPerformance: Record<string, AgentPerformance> = {};
    
    agents.forEach(agent => {
      const agentAccuracy = accuracyMetrics[agent.id] || { overall: 50, recent: 50 };
      const currentPerformance = agentPerformance[agent.id] || {
        successRate: 50,
        recentSuccess: [50, 50, 50, 50, 50],
        averageConfidence: 70,
        totalCalls: 0
      };
      
      // Update recent success with a rolling window
      const newRecentSuccess = [...currentPerformance.recentSuccess.slice(1), agentAccuracy.recent];
      
      updatedPerformance[agent.id] = {
        successRate: agentAccuracy.overall,
        recentSuccess: newRecentSuccess,
        averageConfidence: (currentPerformance.averageConfidence * 0.8) + (agent.confidence * 0.2),
        totalCalls: currentPerformance.totalCalls + 1
      };
    });
    
    setAgentPerformance(prev => ({
      ...prev,
      ...updatedPerformance
    }));
  }, [agentPerformance]);

  return {
    agentPerformance,
    updateAgentPerformance
  };
};
