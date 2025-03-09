
import { AgentRecommendation, TradingAgent } from "../types/portfolioTypes";
import { GroqAgent } from "../types/groqAgentTypes";
import { useGroqAgent } from "../hooks/useGroqAgent";

// Add Groq agent instance - will be initialized when used
let groqAgentInstance: ReturnType<typeof useGroqAgent> | null = null;

export const generateAgentRecommendations = async (
  currentData: any,
  agents: TradingAgent[],
  accuracyMetrics: Record<string, any>
): Promise<AgentRecommendation[]> => {
  const recommendations: AgentRecommendation[] = [];
  
  // Process each agent to generate recommendations
  for (const agent of agents) {
    // Handle special case for Groq agent
    if ('type' in agent && agent.type === 'groq') {
      if (groqAgentInstance) {
        try {
          console.log("Generating recommendation from Groq agent");
          const groqRecommendation = await groqAgentInstance.generateGroqRecommendation(
            currentData,
            agent as GroqAgent
          );
          
          if (groqRecommendation) {
            recommendations.push(groqRecommendation);
          }
        } catch (error) {
          console.error("Error generating Groq recommendation:", error);
        }
      } else {
        console.log("Skipping Groq agent because it's not initialized");
      }
      continue;
    }
    
    // Generate standard agent recommendations
    const accuracy = accuracyMetrics[agent.id] ? accuracyMetrics[agent.id].overall / 100 : 0.5;
    const confidenceAdjustment = Math.random() * 0.2 - 0.1; // -10% to +10%
    const confidence = Math.min(Math.max(Math.round(agent.confidence * (accuracy + confidenceAdjustment)), 30), 95);
    
    // Determine action based on price movement and agent specialty
    let action: "BUY" | "SELL" | "HOLD";
    const priceChange = currentData?.change24h || 0;
    const random = Math.random();
    
    if (agent.specialization === "fundamental") {
      // Value investors tend to buy on dips if fundamentals are strong
      action = random > 0.6 ? "BUY" : 
               random > 0.2 ? "HOLD" : "SELL";
    } else if (agent.specialization === "technical") {
      // Technical analysts follow trends
      action = priceChange > 1.5 ? "BUY" : 
               priceChange < -1.5 ? "SELL" : "HOLD";
    } else if (agent.specialization === "sentiment") {
      // Sentiment analysis is more volatile
      action = random > 0.7 ? "BUY" : 
               random > 0.4 ? "HOLD" : "SELL";
    } else if (agent.specialization === "risk") {
      // Risk managers tend to be conservative
      action = random > 0.8 ? "BUY" : 
               random > 0.4 ? "HOLD" : "SELL";
    } else if (agent.specialization === "volatility") {
      // Volatility experts look for big moves
      action = Math.abs(priceChange) > 3 ? (priceChange > 0 ? "BUY" : "SELL") : "HOLD";
    } else if (agent.specialization === "macro") {
      // Macro economists take a broader view
      action = random > 0.6 ? "HOLD" : 
               random > 0.3 ? "BUY" : "SELL";
    } else {
      // Default behavior
      action = random > 0.6 ? "BUY" : 
               random > 0.3 ? "SELL" : "HOLD";
    }
    
    // Generate reasoning based on agent type and action
    let reasoning = "";
    if (action === "BUY") {
      reasoning = `Based on ${agent.specialization} analysis, market conditions favor accumulation at current price levels.`;
    } else if (action === "SELL") {
      reasoning = `${agent.specialization} indicators suggest downside pressure, recommending reducing exposure.`;
    } else {
      reasoning = `Current market conditions indicate a neutral stance from a ${agent.specialization} perspective.`;
    }
    
    recommendations.push({
      agentId: agent.id,
      action,
      confidence,
      reasoning,
      timestamp: new Date().toISOString()
    });
  }
  
  return recommendations;
};

// Make the groqAgentInstance setter available for components to use
export const setGroqAgentInstance = (instance: ReturnType<typeof useGroqAgent>) => {
  groqAgentInstance = instance;
};
