
import { Agent, AgentRecommendation, PortfolioDecision, TradeAction } from '@/types/agent';
import { supabase } from '@/lib/supabase';

/**
 * Retrieves agents from the database or falls back to sample data
 */
export async function fetchAgents(): Promise<Agent[]> {
  try {
    console.log('Fetching agents from database...');
    
    // Try to fetch real agents from database
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
    
    if (data && data.length > 0) {
      console.log(`Retrieved ${data.length} agents from database`);
      return data as Agent[];
    }
    
    console.log('No agents found in database, using sample data');
    return getSampleAgents();
  } catch (error) {
    console.error('Exception fetching agents:', error);
    console.log('Falling back to sample agents data');
    return getSampleAgents();
  }
}

/**
 * Create a new agent in the database
 */
export async function createAgent(agent: Omit<Agent, 'id' | 'createdAt' | 'lastActive'>): Promise<Agent | null> {
  try {
    console.log('Creating new agent:', agent.name);
    
    const newAgent: Omit<Agent, 'id'> = {
      ...agent,
      status: agent.status || 'training',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('agents')
      .insert([newAgent])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
    
    console.log('New agent created successfully:', data);
    return data as Agent;
  } catch (error) {
    console.error('Exception creating agent:', error);
    return null;
  }
}

/**
 * Update an agent's status
 */
export async function updateAgentStatus(agentId: string, status: Agent['status']): Promise<boolean> {
  try {
    console.log(`Updating agent ${agentId} status to ${status}`);
    
    const { error } = await supabase
      .from('agents')
      .update({ 
        status, 
        lastActive: new Date().toISOString() 
      })
      .eq('id', agentId);
    
    if (error) {
      console.error('Error updating agent status:', error);
      throw error;
    }
    
    console.log('Agent status updated successfully');
    return true;
  } catch (error) {
    console.error('Exception updating agent status:', error);
    return false;
  }
}

/**
 * Generate a recommendation from an agent using AI
 */
export async function generateAgentRecommendation(
  agent: Agent,
  ticker: string,
  marketData: any
): Promise<AgentRecommendation | null> {
  try {
    console.log(`Generating recommendation from ${agent.name} for ${ticker}`);
    
    // Try to use edge function first
    const { data: edgeData, error: edgeError } = await supabase.functions.invoke('agent-recommendation', {
      body: {
        agentId: agent.id,
        agentType: agent.type,
        agentName: agent.name,
        ticker,
        marketData
      }
    });
    
    if (edgeError) {
      console.error('Error from agent-recommendation edge function:', edgeError);
      throw new Error(edgeError.message);
    }
    
    if (edgeData && edgeData.recommendation) {
      console.log('Received recommendation from edge function:', edgeData.recommendation);
      return edgeData.recommendation as AgentRecommendation;
    }
    
    // Fallback to simulated recommendation
    console.log('No recommendation received, falling back to simulation');
    return simulateAgentRecommendation(agent, ticker);
  } catch (error) {
    console.error('Exception in generateAgentRecommendation:', error);
    console.log('Falling back to simulated recommendation after error');
    return simulateAgentRecommendation(agent, ticker);
  }
}

/**
 * Coordinate multiple agents to make a portfolio decision
 */
export async function generatePortfolioDecision(
  agents: Agent[],
  ticker: string,
  marketData: any
): Promise<PortfolioDecision | null> {
  try {
    console.log(`Coordinating ${agents.length} agents for portfolio decision on ${ticker}`);
    
    // Get recommendations from all active agents
    const activeAgents = agents.filter(agent => agent.status === 'active');
    
    if (activeAgents.length === 0) {
      console.warn('No active agents available for portfolio decision');
      return null;
    }
    
    // Get recommendations from each agent in parallel
    const recommendationPromises = activeAgents.map(agent => 
      generateAgentRecommendation(agent, ticker, marketData)
    );
    
    const recommendations = (await Promise.all(recommendationPromises)).filter(
      (rec): rec is AgentRecommendation => rec !== null
    );
    
    if (recommendations.length === 0) {
      console.warn('No recommendations received from agents');
      return null;
    }
    
    // Try to use edge function first
    const { data: edgeData, error: edgeError } = await supabase.functions.invoke('portfolio-decision', {
      body: { recommendations, ticker }
    });
    
    if (edgeError) {
      console.error('Error from portfolio-decision edge function:', edgeError);
      throw new Error(edgeError.message);
    }
    
    if (edgeData && edgeData.decision) {
      console.log('Received portfolio decision from edge function:', edgeData.decision);
      return edgeData.decision as PortfolioDecision;
    }
    
    // Fallback to simulated decision
    console.log('No decision received, falling back to simulation');
    return simulatePortfolioDecision(recommendations, ticker);
  } catch (error) {
    console.error('Exception in generatePortfolioDecision:', error);
    console.log('Falling back to simulated portfolio decision after error');
    
    // Try to still use the recommendations if we have them
    try {
      const activeAgents = agents.filter(agent => agent.status === 'active');
      const recommendations = await Promise.all(
        activeAgents.map(agent => simulateAgentRecommendation(agent, ticker))
      );
      const validRecommendations = recommendations.filter(
        (rec): rec is AgentRecommendation => rec !== null
      );
      
      return simulatePortfolioDecision(validRecommendations, ticker);
    } catch (fallbackError) {
      console.error('Even fallback simulation failed:', fallbackError);
      return null;
    }
  }
}

// ---- Simulation Utilities ----

/**
 * Simulate a recommendation from an agent (for testing or when service is unavailable)
 */
function simulateAgentRecommendation(agent: Agent, ticker: string): AgentRecommendation {
  console.log(`Simulating recommendation from ${agent.name} for ${ticker}`);
  
  // Base confidence on agent success rate
  const baseConfidence = agent.performance?.successRate || 50;
  
  // Add some randomness
  const confidence = Math.min(
    Math.max(baseConfidence + Math.floor(Math.random() * 20) - 10, 30),
    95
  );
  
  // Determine action based on agent type and random factor
  let actions: TradeAction[] = ["BUY", "SELL", "HOLD"];
  
  // Certain agent types have tendencies toward certain actions
  if (agent.type === "value_investor") {
    actions = confidence > 70 ? ["BUY", "BUY", "BUY", "HOLD"] : ["HOLD", "HOLD", "BUY", "SELL"];
  } else if (agent.type === "technical_analyst") {
    actions = Math.random() > 0.5 ? ["BUY", "SELL", "BUY"] : ["SELL", "HOLD", "SELL"];
  } else if (agent.tradingStyle === "Momentum") {
    actions = ["BUY", "BUY", "HOLD", "SELL"];
  }
  
  const randomAction = actions[Math.floor(Math.random() * actions.length)];
  
  // Generate reasoning based on agent type and action
  let reasoning = "";
  switch (agent.type) {
    case "trader":
      reasoning = randomAction === "BUY" 
        ? `${ticker} shows a promising entry point based on current momentum.` 
        : randomAction === "SELL" 
        ? `Technical indicators suggest ${ticker} is overbought.`
        : `${ticker} is in a consolidation phase, holding is advised.`;
      break;
    case "analyst":
      reasoning = randomAction === "BUY" 
        ? `Recent financial reports for ${ticker} indicate strong growth potential.` 
        : randomAction === "SELL" 
        ? `Analysis shows declining fundamentals for ${ticker}.`
        : `Current analysis of ${ticker} shows mixed signals; maintaining position is recommended.`;
      break;
    case "portfolio_manager":
      reasoning = randomAction === "BUY" 
        ? `${ticker} would strengthen portfolio diversification with its current performance.` 
        : randomAction === "SELL" 
        ? `Portfolio rebalancing suggests reducing exposure to ${ticker}.`
        : `Current portfolio allocation for ${ticker} is optimal.`;
      break;
    case "value_investor":
      reasoning = randomAction === "BUY" 
        ? `${ticker} is trading below intrinsic value, presenting a buying opportunity.` 
        : randomAction === "SELL" 
        ? `${ticker} has reached fair value, consider taking profits.`
        : `${ticker} is fairly valued currently, maintain position.`;
      break;
    default:
      reasoning = randomAction === "BUY" 
        ? `Based on my analysis, ${ticker} presents a buying opportunity.` 
        : randomAction === "SELL" 
        ? `I recommend selling ${ticker} at current levels.`
        : `Current position in ${ticker} should be maintained.`;
  }
  
  return {
    agentId: agent.id,
    action: randomAction,
    ticker,
    confidence,
    reasoning,
    timestamp: new Date().toISOString(),
    price: Math.floor(Math.random() * 1000) + 50 // Random price for simulation
  };
}

/**
 * Simulate a portfolio decision based on multiple recommendations
 */
function simulatePortfolioDecision(
  recommendations: AgentRecommendation[],
  ticker: string
): PortfolioDecision {
  console.log(`Simulating portfolio decision for ${ticker} based on ${recommendations.length} recommendations`);
  
  // Count recommendations by action type
  const actionCounts: Record<TradeAction, number> = {
    "BUY": 0,
    "SELL": 0,
    "HOLD": 0,
    "SHORT": 0,
    "COVER": 0
  };
  
  // Calculate weighted opinions
  const weightedScores: Record<TradeAction, number> = {
    "BUY": 0,
    "SELL": 0,
    "HOLD": 0,
    "SHORT": 0,
    "COVER": 0
  };
  
  let totalConfidence = 0;
  
  // Process all recommendations
  recommendations.forEach(rec => {
    actionCounts[rec.action]++;
    weightedScores[rec.action] += rec.confidence;
    totalConfidence += rec.confidence;
  });
  
  // Determine the final action based on weighted scores
  let finalAction: TradeAction = "HOLD"; // Default
  let maxScore = 0;
  
  Object.entries(weightedScores).forEach(([action, score]) => {
    if (score > maxScore) {
      maxScore = score;
      finalAction = action as TradeAction;
    }
  });
  
  // Calculate overall confidence
  const averageConfidence = Math.round(totalConfidence / recommendations.length);
  
  // Generate reasoning
  const majorityPercentage = Math.round((actionCounts[finalAction] / recommendations.length) * 100);
  
  let reasoning = `${majorityPercentage}% of agents recommended to ${finalAction} ${ticker}. `;
  
  if (recommendations.length > 1) {
    reasoning += `Based on consensus among ${recommendations.length} agents, `;
    
    if (majorityPercentage > 80) {
      reasoning += `there is strong agreement to ${finalAction}.`;
    } else if (majorityPercentage > 60) {
      reasoning += `there is moderate agreement to ${finalAction}.`;
    } else {
      reasoning += `there is slight preference to ${finalAction}, though opinions are mixed.`;
    }
  } else {
    reasoning += `Decision based on a single agent recommendation with ${averageConfidence}% confidence.`;
  }
  
  // Add a sample of the reasoning from the top agent
  const topRecommendation = recommendations.sort((a, b) => b.confidence - a.confidence)[0];
  if (topRecommendation) {
    reasoning += ` Top agent reasoning: ${topRecommendation.reasoning}`;
  }
  
  return {
    id: `pd-${Date.now()}`,
    timestamp: new Date().toISOString(),
    recommendedActions: recommendations,
    finalDecision: finalAction,
    confidence: averageConfidence,
    reasoning,
    ticker,
    action: finalAction,
    amount: Math.floor(Math.random() * 5) + 1,
    price: recommendations[0]?.price || 100,
    riskScore: Math.floor(Math.random() * 10) + 1,
    stopLoss: finalAction === "BUY" ? Math.floor(Math.random() * 10) + 5 : undefined,
    takeProfit: finalAction === "BUY" ? Math.floor(Math.random() * 20) + 15 : undefined
  };
}

/**
 * Get sample agents for testing and fallback
 */
function getSampleAgents(): Agent[] {
  return [
    {
      id: "trader-alpha-1",
      name: "Alpha Trader",
      description: "Focuses on momentum trading with quick entries and exits",
      type: "trader",
      status: "active",
      lastActive: new Date().toISOString(),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      tradingStyle: "Momentum",
      performance: {
        successRate: 72,
        tradeCount: 145,
        winLossRatio: 2.1
      },
      tasks: ["Market analysis completed", "Trading strategy updated", "Performance review pending"]
    },
    {
      id: "analyst-beta-2",
      name: "Beta Analyst",
      description: "Specialized in fundamental analysis for long-term investments",
      type: "analyst",
      status: "active",
      lastActive: new Date().toISOString(),
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      specialization: "Fundamental Analysis",
      performance: {
        successRate: 68,
        tasksCompleted: 56
      },
      tasks: {
        completed: 56,
        pending: 3
      }
    },
    {
      id: "portfolio-gamma-3",
      name: "Gamma Manager",
      description: "Focuses on portfolio optimization and risk management",
      type: "portfolio_manager",
      status: "active",
      lastActive: new Date().toISOString(),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      tradingStyle: "Conservative",
      performance: {
        successRate: 81,
        tasksCompleted: 112,
        winLossRatio: 1.7
      },
      tasks: {
        completed: 112,
        pending: 5
      }
    },
    {
      id: "trader-delta-4",
      name: "Delta Swinger",
      description: "Specializes in swing trading based on market sentiment",
      type: "trader",
      status: "paused",
      lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      tradingStyle: "Swing",
      performance: {
        successRate: 65,
        tradeCount: 93,
        winLossRatio: 1.9
      },
      tasks: ["Sentiment analysis complete", "Weekend market review pending", "Strategy adjustment required"]
    },
    {
      id: "analyst-epsilon-5",
      name: "Epsilon Technician",
      description: "Expert in technical analysis using advanced chart patterns",
      type: "technical_analyst",
      status: "training",
      lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      specialization: "Chart Patterns",
      performance: {
        successRate: 59,
        tasksCompleted: 28
      },
      tasks: {
        completed: 28,
        pending: 12
      }
    },
    {
      id: "valuation-zeta-6",
      name: "Zeta Valuator",
      description: "Specializes in intrinsic value calculations and value investing",
      type: "value_investor",
      status: "active",
      lastActive: new Date().toISOString(),
      createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
      specialization: "Intrinsic Value",
      performance: {
        successRate: 77,
        tasksCompleted: 64
      },
      tasks: {
        completed: 64,
        pending: 2
      }
    }
  ];
}
