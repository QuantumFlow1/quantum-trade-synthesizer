// Generate simulated collaboration messages between agents
export const generateCollaborationMessages = (currentData: any) => {
  const ticker = currentData?.symbol || "BTC";
  const currentPrice = currentData?.price || 45000;
  
  // Generate a random collaboration score (0-100)
  const collaborationScore = Math.floor(60 + Math.random() * 40);
  
  // Agent IDs for messages
  const agentIds = [
    "value-investor", 
    "technical-analyst", 
    "sentiment-analyzer", 
    "risk-manager", 
    "volatility-expert"
  ];
  
  // Predefined message templates for different sentiment types
  const messageTemplates = {
    bullish: [
      `The price pattern for ${ticker} shows a potential breakout at $${currentPrice}.`,
      `I'm seeing strong support levels around $${Math.floor(currentPrice * 0.92)}.`,
      `Technical indicators suggest an upward momentum for ${ticker}.`,
      `The sentiment analysis on social media is largely positive for ${ticker}.`,
      `Recent price action indicates diminishing selling pressure.`
    ],
    bearish: [
      `${ticker} appears to be forming a bearish pattern at $${currentPrice}.`,
      `I detect resistance levels around $${Math.floor(currentPrice * 1.08)}.`,
      `Technical indicators suggest a possible reversal for ${ticker}.`,
      `Social sentiment has turned cautious regarding ${ticker}.`,
      `The volatility metrics indicate increasing selling pressure.`
    ],
    neutral: [
      `Current data suggests ${ticker} is in a consolidation phase around $${currentPrice}.`,
      `The market is showing mixed signals for ${ticker} at this price point.`,
      `We need to monitor the support level at $${Math.floor(currentPrice * 0.95)}.`,
      `Risk-reward ratio is balanced at the current price.`,
      `Trading volume indicates sideways movement for now.`
    ]
  };
  
  // Topic ideas for discussions
  const discussionTopics = [
    `${ticker} Support Levels`,
    `Volatility Analysis`,
    `Market Sentiment Review`,
    `Risk Assessment`,
    `Technical Pattern Analysis`,
    `Price Target Consensus`
  ];
  
  // Generate random number of messages (3-7)
  const messageCount = 3 + Math.floor(Math.random() * 5);
  const messages = [];
  
  // Keep track of which agent has sent a message to which other agent
  const messageSent: Record<string, string[]> = {};
  
  for (let i = 0; i < messageCount; i++) {
    // Select random agents for from/to
    const fromIndex = Math.floor(Math.random() * agentIds.length);
    let toIndex = Math.floor(Math.random() * agentIds.length);
    
    // Avoid sending message to self
    while (toIndex === fromIndex) {
      toIndex = Math.floor(Math.random() * agentIds.length);
    }
    
    const fromAgent = agentIds[fromIndex];
    const toAgent = Math.random() > 0.7 ? "all" : agentIds[toIndex];
    
    // Initialize tracking array if needed
    if (!messageSent[fromAgent]) {
      messageSent[fromAgent] = [];
    }
    
    // Skip if this agent has already sent to the recipient (to avoid duplicates)
    if (messageSent[fromAgent].includes(toAgent) && Math.random() > 0.3) {
      continue;
    }
    
    messageSent[fromAgent].push(toAgent);
    
    // Select message sentiment based on current data and random factor
    const randomSentiment = Math.random();
    const priceTrend = currentData?.trend || 0;
    
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    let messageType: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    
    if (priceTrend > 0.2 || randomSentiment > 0.7) {
      messageType = 'bullish';
      sentiment = 'positive';
    } else if (priceTrend < -0.2 || randomSentiment < 0.3) {
      messageType = 'bearish';
      sentiment = 'negative';
    } else {
      messageType = 'neutral';
      sentiment = 'neutral';
    }
    
    // Select a random message from the appropriate template
    const messagePool = messageTemplates[messageType];
    const messageContent = messagePool[Math.floor(Math.random() * messagePool.length)];
    
    // Generate timestamp within the last 10 minutes
    const timestamp = new Date(Date.now() - Math.floor(Math.random() * 600000)).toISOString();
    
    // Calculate an impact score (higher for messages that align with the trend)
    let impact = 30 + Math.floor(Math.random() * 50);
    if ((messageType === 'bullish' && priceTrend > 0) || 
        (messageType === 'bearish' && priceTrend < 0)) {
      impact += 20;
    }
    impact = Math.min(impact, 100);
    
    messages.push({
      from: fromAgent,
      to: toAgent,
      content: messageContent,
      timestamp,
      impact,
      sentiment
    });
  }
  
  // Sort messages by timestamp
  messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  // Generate active discussions based on the agents and messages
  const discussionCount = 1 + Math.floor(Math.random() * 2);
  const activeDiscussions = [];
  
  for (let i = 0; i < discussionCount; i++) {
    const topic = discussionTopics[Math.floor(Math.random() * discussionTopics.length)];
    const participantCount = 2 + Math.floor(Math.random() * 3);
    const participants = [];
    
    // Randomly select participants
    const availableAgents = [...agentIds];
    for (let j = 0; j < participantCount; j++) {
      if (availableAgents.length === 0) break;
      const randomIndex = Math.floor(Math.random() * availableAgents.length);
      participants.push(availableAgents[randomIndex]);
      availableAgents.splice(randomIndex, 1);
    }
    
    activeDiscussions.push({
      topic,
      participants,
      status: Math.random() > 0.3 ? 'ongoing' : 'concluded'
    });
  }
  
  return {
    messages,
    collaborationScore,
    activeDiscussions
  };
};
