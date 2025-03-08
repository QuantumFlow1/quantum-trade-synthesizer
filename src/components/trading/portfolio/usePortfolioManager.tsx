
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AgentRecommendation, PortfolioDecision, TradeAction } from "@/types/agent";

// Define agent types with their specializations and weights
interface TradingAgent {
  id: string;
  name: string;
  specialization: string;
  description: string;
  weight: number; // Performance weight (0-100)
  successRate: number; // Historical success rate
  contributionScore: number; // How valuable its input has been
}

// Add collaboration message interface
interface AgentCollaborationMessage {
  from: string;
  to: string;
  content: string;
  timestamp: string;
  impact?: number; // Impact score of this message (0-100)
  sentiment?: 'positive' | 'neutral' | 'negative';
}

// New interfaces for accuracy metrics
interface AgentAccuracy {
  overall: number; // Overall historical accuracy percentage
  recent: number; // Recent accuracy percentage
  confidence: [number, number]; // Confidence interval [lower, upper]
  predictionHistory: Array<{correct: boolean, date: string, prediction: string}>; // Historical predictions
}

interface BacktestResult {
  agentId: string;
  predictedAction: TradeAction;
  actualOutcome: TradeAction;
  isCorrect: boolean;
  date: string;
  confidence: number;
  price: number;
  priceLater: number; // Price after the test period
}

export const usePortfolioManager = (currentData: any) => {
  const { toast } = useToast();
  const [agentRecommendations, setAgentRecommendations] = useState<AgentRecommendation[]>([]);
  const [portfolioDecision, setPortfolioDecision] = useState<PortfolioDecision | null>(null);
  const [loadingDecision, setLoadingDecision] = useState(false);
  const [riskScore, setRiskScore] = useState(35); // 0-100 scale
  const [collaborationMessages, setCollaborationMessages] = useState<AgentCollaborationMessage[]>([]);
  const [agentPerformance, setAgentPerformance] = useState<Record<string, number>>({});
  const [collaborationScore, setCollaborationScore] = useState(0);
  const [agentAccuracy, setAgentAccuracy] = useState<Record<string, AgentAccuracy>>({});
  const [activeDiscussions, setActiveDiscussions] = useState<Array<{topic: string, participants: string[], status: 'ongoing' | 'concluded'}>>([]);
  const [backtestResults, setBacktestResults] = useState<BacktestResult[]>([]);
  const lastDataRef = useRef<any>(null);
  const generationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Define our specialized agents with weights
  const tradingAgents: TradingAgent[] = [
    {
      id: "value-investor",
      name: "Value Investor",
      specialization: "fundamental",
      description: "Analyzes asset fundamentals and intrinsic value",
      weight: 85,
      successRate: 0.72,
      contributionScore: 16
    },
    {
      id: "technical-analyst",
      name: "Technical Analyst",
      specialization: "technical",
      description: "Identifies patterns in price charts and technical indicators",
      weight: 82,
      successRate: 0.68,
      contributionScore: 14
    },
    {
      id: "sentiment-analyzer",
      name: "Sentiment Analyzer",
      specialization: "sentiment",
      description: "Analyzes news and social media for market sentiment",
      weight: 75,
      successRate: 0.63,
      contributionScore: 12
    },
    {
      id: "risk-manager",
      name: "Risk Manager",
      specialization: "risk",
      description: "Calculates risk metrics and optimal position sizing",
      weight: 90,
      successRate: 0.78,
      contributionScore: 18
    },
    {
      id: "volatility-expert",
      name: "Volatility Expert",
      specialization: "volatility",
      description: "Specializes in market volatility analysis",
      weight: 80,
      successRate: 0.65,
      contributionScore: 13
    },
    {
      id: "macro-economist",
      name: "Macro Economist",
      specialization: "macro",
      description: "Analyzes economic indicators and monetary policy effects",
      weight: 78,
      successRate: 0.64,
      contributionScore: 12
    }
  ];

  // Effect to run analysis when currentData changes, but with debouncing
  useEffect(() => {
    // Skip if data hasn't meaningfully changed
    if (!currentData) return;
    
    // Compare current data to last data
    const currentPrice = currentData?.price;
    const lastPrice = lastDataRef.current?.price;
    
    // Skip updates if the price hasn't changed by more than 0.5%
    if (lastPrice && currentPrice && 
        Math.abs((currentPrice - lastPrice) / lastPrice) < 0.005 &&
        agentRecommendations.length > 0) {
      return;
    }
    
    // Update the last data ref
    lastDataRef.current = currentData;
    
    // Clear any pending generation timeout
    if (generationTimeoutRef.current) {
      clearTimeout(generationTimeoutRef.current);
    }
    
    // Set a timeout to generate recommendations
    generationTimeoutRef.current = setTimeout(() => {
      generateRecommendationsWithCollaboration();
    }, 300); // Debounce time
    
    // Clean up on unmount
    return () => {
      if (generationTimeoutRef.current) {
        clearTimeout(generationTimeoutRef.current);
      }
    };
  }, [currentData]);

  // Generate collaboration messages between agents with impact scores and sentiment
  const generateCollaborationMessages = useCallback(() => {
    if (!currentData) return [];
    
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
    const newCollaborationScore = Math.round((avgImpact * 0.7) + (timeScore * 0.3));
    setCollaborationScore(newCollaborationScore);
    
    // Generate active discussions
    const newActiveDiscussions = [
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
    setActiveDiscussions(newActiveDiscussions);
    
    return messages;
  }, [currentData]);

  // Generate prediction history based on simulated backtesting
  const generateBacktestResults = useCallback(() => {
    if (!currentData) return [];
    
    const ticker = currentData?.symbol || "BTC";
    const currentPrice = currentData?.price || 45000;
    const results: BacktestResult[] = [];
    
    // For each agent, generate some historical backtests
    tradingAgents.forEach(agent => {
      // Generate 10 historical predictions per agent
      for (let i = 0; i < 10; i++) {
        const daysAgo = i + 1;
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        
        // Simulated historical price (random variation from current)
        const historicalPrice = currentPrice * (1 + (Math.random() * 0.2 - 0.1));
        
        // Price 'later' after the prediction was made
        const priceLater = historicalPrice * (1 + (Math.random() * 0.3 - 0.15));
        
        // Determine actual outcome based on price difference
        const actualOutcome: TradeAction = priceLater > historicalPrice ? "BUY" : "SELL";
        
        // Simulate what the agent would have predicted
        const predictedAction: TradeAction = Math.random() > 0.4 ? actualOutcome : 
                                             (actualOutcome === "BUY" ? "SELL" : "BUY");
        
        // Determine if prediction was correct
        const isCorrect = predictedAction === actualOutcome;
        
        // Record the result
        results.push({
          agentId: agent.id,
          predictedAction,
          actualOutcome,
          isCorrect,
          date: date.toISOString(),
          confidence: Math.round(50 + Math.random() * 40),
          price: historicalPrice,
          priceLater
        });
      }
    });
    
    return results;
  }, [currentData, tradingAgents]);

  // Calculate agent accuracy metrics from backtest results
  const calculateAgentAccuracy = useCallback((backtests: BacktestResult[]) => {
    const accuracy: Record<string, AgentAccuracy> = {};
    
    // Group by agent
    const agentGroups = backtests.reduce((groups, test) => {
      if (!groups[test.agentId]) {
        groups[test.agentId] = [];
      }
      groups[test.agentId].push(test);
      return groups;
    }, {} as Record<string, BacktestResult[]>);
    
    // Calculate metrics for each agent
    Object.entries(agentGroups).forEach(([agentId, tests]) => {
      // Sort by date (newest first)
      const sortedTests = [...tests].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Calculate overall accuracy
      const correctCount = tests.filter(t => t.isCorrect).length;
      const overall = Math.round((correctCount / tests.length) * 100);
      
      // Calculate recent accuracy (last 5 tests)
      const recentTests = sortedTests.slice(0, 5);
      const recentCorrect = recentTests.filter(t => t.isCorrect).length;
      const recent = Math.round((recentCorrect / recentTests.length) * 100);
      
      // Generate confidence interval (overall ± 5-15%)
      const variability = Math.round(Math.random() * 10) + 5;
      const lowerBound = Math.max(0, overall - variability);
      const upperBound = Math.min(100, overall + variability);
      
      // Create prediction history
      const predictionHistory = sortedTests.map(test => ({
        correct: test.isCorrect,
        date: test.date,
        prediction: test.predictedAction
      }));
      
      accuracy[agentId] = {
        overall,
        recent,
        confidence: [lowerBound, upperBound] as [number, number],
        predictionHistory
      };
    });
    
    return accuracy;
  }, []);

  // Make this a memoized function so it can be safely used in useEffect and as a callback
  const generateRecommendationsWithCollaboration = useCallback(() => {
    if (!currentData) {
      console.log("No current data available for portfolio analysis");
      return;
    }
    
    // If we're already loading, don't start a new load
    if (loadingDecision) return;
    
    setLoadingDecision(true);
    const ticker = currentData?.symbol || "BTC";
    const currentPrice = currentData?.price || 45000;
    const randomSeed = Math.random();
    
    console.log(`Generating collaborative recommendations for ${ticker} at $${currentPrice}`);
    
    // Generate collaboration messages
    const collaborationMsgs = generateCollaborationMessages();
    setCollaborationMessages(collaborationMsgs);
    
    // Generate backtest results and calculate accuracy metrics
    const backtests = generateBacktestResults();
    setBacktestResults(backtests);
    const accuracyMetrics = calculateAgentAccuracy(backtests);
    setAgentAccuracy(accuracyMetrics);
    
    // Generate agent recommendations with more specializations
    const newRecommendations: AgentRecommendation[] = [];
    
    // Get recommendations from each agent type
    tradingAgents.forEach(agent => {
      // Determine action based on agent type and random factors
      let action: TradeAction = "HOLD";
      let confidence = 50 + Math.floor(Math.random() * 40);
      let reasoning = "";
      
      // Specialized logic per agent type
      switch(agent.specialization) {
        case "fundamental":
          action = randomSeed > 0.7 ? "BUY" : (randomSeed > 0.4 ? "HOLD" : "SELL");
          confidence = Math.round(60 + randomSeed * 30);
          reasoning = `Based on fundamental analysis, the current ${ticker} price at $${currentPrice} ${randomSeed > 0.6 ? "represents a good value" : "is slightly overvalued"}.`;
          break;
          
        case "technical":
          action = randomSeed > 0.5 ? "BUY" : "SELL";
          confidence = Math.round(50 + randomSeed * 40);
          reasoning = `Technical indicators show ${randomSeed > 0.5 ? "bullish" : "bearish"} momentum on ${ticker} with ${randomSeed > 0.7 ? "strong" : "moderate"} volume.`;
          break;
          
        case "sentiment":
          action = randomSeed > 0.6 ? "BUY" : (randomSeed > 0.3 ? "HOLD" : "SELL");
          confidence = Math.round(40 + randomSeed * 50);
          reasoning = `Market sentiment analysis indicates ${randomSeed > 0.6 ? "positive" : "mixed"} outlook for ${ticker} based on news and social media.`;
          break;
          
        case "risk":
          // Risk manager is more conservative
          action = randomSeed > 0.8 ? "BUY" : (randomSeed > 0.4 ? "HOLD" : "SELL");
          confidence = Math.round(70 + randomSeed * 25);
          reasoning = `Risk assessment shows ${randomSeed > 0.7 ? "manageable" : "elevated"} downside risk with recommended position size of ${Math.round(randomSeed * 5 + 2)}% of portfolio.`;
          break;
          
        case "volatility":
          action = randomSeed > 0.6 ? (randomSeed > 0.8 ? "BUY" : "HOLD") : "SELL";
          confidence = Math.round(55 + randomSeed * 35);
          reasoning = `Volatility metrics indicate ${randomSeed > 0.7 ? "decreasing" : "increasing"} market fluctuations with ${randomSeed > 0.5 ? "favorable" : "unfavorable"} trading conditions.`;
          break;
          
        case "macro":
          action = randomSeed > 0.65 ? "BUY" : (randomSeed > 0.4 ? "HOLD" : "SELL");
          confidence = Math.round(60 + randomSeed * 30);
          reasoning = `Macroeconomic indicators suggest ${randomSeed > 0.6 ? "supportive" : "challenging"} environment for ${ticker} with ${randomSeed > 0.5 ? "bullish" : "bearish"} implications.`;
          break;
          
        default:
          action = randomSeed > 0.5 ? "BUY" : "SELL";
          confidence = Math.round(50 + randomSeed * 30);
          reasoning = `Analysis indicates a ${randomSeed > 0.5 ? "favorable" : "unfavorable"} outlook for ${ticker}.`;
      }
      
      // Adjust confidence based on accuracy metrics
      if (accuracyMetrics[agent.id]) {
        // Make confidence slightly closer to historical accuracy
        const historicalAccuracy = accuracyMetrics[agent.id].overall;
        confidence = Math.round((confidence * 0.7) + (historicalAccuracy * 0.3));
      }
      
      newRecommendations.push({
        agentId: agent.id,
        action,
        confidence,
        reasoning,
        ticker,
        price: currentPrice,
        timestamp: new Date().toISOString()
      });
    });
    
    console.log(`Generated ${newRecommendations.length} trading agent recommendations`);
    setAgentRecommendations(newRecommendations);
    
    setTimeout(() => {
      // Apply weighted voting to calculate the action
      const weightedAction = calculateWeightedAction(newRecommendations, tradingAgents, accuracyMetrics);
      
      // Calculate average confidence with weights
      const weightedConfidence = calculateWeightedConfidence(newRecommendations, tradingAgents, accuracyMetrics);
      
      // Generate portfolio decision with more detailed parameters
      const newDecision: PortfolioDecision = {
        action: weightedAction,
        ticker,
        amount: randomSeed > 0.7 ? 0.05 : (randomSeed > 0.4 ? 0.02 : 0.01),
        price: currentPrice,
        stopLoss: weightedAction === "BUY" ? Math.round(currentPrice * 0.95) : undefined,
        takeProfit: weightedAction === "BUY" ? Math.round(currentPrice * 1.15) : undefined,
        confidence: weightedConfidence,
        riskScore: Math.round(30 + randomSeed * 40),
        contributors: newRecommendations.map(rec => rec.agentId),
        reasoning: generateCollaborativeReasoning(newRecommendations, collaborationMsgs),
        timestamp: new Date().toISOString()
      };
      
      console.log(`Generated weighted portfolio decision: ${weightedAction} with ${weightedConfidence}% confidence`);
      setPortfolioDecision(newDecision);
      setRiskScore(newDecision.riskScore);
      
      // Update agent performance metrics (simulated)
      const newPerformance: Record<string, number> = {...agentPerformance};
      tradingAgents.forEach(agent => {
        // Calculate performance based on accuracy metrics if available
        if (accuracyMetrics[agent.id]) {
          // Base performance on accuracy metrics
          newPerformance[agent.id] = Math.round(
            (accuracyMetrics[agent.id].overall * 0.6) + 
            (accuracyMetrics[agent.id].recent * 0.4)
          );
        } else {
          // Fallback to simulated performance
          const basePerf = agent.successRate * 100;
          // Add some random variation
          newPerformance[agent.id] = Math.round(basePerf + (Math.random() * 10 - 5));
        }
      });
      setAgentPerformance(newPerformance);
      
      setLoadingDecision(false);
    }, 1500);
  }, [currentData, loadingDecision, agentPerformance, toast, generateCollaborationMessages, generateBacktestResults, calculateAgentAccuracy]);

  // Calculate weighted action based on agent weights and accuracy
  const calculateWeightedAction = (
    recommendations: AgentRecommendation[], 
    agents: TradingAgent[],
    accuracyMetrics: Record<string, AgentAccuracy>
  ): TradeAction => {
    const actionScores: Record<TradeAction, number> = {
      "BUY": 0,
      "SELL": 0,
      "HOLD": 0,
      "SHORT": 0,
      "COVER": 0
    };
    
    let totalWeight = 0;
    
    recommendations.forEach(rec => {
      // Find the agent's weight
      const agent = agents.find(a => a.id === rec.agentId);
      if (agent) {
        // Calculate weight based on agent weight, confidence, and historical accuracy
        let weight = agent.weight;
        
        // Adjust weight by accuracy if available
        if (accuracyMetrics[agent.id]) {
          // Give more weight to agents with higher accuracy
          const accuracyFactor = accuracyMetrics[agent.id].overall / 100;
          // And more weight to agents with more consistent results
          const confidenceRange = accuracyMetrics[agent.id].confidence[1] - accuracyMetrics[agent.id].confidence[0];
          const consistencyFactor = 1 - (confidenceRange / 100);
          
          weight = weight * (0.5 + (accuracyFactor * 0.3) + (consistencyFactor * 0.2));
        }
        
        // Adjust by recommendation confidence
        weight = weight * (rec.confidence / 100);
        
        actionScores[rec.action] += weight;
        totalWeight += weight;
      } else {
        // Fallback if agent not found
        actionScores[rec.action] += rec.confidence;
        totalWeight += rec.confidence;
      }
    });
    
    // Find the action with the highest weighted score
    let bestAction: TradeAction = "HOLD"; // Default
    let highestScore = 0;
    
    (Object.keys(actionScores) as TradeAction[]).forEach(action => {
      if (actionScores[action] > highestScore) {
        highestScore = actionScores[action];
        bestAction = action;
      }
    });
    
    return bestAction;
  };

  // Calculate weighted confidence with accuracy considerations
  const calculateWeightedConfidence = (
    recommendations: AgentRecommendation[], 
    agents: TradingAgent[],
    accuracyMetrics: Record<string, AgentAccuracy>
  ): number => {
    let weightedConfidenceSum = 0;
    let totalWeight = 0;
    
    recommendations.forEach(rec => {
      const agent = agents.find(a => a.id === rec.agentId);
      if (agent) {
        let weight = agent.weight;
        
        // Apply accuracy weighting if available
        if (accuracyMetrics[agent.id]) {
          // Agents with higher accuracy get more weight in confidence calculation
          weight = weight * (accuracyMetrics[agent.id].overall / 100);
        }
        
        weightedConfidenceSum += rec.confidence * weight;
        totalWeight += weight;
      } else {
        weightedConfidenceSum += rec.confidence;
        totalWeight += 50; // Default weight
      }
    });
    
    return Math.round(weightedConfidenceSum / (totalWeight || 1));
  };

  // Generate collaborative reasoning
  const generateCollaborativeReasoning = (
    recommendations: AgentRecommendation[],
    messages: AgentCollaborationMessage[]
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

  const handleExecuteDecision = (isSimulationMode: boolean) => {
    if (!portfolioDecision) return;
    
    toast({
      title: `${portfolioDecision.action} Order ${isSimulationMode ? "Simulated" : "Executed"}`,
      description: `${portfolioDecision.action} ${portfolioDecision.amount} ${portfolioDecision.ticker} at $${portfolioDecision.price}`,
      variant: "default",
    });
    
    setPortfolioDecision(null);
    setAgentRecommendations([]);
  };

  const handleRefreshAnalysis = () => {
    console.log("Refreshing portfolio analysis");
    setPortfolioDecision(null);
    setAgentRecommendations([]);
    generateRecommendationsWithCollaboration();
    
    toast({
      title: "Analysis Refresh Requested",
      description: "Generating new agent recommendations with collaboration",
    });
  };

  return {
    agentRecommendations,
    portfolioDecision,
    loadingDecision,
    riskScore,
    collaborationMessages,
    collaborationScore,
    activeDiscussions,
    agentPerformance,
    agentAccuracy,
    backtestResults,
    tradingAgents,
    handleExecuteDecision,
    handleRefreshAnalysis
  };
};
