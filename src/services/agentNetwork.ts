import { AgentRecommendation, PortfolioDecision, TradeAction } from '@/types/agent';

// Agent network service for managing communication between trading agents
export class AgentNetworkService {
  private agents: Map<string, any> = new Map();
  private connections: Map<string, string[]> = new Map();
  private messageQueue: any[] = [];
  private isProcessing: boolean = false;

  constructor() {
    this.initializeNetwork();
  }

  private initializeNetwork() {
    console.log("Initializing agent network...");
    // Set up default connections between agents
    this.connections.set('ai-trader-001', ['technical-analyst-002', 'fundamental-analyst-001']);
    this.connections.set('technical-analyst-002', ['ai-trader-001', 'risk-manager-001']);
    this.connections.set('fundamental-analyst-001', ['ai-trader-001', 'market-researcher-001']);
    this.connections.set('risk-manager-001', ['technical-analyst-002', 'portfolio-manager-001']);
    this.connections.set('market-researcher-001', ['fundamental-analyst-001', 'news-analyzer-001']);
    this.connections.set('portfolio-manager-001', ['risk-manager-001', 'ai-trader-001']);
    this.connections.set('news-analyzer-001', ['market-researcher-001', 'sentiment-analyzer-001']);
    this.connections.set('sentiment-analyzer-001', ['news-analyzer-001', 'ai-trader-001']);
  }

  public registerAgent(agentId: string, agentInstance: any) {
    this.agents.set(agentId, agentInstance);
    if (!this.connections.has(agentId)) {
      this.connections.set(agentId, []);
    }
    console.log(`Agent ${agentId} registered with the network`);
    return true;
  }

  public connectAgents(sourceId: string, targetId: string) {
    if (!this.agents.has(sourceId) || !this.agents.has(targetId)) {
      console.error(`Cannot connect: one or both agents not registered`);
      return false;
    }

    const connections = this.connections.get(sourceId) || [];
    if (!connections.includes(targetId)) {
      connections.push(targetId);
      this.connections.set(sourceId, connections);
      console.log(`Connected ${sourceId} to ${targetId}`);
    }
    return true;
  }

  public async sendMessage(fromAgentId: string, toAgentId: string, message: any) {
    if (!this.agents.has(fromAgentId) || !this.agents.has(toAgentId)) {
      console.error(`Cannot send message: one or both agents not registered`);
      return false;
    }

    const connections = this.connections.get(fromAgentId) || [];
    if (!connections.includes(toAgentId)) {
      console.error(`Cannot send message: agents are not connected`);
      return false;
    }

    this.messageQueue.push({
      from: fromAgentId,
      to: toAgentId,
      content: message,
      timestamp: new Date().toISOString()
    });

    if (!this.isProcessing) {
      await this.processMessageQueue();
    }
    return true;
  }

  public async broadcast(fromAgentId: string, message: any) {
    if (!this.agents.has(fromAgentId)) {
      console.error(`Cannot broadcast: agent not registered`);
      return false;
    }

    const connections = this.connections.get(fromAgentId) || [];
    for (const targetId of connections) {
      this.messageQueue.push({
        from: fromAgentId,
        to: targetId,
        content: message,
        timestamp: new Date().toISOString()
      });
    }

    if (!this.isProcessing) {
      await this.processMessageQueue();
    }
    return true;
  }

  private async processMessageQueue() {
    this.isProcessing = true;
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      const targetAgent = this.agents.get(message.to);
      if (targetAgent && typeof targetAgent.receiveMessage === 'function') {
        try {
          await targetAgent.receiveMessage(message.from, message.content);
        } catch (error) {
          console.error(`Error processing message to ${message.to}:`, error);
        }
      }
    }
    this.isProcessing = false;
  }

  public getConnectedAgents(agentId: string): string[] {
    return this.connections.get(agentId) || [];
  }

  public getNetworkTopology() {
    const topology: Record<string, string[]> = {};
    for (const [agentId, connections] of this.connections.entries()) {
      topology[agentId] = [...connections];
    }
    return topology;
  }
}

// Singleton instance
export const agentNetwork = new AgentNetworkService();

// Ergens in een functie waar er een portfolio decision object wordt gemaakt
export function createPortfolioDecision(action: TradeAction, ticker: string, price: number): PortfolioDecision {
  return {
    id: crypto.randomUUID(),
    action,
    finalDecision: action,
    ticker,
    amount: 0.5,
    price,
    stopLoss: price * 0.95,
    takeProfit: price * 1.1,
    confidence: 75,
    riskScore: 45,
    contributors: ['ai-trader-001', 'technical-analyst-002'],
    reasoning: `Recommendation to ${action} ${ticker} based on technical analysis and market trends.`,
    timestamp: new Date().toISOString(),
    recommendedActions: []
  };
}

// Helper function to create agent recommendations
export function createAgentRecommendation(
  agentId: string, 
  action: TradeAction, 
  ticker: string, 
  confidence: number, 
  reasoning: string
): AgentRecommendation {
  return {
    agentId,
    action,
    ticker,
    confidence,
    reasoning,
    timestamp: new Date().toISOString()
  };
}

// Function to aggregate recommendations from multiple agents
export function aggregateRecommendations(recommendations: AgentRecommendation[]): PortfolioDecision | null {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  // Count votes for each action
  const votes: Record<TradeAction, number> = {
    BUY: 0,
    SELL: 0,
    HOLD: 0,
    SHORT: 0,
    COVER: 0
  };

  // Calculate weighted confidence
  let totalConfidence = 0;
  const ticker = recommendations[0].ticker;
  const contributors: string[] = [];

  recommendations.forEach(rec => {
    votes[rec.action] += rec.confidence;
    totalConfidence += rec.confidence;
    if (!contributors.includes(rec.agentId)) {
      contributors.push(rec.agentId);
    }
  });

  // Find the action with the highest vote
  let finalAction: TradeAction = 'HOLD';
  let maxVotes = 0;

  for (const [action, voteCount] of Object.entries(votes)) {
    if (voteCount > maxVotes) {
      maxVotes = voteCount;
      finalAction = action as TradeAction;
    }
  }

  // Calculate average confidence
  const avgConfidence = Math.round(totalConfidence / recommendations.length);

  // Simulate a price based on the ticker (in a real app, this would come from market data)
  const price = ticker === 'BTC' ? 45000 : ticker === 'ETH' ? 3000 : 100;

  return {
    id: crypto.randomUUID(),
    action: finalAction,
    finalDecision: finalAction,
    ticker,
    amount: 0.1,
    price,
    confidence: avgConfidence,
    riskScore: 50,
    contributors,
    reasoning: `Aggregated recommendation based on ${recommendations.length} agent inputs with ${avgConfidence}% confidence.`,
    timestamp: new Date().toISOString(),
    recommendedActions: recommendations.slice(0, 3)
  };
}
