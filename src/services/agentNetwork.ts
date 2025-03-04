import { supabase } from "@/lib/supabase";
import { AI_MODELS, ModelId } from "@/components/chat/types/GrokSettings";
import { Agent, AgentRecommendation, PortfolioDecision, TradeAction } from "@/types/agent";
import { toast } from "@/hooks/use-toast";

// Define types for agent communication
export interface AgentMessage {
  id: string;
  fromAgent: string;
  toAgent: string;
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AgentTask {
  id: string;
  agentId: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  result?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollaborationSession {
  id: string;
  status: 'active' | 'completed';
  participants: string[];
  createdAt: string;
  completedAt?: string;
  summary?: string;
}

export interface AgentNetworkState {
  availableAgents: Agent[];
  activeAgents: Agent[];
  messages: AgentMessage[];
  tasks: AgentTask[];
  collaborationSessions: CollaborationSession[];
  recommendations: AgentRecommendation[];
  portfolioDecisions: PortfolioDecision[];
  isNetworkActive: boolean;
}

// Initialize agent network state
const initialNetworkState: AgentNetworkState = {
  availableAgents: [],
  activeAgents: [],
  messages: [],
  tasks: [],
  collaborationSessions: [],
  recommendations: [],
  portfolioDecisions: [],
  isNetworkActive: false
};

let networkState = { ...initialNetworkState };

// Function to initialize the agent network
export async function initializeAgentNetwork(): Promise<boolean> {
  try {
    console.log("Initializing agent network...");
    
    // Clear existing state
    networkState = { ...initialNetworkState };
    
    // Create agents based on available AI models
    const registeredAgents = AI_MODELS.map(model => createAgentFromModel(model));
    
    // Add specialized trading agents
    const tradingAgents: Agent[] = [
      {
        id: "market-analyzer",
        name: "Market Analyzer",
        status: "active",
        type: "analyst",
        specialization: "technical",
        description: "Analyzes market trends and provides technical analysis",
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        performance: {
          successRate: 0.85,
          tasksCompleted: 127
        }
      },
      {
        id: "risk-manager",
        name: "Risk Manager",
        status: "active",
        type: "advisor",
        description: "Evaluates trade risk and provides risk management advice",
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        performance: {
          successRate: 0.92,
          tasksCompleted: 84
        }
      },
      {
        id: "trading-executor",
        name: "Trading Executor",
        status: "active",
        type: "trader",
        description: "Executes trading strategies based on analysis",
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        performance: {
          successRate: 0.78,
          tasksCompleted: 56
        }
      },
      {
        id: "sentiment-analyzer",
        name: "Sentiment Analyzer",
        status: "active",
        type: "analyst",
        specialization: "sentiment",
        description: "Analyzes market sentiment from news and social media",
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        performance: {
          successRate: 0.82,
          tasksCompleted: 45
        }
      },
      {
        id: "portfolio-manager",
        name: "Portfolio Manager",
        status: "active",
        type: "portfolio_manager",
        description: "Coordinates between risk signals and trade actions, optimizes portfolio allocation",
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        performance: {
          successRate: 0.88,
          tasksCompleted: 95,
          winLossRatio: 1.7
        }
      },
      {
        id: "value-investor",
        name: "Bill Ackman Agent",
        status: "active",
        type: "value_investor",
        tradingStyle: "Activist Value Investing",
        description: "Focuses on value investing with an activist approach",
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        performance: {
          successRate: 0.80,
          tasksCompleted: 62,
          winLossRatio: 2.1
        }
      },
      {
        id: "fundamentals-expert",
        name: "Warren Buffett Agent",
        status: "active",
        type: "fundamentals_analyst",
        tradingStyle: "Value Investing",
        description: "Analyzes company fundamentals with long-term investing focus",
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        performance: {
          successRate: 0.91,
          tasksCompleted: 74,
          winLossRatio: 3.2
        }
      },
      {
        id: "technical-expert",
        name: "Technical Pattern Specialist",
        status: "active",
        type: "technical_analyst",
        specialization: "chart patterns",
        description: "Specializes in identifying actionable chart patterns",
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        performance: {
          successRate: 0.76,
          tasksCompleted: 132,
          winLossRatio: 1.4
        }
      },
      {
        id: "valuation-expert",
        name: "Valuation Expert",
        status: "active",
        type: "valuation_expert",
        description: "Determines fair value based on multiple valuation models",
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        performance: {
          successRate: 0.83,
          tasksCompleted: 58,
          winLossRatio: 1.9
        }
      }
    ];
    
    // Combine all agents
    networkState.availableAgents = [...registeredAgents, ...tradingAgents];
    
    // Set initially active agents
    networkState.activeAgents = networkState.availableAgents.filter(
      agent => agent.status === "active"
    );
    
    // Check the agent-network-coordinator status to ensure it's running
    const { data, error } = await supabase.functions.invoke('agent-network-coordinator', {
      body: { action: 'status' }
    });
    
    if (error) {
      console.error("Failed to connect to agent-network-coordinator:", error);
      return false;
    }
    
    console.log("Agent network coordinator status:", data);
    networkState.isNetworkActive = data.status === "active";
    
    console.log(`Agent network initialized with ${networkState.activeAgents.length} active agents`);
    return networkState.isNetworkActive;
  } catch (error) {
    console.error("Failed to initialize agent network:", error);
    return false;
  }
}

// Helper to create an agent from an AI model
function createAgentFromModel(model: typeof AI_MODELS[0]): Agent {
  return {
    id: model.id,
    name: model.name,
    status: "active",
    type: "advisor",
    description: model.description || `${model.name} AI assistant`,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    performance: {
      successRate: 0.8,
      tasksCompleted: 0
    }
  };
}

// Function to add a message between agents
export async function sendAgentMessage(
  fromAgentId: string, 
  toAgentId: string, 
  content: string, 
  metadata?: Record<string, any>
): Promise<AgentMessage | null> {
  try {
    // Send the message through the coordinator
    const { data, error } = await supabase.functions.invoke('agent-network-coordinator', {
      body: { 
        action: 'send_message',
        data: {
          sender: fromAgentId,
          receiver: toAgentId,
          content: content
        }
      }
    });
    
    if (error) {
      console.error("Failed to send agent message:", error);
      return null;
    }
    
    // Create a local representation of the message
    const newMessage: AgentMessage = {
      id: data.messageId,
      fromAgent: fromAgentId,
      toAgent: toAgentId,
      content: content,
      timestamp: new Date(),
      metadata
    };
    
    networkState.messages.push(newMessage);
    
    // Update last active timestamp for both agents
    updateAgentActivity(fromAgentId);
    updateAgentActivity(toAgentId);
    
    return newMessage;
  } catch (error) {
    console.error("Error sending agent message:", error);
    return null;
  }
}

// Function to update agent activity timestamp
function updateAgentActivity(agentId: string) {
  const agent = networkState.availableAgents.find(a => a.id === agentId);
  if (agent) {
    agent.lastActive = new Date().toISOString();
  }
}

// Function to fetch the latest messages from the coordinator
export async function syncAgentMessages(): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('agent-network-coordinator', {
      body: { action: 'get_messages' }
    });
    
    if (error) {
      console.error("Failed to sync agent messages:", error);
      return false;
    }
    
    // Map the messages to our format
    const mappedMessages: AgentMessage[] = data.messages.map((msg: any) => ({
      id: msg.id,
      fromAgent: msg.sender,
      toAgent: msg.receiver,
      content: msg.content,
      timestamp: new Date(msg.timestamp)
    }));
    
    networkState.messages = mappedMessages;
    return true;
  } catch (error) {
    console.error("Error syncing agent messages:", error);
    return false;
  }
}

// Function to create a task for an agent
export async function createAgentTask(
  agentId: string,
  description: string,
  priority: 'low' | 'medium' | 'high' = 'medium'
): Promise<AgentTask | null> {
  try {
    const { data, error } = await supabase.functions.invoke('agent-network-coordinator', {
      body: { 
        action: 'create_task',
        data: {
          assignedTo: agentId,
          description: description
        }
      }
    });
    
    if (error) {
      console.error("Failed to create agent task:", error);
      return null;
    }
    
    // Create a local representation of the task
    const newTask: AgentTask = {
      id: data.taskId,
      agentId: agentId,
      description: description,
      status: 'pending',
      priority: priority,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    networkState.tasks.push(newTask);
    
    return newTask;
  } catch (error) {
    console.error("Error creating agent task:", error);
    return null;
  }
}

// New function to submit trading recommendations from agents
export async function submitAgentRecommendation(
  agentId: string,
  action: TradeAction,
  confidence: number,
  reasoning: string,
  ticker?: string,
  price?: number
): Promise<AgentRecommendation | null> {
  try {
    const agent = networkState.availableAgents.find(a => a.id === agentId);
    if (!agent) {
      console.error(`Agent with id ${agentId} not found`);
      return null;
    }
    
    const recommendation: AgentRecommendation = {
      agentId,
      action,
      confidence,
      reasoning,
      ticker,
      price,
      timestamp: new Date().toISOString()
    };
    
    // Add recommendation to state
    networkState.recommendations.push(recommendation);
    
    // Inform the portfolio manager agent
    await sendAgentMessage(
      agentId,
      "portfolio-manager",
      `New ${action} recommendation for ${ticker || 'the market'} with ${confidence}% confidence. Reasoning: ${reasoning}`
    );
    
    // Update agent activity
    updateAgentActivity(agentId);
    
    // Return the created recommendation
    return recommendation;
  } catch (error) {
    console.error("Error submitting agent recommendation:", error);
    return null;
  }
}

// New function to get all agent recommendations
export function getAgentRecommendations(): AgentRecommendation[] {
  return networkState.recommendations;
}

// New function to get recent agent recommendations
export function getRecentAgentRecommendations(count: number = 5): AgentRecommendation[] {
  return [...networkState.recommendations]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, count);
}

// New function to create portfolio decisions
export async function createPortfolioDecision(
  action: TradeAction,
  ticker: string,
  amount: number,
  price: number,
  options: {
    stopLoss?: number;
    takeProfit?: number;
    confidence?: number;
    riskScore?: number;
    contributors?: string[];
    reasoning?: string;
  } = {}
): Promise<PortfolioDecision | null> {
  try {
    const portfolioManagerId = "portfolio-manager";
    const portfolioManager = networkState.availableAgents.find(a => a.id === portfolioManagerId);
    
    if (!portfolioManager) {
      console.error("Portfolio manager agent not found");
      return null;
    }
    
    const decision: PortfolioDecision = {
      action,
      ticker,
      amount,
      price,
      stopLoss: options.stopLoss,
      takeProfit: options.takeProfit,
      confidence: options.confidence || 70,
      riskScore: options.riskScore || 5,
      contributors: options.contributors || [portfolioManagerId],
      reasoning: options.reasoning || `Portfolio manager decision to ${action} ${ticker}`,
      timestamp: new Date().toISOString()
    };
    
    // Add decision to state
    networkState.portfolioDecisions.push(decision);
    
    // Inform the trading executor agent
    await sendAgentMessage(
      portfolioManagerId,
      "trading-executor",
      `Execute ${action} for ${amount} ${ticker} at $${price}. Stop loss: ${decision.stopLoss}, Take profit: ${decision.takeProfit}`
    );
    
    // Update agent activity
    updateAgentActivity(portfolioManagerId);
    
    // Return the created decision
    return decision;
  } catch (error) {
    console.error("Error creating portfolio decision:", error);
    return null;
  }
}

// New function to get all portfolio decisions
export function getPortfolioDecisions(): PortfolioDecision[] {
  return networkState.portfolioDecisions;
}

// New function to get recent portfolio decisions
export function getRecentPortfolioDecisions(count: number = 5): PortfolioDecision[] {
  return [...networkState.portfolioDecisions]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, count);
}

// Enhanced collaborative trading analysis to include specialized agents
export async function generateCollaborativeTradingAnalysis(
  marketData: any, 
  primaryModelId: ModelId = 'grok3'
): Promise<string> {
  if (!networkState.isNetworkActive) {
    await initializeAgentNetwork();
  }
  
  if (!networkState.isNetworkActive) {
    throw new Error("Agent network is not active");
  }
  
  try {
    console.log(`Generating collaborative trading analysis with primary model: ${primaryModelId}`);
    
    // Get active analysis agents, prioritizing specialized agents
    const specializedAgentTypes = [
      "portfolio_manager", 
      "value_investor", 
      "technical_analyst", 
      "fundamentals_analyst", 
      "valuation_expert"
    ];
    
    // Prioritize specialized agents
    const specializedAgents = networkState.activeAgents.filter(
      agent => specializedAgentTypes.includes(agent.type)
    );
    
    // Include other analysts
    const analysts = networkState.activeAgents.filter(
      agent => agent.type === "analyst" || agent.id === primaryModelId
    );
    
    // Combine with priority given to specialized agents
    const allContributors = [...specializedAgents, ...analysts.filter(
      analyst => !specializedAgents.some(sa => sa.id === analyst.id)
    )];
    
    if (allContributors.length === 0) {
      throw new Error("No analysis agents available");
    }
    
    // Get the active agent IDs
    const activeAgentIds = networkState.activeAgents.map(agent => agent.id);
    
    // Create analysis prompt based on market data
    const analysisPrompt = `Generate a comprehensive trading analysis for the current market conditions. 
    ${marketData ? `Current price: $${marketData.price || 'unknown'}. ` : ''}
    Include insights on risk management, entry/exit points, market sentiment, and specialized perspectives from value investors, technical analysts, and fundamental analysts.`;
    
    // Initiate collaborative analysis through the coordinator
    const { data, error } = await supabase.functions.invoke('agent-network-coordinator', {
      body: { 
        action: 'coordinate_analysis',
        data: {
          prompt: analysisPrompt,
          primaryModelId: primaryModelId,
          modelIds: activeAgentIds
        }
      }
    });
    
    if (error) {
      throw error;
    }
    
    // Update local state based on coordinator response
    await syncAgentMessages();
    
    // Update agent performance statistics
    networkState.activeAgents.forEach(agent => {
      if (agent.performance) {
        agent.performance.tasksCompleted += 1;
      }
    });
    
    return data.analysis;
  } catch (error) {
    console.error("Failed to generate collaborative trading analysis:", error);
    toast({
      title: "Analysis Generation Failed",
      description: "Could not generate collaborative trading analysis. Falling back to basic analysis.",
      variant: "destructive",
    });
    
    return "Unable to generate collaborative analysis at this time. Please try again later.";
  }
}

// Function to get active collaboration agents
export function getActiveAgents(): Agent[] {
  return networkState.activeAgents;
}

// Function to get all agent messages
export function getAgentMessages(): AgentMessage[] {
  return networkState.messages;
}

// Function to get all agent tasks
export function getAgentTasks(): AgentTask[] {
  return networkState.tasks;
}

// Function to get all collaboration sessions
export async function getCollaborationSessions(): Promise<CollaborationSession[]> {
  try {
    const { data, error } = await supabase.functions.invoke('agent-network-coordinator', {
      body: { action: 'get_collaboration_sessions' }
    });
    
    if (error) {
      console.error("Failed to get collaboration sessions:", error);
      return [];
    }
    
    networkState.collaborationSessions = data.sessions;
    return data.sessions;
  } catch (error) {
    console.error("Error getting collaboration sessions:", error);
    return [];
  }
}

// Function to activate or deactivate an agent
export function toggleAgentStatus(agentId: string, isActive: boolean): boolean {
  const agent = networkState.availableAgents.find(a => a.id === agentId);
  
  if (!agent) {
    return false;
  }
  
  agent.status = isActive ? "active" : "paused";
  
  // Update active agents list
  networkState.activeAgents = networkState.availableAgents.filter(
    a => a.status === "active"
  );
  
  return true;
}
