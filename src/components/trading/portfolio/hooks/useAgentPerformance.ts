
import { useState, useCallback } from 'react';
import { TradingAgent, AgentAccuracy } from '../types/portfolioTypes';

export const useAgentPerformance = () => {
  const [agentPerformance, setAgentPerformance] = useState<Record<string, number>>({});

  const updateAgentPerformance = useCallback((
    tradingAgents: TradingAgent[],
    accuracyMetrics: Record<string, AgentAccuracy>
  ) => {
    const newPerformance: Record<string, number> = {...agentPerformance};
    
    tradingAgents.forEach(agent => {
      // Calculate performance based on accuracy metrics if available
      if (accuracyMetrics[agent.id]) {
        // Base performance on accuracy metrics
        newPerformance[agent.id] = Math.round(
          (accuracyMetrics[agent.id].overall * 0.6) + 
          (accuracyMetrics[agent.id].recent * 0.4)
        );
      } else {
        // Fallback to simulated performance
        const basePerf = agent.successRate * 100;
        // Add some random variation
        newPerformance[agent.id] = Math.round(basePerf + (Math.random() * 10 - 5));
      }
    });
    
    setAgentPerformance(newPerformance);
    return newPerformance;
  }, [agentPerformance]);

  return {
    agentPerformance,
    updateAgentPerformance
  };
};
