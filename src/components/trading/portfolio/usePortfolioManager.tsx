
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AgentRecommendation, PortfolioDecision, TradeAction } from "@/types/agent";

export const usePortfolioManager = (currentData: any) => {
  const { toast } = useToast();
  const [agentRecommendations, setAgentRecommendations] = useState<AgentRecommendation[]>([]);
  const [portfolioDecision, setPortfolioDecision] = useState<PortfolioDecision | null>(null);
  const [loadingDecision, setLoadingDecision] = useState(false);
  const [riskScore, setRiskScore] = useState(35); // 0-100 scale
  const lastDataRef = useRef<any>(null);
  const generationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      generateSimulatedRecommendations();
    }, 300); // Debounce time
    
    // Clean up on unmount
    return () => {
      if (generationTimeoutRef.current) {
        clearTimeout(generationTimeoutRef.current);
      }
    };
  }, [currentData]);

  // Make this a memoized function so it can be safely used in useEffect and as a callback
  const generateSimulatedRecommendations = useCallback(() => {
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
    
    console.log(`Generating recommendations for ${ticker} at $${currentPrice}`);
    
    const newRecommendations: AgentRecommendation[] = [
      {
        agentId: "value-investor-001",
        action: randomSeed > 0.7 ? "BUY" : (randomSeed > 0.4 ? "HOLD" : "SELL"),
        confidence: Math.round(60 + randomSeed * 30),
        reasoning: `Based on fundamental analysis, the current ${ticker} price at $${currentPrice} ${randomSeed > 0.6 ? "represents a good value" : "is slightly overvalued"}.`,
        ticker,
        price: currentPrice,
        timestamp: new Date().toISOString()
      },
      {
        agentId: "technical-analyst-001",
        action: randomSeed > 0.5 ? "BUY" : "SELL",
        confidence: Math.round(50 + randomSeed * 40),
        reasoning: `Technical indicators show ${randomSeed > 0.5 ? "bullish" : "bearish"} momentum on ${ticker} with ${randomSeed > 0.7 ? "strong" : "moderate"} volume.`,
        ticker,
        price: currentPrice,
        timestamp: new Date().toISOString()
      },
      {
        agentId: "sentiment-analyst-001",
        action: randomSeed > 0.6 ? "BUY" : (randomSeed > 0.3 ? "HOLD" : "SELL"),
        confidence: Math.round(40 + randomSeed * 50),
        reasoning: `Market sentiment analysis indicates ${randomSeed > 0.6 ? "positive" : "mixed"} outlook for ${ticker} based on news and social media.`,
        ticker,
        price: currentPrice,
        timestamp: new Date().toISOString()
      }
    ];
    
    console.log(`Generated ${newRecommendations.length} agent recommendations`);
    setAgentRecommendations(newRecommendations);
    
    setTimeout(() => {
      const majorityAction = calculateMajorityAction(newRecommendations);
      const averageConfidence = Math.round(
        newRecommendations.reduce((sum, rec) => sum + rec.confidence, 0) / newRecommendations.length
      );
      
      const newDecision: PortfolioDecision = {
        action: majorityAction,
        ticker,
        amount: randomSeed > 0.7 ? 0.05 : (randomSeed > 0.4 ? 0.02 : 0.01),
        price: currentPrice,
        stopLoss: majorityAction === "BUY" ? Math.round(currentPrice * 0.95) : undefined,
        takeProfit: majorityAction === "BUY" ? Math.round(currentPrice * 1.15) : undefined,
        confidence: averageConfidence,
        riskScore: Math.round(30 + randomSeed * 40),
        contributors: newRecommendations.map(rec => rec.agentId),
        reasoning: `Consensus among ${newRecommendations.length} specialized agents suggests a ${majorityAction} action with ${averageConfidence}% confidence.`,
        timestamp: new Date().toISOString()
      };
      
      console.log(`Generated portfolio decision: ${majorityAction} with ${averageConfidence}% confidence`);
      setPortfolioDecision(newDecision);
      setRiskScore(newDecision.riskScore);
      setLoadingDecision(false);
    }, 1500);
  }, [currentData, loadingDecision, toast]);

  const calculateMajorityAction = (recommendations: AgentRecommendation[]): TradeAction => {
    const actionCounts: Record<TradeAction, number> = {
      "BUY": 0,
      "SELL": 0,
      "HOLD": 0,
      "SHORT": 0,
      "COVER": 0
    };
    
    recommendations.forEach(rec => {
      actionCounts[rec.action]++;
    });
    
    let majorityAction: TradeAction = "HOLD";
    let maxCount = 0;
    
    (Object.keys(actionCounts) as TradeAction[]).forEach(action => {
      if (actionCounts[action] > maxCount) {
        maxCount = actionCounts[action];
        majorityAction = action;
      }
    });
    
    return majorityAction;
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
    generateSimulatedRecommendations();
    
    toast({
      title: "Analysis Refresh Requested",
      description: "Generating new agent recommendations and portfolio decision",
    });
  };

  return {
    agentRecommendations,
    portfolioDecision,
    loadingDecision,
    riskScore,
    handleExecuteDecision,
    handleRefreshAnalysis
  };
};
