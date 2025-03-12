import { 
  AgentDetails, 
  TradeAction,
  AgentMessage as AgentMessageType,
  AgentTask as AgentTaskType,
  CollaborationSession as CollaborationSessionType,
  PortfolioDecision as PortfolioDecisionType,
  AgentRecommendation as AgentRecommendationType
} from '@/types/agent';

// Mock data for agents
const mockAgents: AgentDetails[] = [
  {
    id: 'value-investor-001',
    name: 'Value Investor',
    description: 'Focuses on undervalued assets with strong fundamentals.',
    specialization: 'Value Investing',
    confidence: 0.8,
    weight: 0.7,
    isActive: true
  },
  {
    id: 'technical-analyst-001',
    name: 'Technical Analyst',
    description: 'Analyzes price patterns and trading signals.',
    specialization: 'Technical Analysis',
    confidence: 0.75,
    weight: 0.6,
    isActive: true
  },
  {
    id: 'sentiment-analyst-001',
    name: 'Sentiment Analyst',
    description: 'Gauges market sentiment from news and social media.',
    specialization: 'Sentiment Analysis',
    confidence: 0.7,
    weight: 0.5,
    isActive: true
  },
  {
    id: 'quantitative-analyst-001',
    name: 'Quantitative Analyst',
    description: 'Uses statistical models and algorithms for trading.',
    specialization: 'Quantitative Analysis',
    confidence: 0.85,
    weight: 0.8,
    isActive: false
  },
  {
    id: 'macroeconomic-analyst-001',
    name: 'Macroeconomic Analyst',
    description: 'Assesses economic trends and their impact on markets.',
    specialization: 'Macroeconomics',
    confidence: 0.75,
    weight: 0.6,
    isActive: false
  }
];

// Mock data for agent messages
const mockAgentMessages: AgentMessageType[] = [
  {
    id: crypto.randomUUID(),
    fromAgent: 'value-investor-001',
    toAgent: 'technical-analyst-001',
    message: 'I see a strong buying opportunity in BTC based on its current valuation.',
    timestamp: new Date().toISOString(),
    read: true
  },
  {
    id: crypto.randomUUID(),
    fromAgent: 'technical-analyst-001',
    toAgent: 'value-investor-001',
    message: 'Technicals confirm the upward trend, but be cautious of resistance at $45,000.',
    timestamp: new Date().toISOString(),
    read: true
  },
  {
    id: crypto.randomUUID(),
    fromAgent: 'sentiment-analyst-001',
    toAgent: 'network',
    message: 'Market sentiment is increasingly positive, driven by recent news.',
    timestamp: new Date().toISOString(),
    read: false
  }
];

// Mock data for agent tasks
const mockAgentTasks: AgentTaskType[] = [
  {
    id: crypto.randomUUID(),
    assignedTo: 'value-investor-001',
    description: 'Research potential long-term investments in the energy sector.',
    status: 'pending',
    createdAt: new Date().toISOString(),
    completedAt: null
  },
  {
    id: crypto.randomUUID(),
    assignedTo: 'technical-analyst-001',
    description: 'Analyze recent trading volumes for TSLA and identify key levels.',
    status: 'in-progress',
    createdAt: new Date().toISOString(),
    completedAt: null
  },
  {
    id: crypto.randomUUID(),
    assignedTo: 'sentiment-analyst-001',
    description: 'Monitor social media for mentions of AAPL and assess public sentiment.',
    status: 'completed',
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString()
  }
];

// Mock data for collaboration sessions
const mockCollaborationSessions: CollaborationSessionType[] = [
  {
    id: crypto.randomUUID(),
    participants: ['value-investor-001', 'technical-analyst-001'],
    topic: 'Joint analysis of BTC',
    startTime: new Date().toISOString(),
    endTime: null,
    status: 'active'
  },
  {
    id: crypto.randomUUID(),
    participants: ['sentiment-analyst-001', 'quantitative-analyst-001'],
    topic: 'Correlating sentiment with quantitative data for ETH',
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    status: 'completed'
  }
];

// Mock function to create agent recommendations
const createAgentRecommendation = (
  agent: AgentDetails,
  ticker: string,
  action: TradeAction
): AgentRecommendationType => {
  return {
    agentId: agent.id,
    action: action,
    ticker: ticker,
    confidence: agent.confidence * 100,
    reasoning: `Based on ${agent.specialization} analysis.`,
    timestamp: new Date().toISOString()
  };
};

// Mock data for agent recommendations
const mockRecommendations: AgentRecommendationType[] = [
  createAgentRecommendation(mockAgents[0], 'BTC', 'BUY'),
  createAgentRecommendation(mockAgents[1], 'ETH', 'SELL'),
  createAgentRecommendation(mockAgents[2], 'AAPL', 'HOLD')
];

// Mock data for portfolio decisions
const mockPortfolioDecisions: PortfolioDecisionType[] = [
  {
    id: crypto.randomUUID(),
    finalDecision: 'BUY',
    ticker: 'BTC',
    amount: 0.5,
    price: 45000,
    confidence: 0.85,
    riskScore: 60,
    contributors: ['value-investor-001', 'technical-analyst-001'],
    reasoning: 'Strong consensus among value and technical analysts.',
    timestamp: new Date().toISOString(),
    recommendedActions: [],
  },
  {
    id: crypto.randomUUID(),
    finalDecision: 'SELL',
    ticker: 'ETH',
    amount: 1.0,
    price: 2500,
    confidence: 0.75,
    riskScore: 70,
    contributors: ['sentiment-analyst-001', 'quantitative-analyst-001'],
    reasoning: 'Negative sentiment and quantitative indicators suggest selling.',
    timestamp: new Date().toISOString(),
    recommendedActions: [],
  }
];

// Add the missing type exports
export type { AgentMessage, AgentTask, CollaborationSession } from '@/types/agent';

// Mock API functions
export const getAgentMessages = (): AgentMessage[] => {
  return mockAgentMessages;
};

export const getAgentTasks = (): AgentTask[] => {
  return mockAgentTasks;
};

export const initializeAgentNetwork = (): void => {
  console.log("Agent network initialized");
};

export const generateCollaborativeTradingAnalysis = (
  ticker: string,
  timeframe: string
) => {
  return {
    id: crypto.randomUUID(),
    ticker,
    timestamp: new Date().toISOString(),
    signals: []
  };
};

export const getActiveAgents = () => {
  return mockAgents.filter(agent => agent.isActive);
};

export const toggleAgentStatus = (id: string): void => {
  const agent = mockAgents.find(a => a.id === id);
  if (agent) {
    agent.isActive = !agent.isActive;
  }
};

export const sendAgentMessage = (message: string, toAgent?: string): AgentMessage => {
  const newMessage: AgentMessage = {
    id: crypto.randomUUID(),
    fromAgent: 'user',
    toAgent: toAgent || 'network',
    message,
    timestamp: new Date().toISOString(),
    read: false
  };
  mockAgentMessages.push(newMessage);
  return newMessage;
};

export const createAgentTask = (description: string, assignedTo: string): AgentTask => {
  const newTask: AgentTask = {
    id: crypto.randomUUID(),
    assignedTo,
    description,
    status: 'pending',
    createdAt: new Date().toISOString(),
    completedAt: null
  };
  mockAgentTasks.push(newTask);
  return newTask;
};

export const syncAgentMessages = (): void => {
  console.log("Syncing agent messages...");
};

export const getCollaborationSessions = () => {
  return mockCollaborationSessions;
};

export const submitAgentRecommendation = (
  agent: AgentDetails,
  ticker: string,
  action: TradeAction
) => {
  const newRecommendation = createAgentRecommendation(agent, ticker, action);
  return newRecommendation;
};

export const getAgentRecommendations = () => {
  return mockRecommendations;
};

export const getRecentAgentRecommendations = (limit: number = 5) => {
  return mockRecommendations.slice(0, limit);
};

export const getPortfolioDecisions = () => {
  return mockPortfolioDecisions;
};

export const getRecentPortfolioDecisions = (limit: number = 5) => {
  return mockPortfolioDecisions.slice(0, limit);
};
