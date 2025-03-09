
import { Agent } from '@/types/agent';
import { supabase } from '@/lib/supabase';

export class LiveAgentService {
  private static instance: LiveAgentService;
  
  private constructor() {}
  
  public static getInstance(): LiveAgentService {
    if (!LiveAgentService.instance) {
      LiveAgentService.instance = new LiveAgentService();
    }
    return LiveAgentService.instance;
  }
  
  async fetchAgents(): Promise<Agent[]> {
    try {
      // In production, this would call your Supabase function
      // const { data, error } = await supabase.functions.invoke('fetch-agents');
      
      // For now, return mock data
      return this.getMockAgents();
    } catch (error) {
      console.error('Error fetching agents:', error);
      return [];
    }
  }
  
  private getMockAgents(): Agent[] {
    return [
      {
        id: "agent-1",
        name: "ValueTracker",
        status: "active",
        type: "value_investor",
        specialization: "Fundamental analysis",
        description: "Specialized in long-term value investing strategies",
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        tradingStyle: "Conservative",
        performance: {
          successRate: 87,
          tasksCompleted: 142,
          winLossRatio: 2.5 // Now this is a number, matching the Agent type
        }
      },
      {
        id: "agent-2",
        name: "TechAnalyzer",
        status: "active",
        type: "technical_analyst",
        specialization: "Chart patterns",
        description: "Focuses on technical analysis and chart patterns",
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        tradingStyle: "Aggressive",
        performance: {
          successRate: 72,
          tasksCompleted: 196,
          winLossRatio: 1.8 // Now this is a number, matching the Agent type
        }
      },
      {
        id: "agent-3",
        name: "MarketSentinel",
        status: "paused",
        type: "analyst",
        specialization: "Market sentiment",
        description: "Analyzes market sentiment and news impact",
        createdAt: new Date().toISOString(),
        lastActive: new Date(Date.now() - 86400000).toISOString(),
        tradingStyle: "Balanced",
        performance: {
          successRate: 81,
          tasksCompleted: 109,
          winLossRatio: 2.1 // Now this is a number, matching the Agent type
        }
      }
    ];
  }
}

export const liveAgentService = LiveAgentService.getInstance();
