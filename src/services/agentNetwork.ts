
import { supabase } from '@/lib/supabase';
import { Agent, AgentRecommendation, TradeAction } from '@/types/agent';

// Define types needed for the agent network
export interface AgentMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface AgentTask {
  id: string;
  agentId: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'normal' | 'high' | 'critical';
  createdAt: string;
  completedAt?: string;
}

export interface CollaborationSession {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  participants: string[];
  createdAt: string;
  completedAt?: string;
}

export interface PortfolioDecision {
  id: string;
  ticker: string;
  action: TradeAction;
  confidence: number;
  reasoning: string;
  timestamp: string;
  agentIds: string[];
  price?: number;
}

// Initialize agent network
export const initializeAgentNetwork = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('agent-communication', {
      body: { action: 'initialize_network' }
    });
    
    if (error) {
      console.error('Error initializing agent network:', error);
      return false;
    }
    
    return data?.success || false;
  } catch (error) {
    console.error('Exception initializing agent network:', error);
    return false;
  }
};

// Get active agents
export const getActiveAgents = async (): Promise<Agent[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('agent-communication', {
      body: { action: 'list_agents', status: 'active' }
    });
    
    if (error) {
      console.error('Error fetching active agents:', error);
      return [];
    }
    
    return data?.agents || [];
  } catch (error) {
    console.error('Exception fetching active agents:', error);
    return [];
  }
};

// Toggle agent status
export const toggleAgentStatus = async (
  agentId: string, 
  status: 'active' | 'offline' | 'paused' | 'terminated'
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('agent-communication', {
      body: { 
        action: 'update_agent_status', 
        agentId, 
        status 
      }
    });
    
    if (error) {
      console.error('Error updating agent status:', error);
      return false;
    }
    
    return data?.success || false;
  } catch (error) {
    console.error('Exception updating agent status:', error);
    return false;
  }
};

// Generate collaborative trading analysis
export const generateCollaborativeTradingAnalysis = async (
  ticker: string,
  timeframe: string = '1d',
  agentTypes: string[] = ['trader', 'analyst', 'portfolio_manager']
): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('agent-communication', {
      body: { 
        action: 'collaborative_analysis',
        ticker,
        timeframe,
        agentTypes
      }
    });
    
    if (error) {
      console.error('Error generating collaborative analysis:', error);
      return 'Failed to generate analysis. Please try again later.';
    }
    
    return data?.analysis || 'No analysis available';
  } catch (error) {
    console.error('Exception generating collaborative analysis:', error);
    return 'An unexpected error occurred. Please try again later.';
  }
};

// Get agent messages
export const getAgentMessages = async (agentId: string): Promise<AgentMessage[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('agent-communication', {
      body: { 
        action: 'get_agent_messages',
        agentId
      }
    });
    
    if (error) {
      console.error('Error fetching agent messages:', error);
      return [];
    }
    
    return data?.messages || [];
  } catch (error) {
    console.error('Exception fetching agent messages:', error);
    return [];
  }
};

// Send agent message
export const sendAgentMessage = async (
  senderId: string, 
  receiverId: string, 
  content: string
): Promise<AgentMessage | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('agent-communication', {
      body: { 
        action: 'send_agent_message',
        senderId,
        receiverId,
        content
      }
    });
    
    if (error) {
      console.error('Error sending agent message:', error);
      return null;
    }
    
    return data?.message || null;
  } catch (error) {
    console.error('Exception sending agent message:', error);
    return null;
  }
};

// Get agent tasks
export const getAgentTasks = async (agentId: string): Promise<AgentTask[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('agent-communication', {
      body: { 
        action: 'get_agent_tasks',
        agentId
      }
    });
    
    if (error) {
      console.error('Error fetching agent tasks:', error);
      return [];
    }
    
    return data?.tasks || [];
  } catch (error) {
    console.error('Exception fetching agent tasks:', error);
    return [];
  }
};

// Create agent task
export const createAgentTask = async (
  agentId: string,
  title: string,
  description: string,
  priority: 'low' | 'normal' | 'high' | 'critical' = 'normal'
): Promise<AgentTask | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('agent-communication', {
      body: { 
        action: 'create_agent_task',
        agentId,
        title,
        description,
        priority
      }
    });
    
    if (error) {
      console.error('Error creating agent task:', error);
      return null;
    }
    
    return data?.task || null;
  } catch (error) {
    console.error('Exception creating agent task:', error);
    return null;
  }
};

// Sync agent messages
export const syncAgentMessages = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('agent-communication', {
      body: { action: 'sync_agent_messages' }
    });
    
    if (error) {
      console.error('Error syncing agent messages:', error);
      return false;
    }
    
    return data?.success || false;
  } catch (error) {
    console.error('Exception syncing agent messages:', error);
    return false;
  }
};

// Get collaboration sessions
export const getCollaborationSessions = async (): Promise<CollaborationSession[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('agent-communication', {
      body: { action: 'get_collaboration_sessions' }
    });
    
    if (error) {
      console.error('Error fetching collaboration sessions:', error);
      return [];
    }
    
    return data?.sessions || [];
  } catch (error) {
    console.error('Exception fetching collaboration sessions:', error);
    return [];
  }
};

// Submit agent recommendation
export const submitAgentRecommendation = async (recommendation: Omit<AgentRecommendation, 'id' | 'timestamp'>): Promise<AgentRecommendation | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('agent-communication', {
      body: { 
        action: 'submit_recommendation',
        recommendation
      }
    });
    
    if (error) {
      console.error('Error submitting agent recommendation:', error);
      return null;
    }
    
    return data?.recommendation || null;
  } catch (error) {
    console.error('Exception submitting agent recommendation:', error);
    return null;
  }
};

// Get agent recommendations
export const getAgentRecommendations = async (agentId?: string, limit: number = 10): Promise<AgentRecommendation[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('agent-communication', {
      body: { 
        action: 'get_recommendations',
        agentId,
        limit
      }
    });
    
    if (error) {
      console.error('Error fetching agent recommendations:', error);
      return [];
    }
    
    return data?.recommendations || [];
  } catch (error) {
    console.error('Exception fetching agent recommendations:', error);
    return [];
  }
};

// Get recent agent recommendations
export const getRecentAgentRecommendations = async (limit: number = 5): Promise<AgentRecommendation[]> => {
  return getAgentRecommendations(undefined, limit);
};

// Create portfolio decision
export const createPortfolioDecision = async (
  ticker: string,
  action: TradeAction,
  confidence: number,
  reasoning: string,
  agentIds: string[],
  price?: number
): Promise<PortfolioDecision | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('agent-communication', {
      body: { 
        action: 'create_portfolio_decision',
        ticker,
        tradeAction: action,
        confidence,
        reasoning,
        agentIds,
        price
      }
    });
    
    if (error) {
      console.error('Error creating portfolio decision:', error);
      return null;
    }
    
    return data?.decision || null;
  } catch (error) {
    console.error('Exception creating portfolio decision:', error);
    return null;
  }
};

// Get portfolio decisions
export const getPortfolioDecisions = async (limit: number = 10): Promise<PortfolioDecision[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('agent-communication', {
      body: { 
        action: 'get_portfolio_decisions',
        limit
      }
    });
    
    if (error) {
      console.error('Error fetching portfolio decisions:', error);
      return [];
    }
    
    return data?.decisions || [];
  } catch (error) {
    console.error('Exception fetching portfolio decisions:', error);
    return [];
  }
};

// Get recent portfolio decisions
export const getRecentPortfolioDecisions = async (limit: number = 5): Promise<PortfolioDecision[]> => {
  return getPortfolioDecisions(limit);
};

// Generate agent recommendation based on market data
export const generateAgentRecommendation = async (
  agentId: string,
  ticker: string
): Promise<AgentRecommendation | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('agent-communication', {
      body: { 
        action: 'generate_recommendation',
        agentId,
        ticker
      }
    });
    
    if (error) {
      console.error('Error generating agent recommendation:', error);
      return null;
    }
    
    return data?.recommendation || null;
  } catch (error) {
    console.error('Exception generating agent recommendation:', error);
    return null;
  }
};

// Generate portfolio decision from agent recommendations
export const generatePortfolioDecision = async (
  ticker: string,
  timeout: number = 30000
): Promise<PortfolioDecision | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('agent-communication', {
      body: { 
        action: 'generate_portfolio_decision',
        ticker,
        timeout
      }
    });
    
    if (error) {
      console.error('Error generating portfolio decision:', error);
      return null;
    }
    
    return data?.decision || null;
  } catch (error) {
    console.error('Exception generating portfolio decision:', error);
    return null;
  }
};

// Helper function to compute trend direction
export const getTrendDirection = (
  action: TradeAction, 
  confidence: number
): 'bullish' | 'bearish' | 'neutral' => {
  // Fix the comparison issue with explicit type checking
  if (action === "BUY" || action === "COVER") {
    return confidence > 75 ? 'bullish' : 'neutral';
  } else if (action === "SELL" || action === "SHORT") {
    return confidence > 75 ? 'bearish' : 'neutral';
  }
  return 'neutral';
};
