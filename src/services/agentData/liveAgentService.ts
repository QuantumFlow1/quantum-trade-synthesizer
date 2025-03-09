
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { Agent, AgentRecommendation, TradeAction } from "@/types/agent";

// Sample trading styles for agents
const tradingStyles = [
  "Value Investing",
  "Growth Investing",
  "Momentum Trading",
  "Swing Trading",
  "Day Trading",
  "Position Trading",
  "Scalping",
  "Technical Analysis",
  "Fundamental Analysis",
  "Contrarian Investing"
];

// Agent types for diversification
const agentTypes = [
  "receptionist",
  "advisor",
  "trader",
  "analyst",
  "portfolio_manager",
  "value_investor",
  "technical_analyst",
  "fundamentals_analyst",
  "valuation_expert"
];

/**
 * Service for managing live agent data
 */
export class LiveAgentService {
  private agents: Agent[] = [];
  private recommendations: AgentRecommendation[] = [];
  private updateInterval: number | null = null;
  private listeners: ((agents: Agent[]) => void)[] = [];
  private recommendationListeners: ((recommendations: AgentRecommendation[]) => void)[] = [];
  
  constructor() {
    this.initializeAgents();
  }
  
  /**
   * Initialize agents with generated data
   */
  private initializeAgents() {
    // Generate sample agents
    const numAgents = 5 + Math.floor(Math.random() * 5); // 5-9 agents
    
    this.agents = Array.from({ length: numAgents }, (_, i) => {
      const agentType = agentTypes[Math.floor(Math.random() * agentTypes.length)];
      const tradingStyle = tradingStyles[Math.floor(Math.random() * tradingStyles.length)];
      const successRate = 50 + Math.floor(Math.random() * 40); // 50-90% success rate
      
      return {
        id: `agent-${i + 1}`,
        name: `Trading Agent ${i + 1}`,
        status: Math.random() > 0.2 ? "active" : "paused",
        type: agentType as any,
        specialization: Math.random() > 0.5 ? "Crypto" : "Stocks",
        description: `AI trading agent specializing in ${tradingStyle}`,
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(),
        tradingStyle,
        performance: {
          successRate,
          tasksCompleted: Math.floor(Math.random() * 1000),
          winLossRatio: (Math.random() * 2 + 0.5).toFixed(2)
        }
      };
    });
    
    // Generate initial recommendations
    this.generateRecommendations();
    
    // Start periodic updates
    this.startLiveUpdates();
  }
  
  /**
   * Start periodic live updates
   */
  startLiveUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    // Update every 10-20 seconds
    this.updateInterval = window.setInterval(() => {
      this.generateRecommendations();
      this.notifyRecommendationListeners();
      
      // Occasionally update agent stats
      if (Math.random() > 0.7) {
        this.updateAgentStats();
        this.notifyListeners();
      }
    }, 10000 + Math.random() * 10000) as unknown as number;
  }
  
  /**
   * Stop live updates
   */
  stopLiveUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
  
  /**
   * Update agent statistics randomly
   */
  private updateAgentStats() {
    const agentIndex = Math.floor(Math.random() * this.agents.length);
    const agent = this.agents[agentIndex];
    
    if (agent && agent.performance) {
      // Random adjustment to success rate (-2% to +2%)
      const rateChange = (Math.random() * 4 - 2);
      agent.performance.successRate = Math.min(95, Math.max(40, agent.performance.successRate + rateChange));
      
      // Increment tasks completed
      agent.performance.tasksCompleted += 1;
      
      // Update last active time
      agent.lastActive = new Date().toISOString();
    }
  }
  
  /**
   * Generate new recommendations from agents
   */
  private generateRecommendations() {
    const activeAgents = this.agents.filter(agent => agent.status === "active");
    
    // Clear old recommendations
    this.recommendations = [];
    
    // Generate 1-3 new recommendations
    const numRecommendations = 1 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numRecommendations; i++) {
      const agent = activeAgents[Math.floor(Math.random() * activeAgents.length)];
      if (!agent) continue;
      
      const actions: TradeAction[] = ["BUY", "SELL", "HOLD"];
      const action = actions[Math.floor(Math.random() * actions.length)];
      
      const tickers = ["BTC", "ETH", "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"];
      const ticker = tickers[Math.floor(Math.random() * tickers.length)];
      
      const confidence = 50 + Math.floor(Math.random() * 45); // 50-95%
      
      this.recommendations.push({
        agentId: agent.id,
        action,
        confidence,
        reasoning: `Based on ${agent.tradingStyle} analysis, ${ticker} is showing ${action === "BUY" ? "bullish" : action === "SELL" ? "bearish" : "neutral"} signals with ${confidence}% confidence.`,
        ticker,
        price: 100 + Math.random() * 900,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  /**
   * Get all active agents
   */
  getAgents(): Agent[] {
    return [...this.agents];
  }
  
  /**
   * Get agent by ID
   */
  getAgentById(id: string): Agent | undefined {
    return this.agents.find(agent => agent.id === id);
  }
  
  /**
   * Get latest recommendations
   */
  getRecommendations(): AgentRecommendation[] {
    return [...this.recommendations];
  }
  
  /**
   * Add a listener for agent updates
   */
  addListener(callback: (agents: Agent[]) => void) {
    this.listeners.push(callback);
    // Immediately notify with current data
    callback([...this.agents]);
  }
  
  /**
   * Remove a listener
   */
  removeListener(callback: (agents: Agent[]) => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }
  
  /**
   * Add a recommendation listener
   */
  addRecommendationListener(callback: (recommendations: AgentRecommendation[]) => void) {
    this.recommendationListeners.push(callback);
    // Immediately notify with current data
    callback([...this.recommendations]);
  }
  
  /**
   * Remove a recommendation listener
   */
  removeRecommendationListener(callback: (recommendations: AgentRecommendation[]) => void) {
    this.recommendationListeners = this.recommendationListeners.filter(listener => listener !== callback);
  }
  
  /**
   * Notify all listeners of agent updates
   */
  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.agents]));
  }
  
  /**
   * Notify all recommendation listeners
   */
  private notifyRecommendationListeners() {
    this.recommendationListeners.forEach(listener => listener([...this.recommendations]));
  }
  
  /**
   * Connect to the agent network
   */
  async connectToAgentNetwork(): Promise<boolean> {
    try {
      // In a real implementation, this would connect to your Supabase edge function
      /*
      const { data, error } = await supabase.functions.invoke('agent-network-coordinator', {
        body: { action: 'connect' }
      });
      
      if (error) throw error;
      */
      
      // For demo purposes, just return success
      toast({
        title: "Connected to Agent Network",
        description: "Successfully connected to the trading agent network.",
        duration: 3000,
      });
      
      return true;
    } catch (error) {
      console.error('Error connecting to agent network:', error);
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect to agent network",
        variant: "destructive",
        duration: 5000,
      });
      
      return false;
    }
  }
}

// Create a singleton instance
export const liveAgentService = new LiveAgentService();
