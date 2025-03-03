
import { supabase } from "@/lib/supabase";
import { AI_MODELS, ModelId } from "@/components/chat/types/GrokSettings";
import { Agent } from "@/types/agent";
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
  isNetworkActive: boolean;
}

// Initialize agent network state
const initialNetworkState: AgentNetworkState = {
  availableAgents: [],
  activeAgents: [],
  messages: [],
  tasks: [],
  collaborationSessions: [],
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
        description: "Analyzes market sentiment from news and social media",
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        performance: {
          successRate: 0.82,
          tasksCompleted: 45
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

// Function to create a collaborative trading analysis
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
    
    // Get active analysis agents
    const analysts = networkState.activeAgents.filter(
      agent => agent.type === "analyst" || agent.id === primaryModelId
    );
    
    if (analysts.length === 0) {
      throw new Error("No analysis agents available");
    }
    
    // Get the active agent IDs
    const activeAgentIds = networkState.activeAgents.map(agent => agent.id);
    
    // Create analysis prompt based on market data
    const analysisPrompt = `Generate a comprehensive trading analysis for the current market conditions. 
    ${marketData ? `Current price: $${marketData.price || 'unknown'}. ` : ''}
    Include insights on risk management, entry/exit points, and market sentiment.`;
    
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
