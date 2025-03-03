
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

export interface AgentNetworkState {
  availableAgents: Agent[];
  activeAgents: Agent[];
  messages: AgentMessage[];
  tasks: AgentTask[];
  isNetworkActive: boolean;
}

// Initialize agent network state
const initialNetworkState: AgentNetworkState = {
  availableAgents: [],
  activeAgents: [],
  messages: [],
  tasks: [],
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
      }
    ];
    
    // Combine all agents
    networkState.availableAgents = [...registeredAgents, ...tradingAgents];
    
    // Set initially active agents
    networkState.activeAgents = networkState.availableAgents.filter(
      agent => agent.status === "active"
    );
    
    networkState.isNetworkActive = true;
    
    console.log(`Agent network initialized with ${networkState.activeAgents.length} active agents`);
    return true;
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
export function addAgentMessage(message: Omit<AgentMessage, 'id' | 'timestamp'>): AgentMessage {
  const newMessage: AgentMessage = {
    id: crypto.randomUUID(),
    ...message,
    timestamp: new Date()
  };
  
  networkState.messages.push(newMessage);
  
  // Update last active timestamp for both agents
  updateAgentActivity(message.fromAgent);
  updateAgentActivity(message.toAgent);
  
  return newMessage;
}

// Function to update agent activity timestamp
function updateAgentActivity(agentId: string) {
  const agent = networkState.availableAgents.find(a => a.id === agentId);
  if (agent) {
    agent.lastActive = new Date().toISOString();
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
  
  try {
    console.log(`Generating collaborative trading analysis with primary model: ${primaryModelId}`);
    
    // Get active analysis agents
    const analysts = networkState.activeAgents.filter(
      agent => agent.type === "analyst" || agent.id === primaryModelId
    );
    
    if (analysts.length === 0) {
      throw new Error("No analysis agents available");
    }
    
    // Create a new task for market analysis
    const analysisTask: AgentTask = {
      id: crypto.randomUUID(),
      agentId: primaryModelId,
      description: "Generate collaborative market analysis",
      status: 'pending',
      priority: 'high',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    networkState.tasks.push(analysisTask);
    
    // Update task status
    analysisTask.status = 'in-progress';
    analysisTask.updatedAt = new Date();
    
    // Simulate the primary agent collecting input from other agents
    for (const analyst of analysts) {
      if (analyst.id !== primaryModelId) {
        // Create a message requesting input from this agent
        addAgentMessage({
          fromAgent: primaryModelId,
          toAgent: analyst.id,
          content: `Requesting analysis input on current market conditions.`
        });
        
        // Simulate a response from this agent
        addAgentMessage({
          fromAgent: analyst.id,
          toAgent: primaryModelId,
          content: `Providing market analysis based on my specialization.`
        });
      }
    }
    
    // Now use the Supabase function to get actual AI-generated advice
    const { data, error } = await supabase.functions.invoke('generate-trading-advice', {
      body: {
        message: `Provide a comprehensive trading analysis for the current market conditions. Include insights on risk management, entry/exit points, and market sentiment.`,
        userLevel: 'intermediate',
        previousMessages: []
      }
    });
    
    if (error) {
      throw error;
    }
    
    // Update task as completed
    analysisTask.status = 'completed';
    analysisTask.result = data.response;
    analysisTask.updatedAt = new Date();
    
    // Update agent performance
    const primaryAgent = networkState.availableAgents.find(a => a.id === primaryModelId);
    if (primaryAgent && primaryAgent.performance) {
      primaryAgent.performance.tasksCompleted += 1;
    }
    
    return data.response;
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
