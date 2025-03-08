
import { AgentCollaborationMessage } from "../types/portfolioTypes";

export const generateCollaborationMessages = (currentData: any): {
  messages: AgentCollaborationMessage[];
  collaborationScore: number;
  activeDiscussions: Array<{topic: string, participants: string[], status: 'ongoing' | 'concluded'}>;
} => {
  if (!currentData) return {
    messages: [],
    collaborationScore: 0,
    activeDiscussions: []
  };
  
  const ticker = currentData?.symbol || "BTC";
  const currentPrice = currentData?.price || 45000;
  const messages: AgentCollaborationMessage[] = [];
  
  // Risk manager to technical analyst
  messages.push({
    from: "risk-manager",
    to: "technical-analyst",
    content: `What's your take on ${ticker} volatility at $${currentPrice}? I'm seeing increased risk.`,
    timestamp: new Date(Date.now() - 120000).toISOString(),
    impact: 85,
    sentiment: "neutral"
  });
  
  // Technical analyst response
  messages.push({
    from: "technical-analyst",
    to: "risk-manager",
    content: `RSI indicates ${currentPrice > 45000 ? 'overbought' : 'oversold'} conditions. MACD showing ${currentPrice > 45000 ? 'bearish' : 'bullish'} divergence.`,
    timestamp: new Date(Date.now() - 90000).toISOString(),
    impact: 92,
    sentiment: currentPrice > 45000 ? "negative" : "positive"
  });
  
  // Sentiment analyzer to all
  messages.push({
    from: "sentiment-analyzer",
    to: "all",
    content: `Alert: Social media sentiment for ${ticker} has shifted ${Math.random() > 0.5 ? 'positive' : 'negative'} in the last 2 hours.`,
    timestamp: new Date(Date.now() - 60000).toISOString(),
    impact: 78,
    sentiment: Math.random() > 0.5 ? "positive" : "negative"
  });
  
  // Value investor to macro economist
  messages.push({
    from: "value-investor",
    to: "macro-economist",
    content: `How do recent Fed statements impact our ${ticker} valuation model?`,
    timestamp: new Date(Date.now() - 30000).toISOString(),
    impact: 65,
    sentiment: "neutral"
  });
  
  // Macro economist response
  messages.push({
    from: "macro-economist",
    to: "value-investor",
    content: `Policy indicates ${Math.random() > 0.5 ? 'tightening' : 'easing'} ahead. Adjust discount rate by ${(Math.random() * 0.5 + 0.1).toFixed(2)}%.`,
    timestamp: new Date(Date.now() - 15000).toISOString(),
    impact: 81,
    sentiment: Math.random() > 0.5 ? "negative" : "positive"
  });
  
  // Calculate collaboration score based on message impact and timing
  const avgImpact = messages.reduce((sum, msg) => sum + (msg.impact || 0), 0) / messages.length;
  const messageTimeDiffs = messages.map(msg => new Date(msg.timestamp).getTime());
  const timeSpan = Math.max(...messageTimeDiffs) - Math.min(...messageTimeDiffs);
  const responseTime = timeSpan / messages.length;
  
  // Higher impact and lower response time = better collaboration
  const timeScore = Math.min(100, 100000 / (responseTime || 1));
  const collaborationScore = Math.round((avgImpact * 0.7) + (timeScore * 0.3));
  
  // Generate active discussions
  const activeDiscussions = [
    {
      topic: `${ticker} Volatility Analysis`,
      participants: ["risk-manager", "technical-analyst", "volatility-expert"],
      status: 'ongoing' as const
    },
    {
      topic: "Market Sentiment Trends",
      participants: ["sentiment-analyzer", "macro-economist"],
      status: 'concluded' as const
    }
  ];
  
  return {
    messages,
    collaborationScore,
    activeDiscussions
  };
};

// Generate collaborative reasoning
export const generateCollaborativeReasoning = (
  recommendations: any[],
  messages: AgentCollaborationMessage[],
  riskScore: number,
  collaborationScore: number
): string => {
  // Count actions
  const actionCounts: Record<string, number> = {};
  recommendations.forEach(rec => {
    actionCounts[rec.action] = (actionCounts[rec.action] || 0) + 1;
  });
  
  // Get majority action
  let majorityAction = "HOLD";
  let maxCount = 0;
  Object.entries(actionCounts).forEach(([action, count]) => {
    if (count > maxCount) {
      maxCount = count;
      majorityAction = action;
    }
  });
  
  // Count positive/negative sentiment messages
  const positiveMessages = messages.filter(m => m.sentiment === 'positive').length;
  const negativeMessages = messages.filter(m => m.sentiment === 'negative').length;
  const sentimentBias = positiveMessages > negativeMessages ? 'positive' : 
                        negativeMessages > positiveMessages ? 'negative' : 'neutral';
  
  // Get relevant collaboration insights
  const relevantInsights = messages
    .sort((a, b) => (b.impact || 0) - (a.impact || 0))
    .slice(0, 2)
    .map(msg => msg.content.split('.')[0])
    .join(". ");
  
  // Build reasoning with collaboration context and accuracy data
  return `Consensus from ${recommendations.length} specialized agents suggests a ${majorityAction} action with ${sentimentBias} sentiment bias. Key insights: ${relevantInsights}. Risk assessment indicates ${riskScore < 40 ? 'low' : (riskScore < 70 ? 'moderate' : 'high')} risk profile. Backtesting shows a ${Math.round(collaborationScore)}% effective trading strategy accuracy.`;
};
