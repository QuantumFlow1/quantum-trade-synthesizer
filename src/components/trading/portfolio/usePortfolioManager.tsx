
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { PortfolioManagerHookReturn, AgentRecommendation } from './types/portfolioTypes';
import { tradingAgents } from './data/tradingAgents';
import { generateCollaborationMessages } from './utils/collaborationUtils';
import { generateBacktestResults, calculateAgentAccuracy } from './utils/backtestingUtils';
import { generateAgentRecommendations, setGroqAgentInstance } from './utils/recommendationUtils';
import { useAgentPerformance } from './hooks/useAgentPerformance';
import { usePortfolioDecisions } from './hooks/usePortfolioDecisions';
import { supabase } from "@/lib/supabase";

export const usePortfolioManager = (currentData: any): PortfolioManagerHookReturn => {
  const { toast } = useToast();
  const [agentRecommendations, setAgentRecommendations] = useState<AgentRecommendation[]>([]);
  const [loadingDecision, setLoadingDecision] = useState(false);
  const [collaborationMessages, setCollaborationMessages] = useState([]);
  const [collaborationScore, setCollaborationScore] = useState(0);
  const [agentAccuracy, setAgentAccuracy] = useState({});
  const [activeDiscussions, setActiveDiscussions] = useState([]);
  const [backtestResults, setBacktestResults] = useState([]);
  const [realMarketData, setRealMarketData] = useState<any[]>([]);
  const { agentPerformance, updateAgentPerformance } = useAgentPerformance();
  const { 
    portfolioDecision, 
    riskScore, 
    generatePortfolioDecision, 
    setPortfolioDecision 
  } = usePortfolioDecisions();
  
  const lastDataRef = useRef<any>(null);
  const generationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch real market data for backtesting
  const fetchRealMarketData = useCallback(async () => {
    try {
      console.log("Fetching real market data for backtesting portfolio strategies...");
      
      const { data, error } = await supabase.functions.invoke('real-crypto-data');
      
      if (error) {
        console.error("Error fetching real market data:", error);
        return;
      }
      
      if (data && data.success && Array.isArray(data.data)) {
        console.log("Successfully fetched real market data for backtesting:", data.data.length, "items");
        setRealMarketData(data.data);
        toast({
          title: "Real Market Data Ready",
          description: `Loaded ${data.data.length} market data points for backtesting`,
          duration: 3000
        });
      }
    } catch (err) {
      console.error("Failed to fetch real market data:", err);
    }
  }, [toast]);

  // Effect to fetch real market data on mount
  useEffect(() => {
    fetchRealMarketData();
    
    // Set up an interval to refresh market data periodically
    const intervalId = setInterval(fetchRealMarketData, 60000); // refresh every minute
    
    return () => clearInterval(intervalId);
  }, [fetchRealMarketData]);

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

  // Make this a memoized function so it can be safely used in useEffect and as a callback
  const generateRecommendationsWithCollaboration = useCallback(async () => {
    if (!currentData) {
      console.log("No current data available for portfolio analysis");
      return;
    }
    
    // If we're already loading, don't start a new load
    if (loadingDecision) return;
    
    setLoadingDecision(true);
    const ticker = currentData?.symbol || "BTC";
    const currentPrice = currentData?.price || 45000;
    
    console.log(`Generating collaborative recommendations for ${ticker} at $${currentPrice}`);
    
    // Generate collaboration messages
    const { 
      messages: collaborationMsgs, 
      collaborationScore: newCollaborationScore,
      activeDiscussions: newActiveDiscussions 
    } = generateCollaborationMessages(currentData);
    
    setCollaborationMessages(collaborationMsgs);
    setCollaborationScore(newCollaborationScore);
    setActiveDiscussions(newActiveDiscussions);
    
    // Generate backtest results and calculate accuracy metrics
    // Now using real market data if available
    const backtests = generateBacktestResults(
      currentData, 
      tradingAgents,
      realMarketData.length > 0 ? realMarketData : undefined
    );
    
    setBacktestResults(backtests);
    const accuracyMetrics = calculateAgentAccuracy(backtests);
    setAgentAccuracy(accuracyMetrics);
    
    try {
      // Generate agent recommendations - now properly awaiting the Promise
      const newRecommendations = await generateAgentRecommendations(
        currentData, 
        tradingAgents,
        accuracyMetrics,
        realMarketData.length > 0 ? realMarketData : undefined
      );
      
      console.log(`Generated ${newRecommendations.length} trading agent recommendations`);
      setAgentRecommendations(newRecommendations);
      
      setTimeout(() => {
        // Generate portfolio decision
        generatePortfolioDecision(
          newRecommendations,
          tradingAgents,
          accuracyMetrics,
          collaborationMsgs,
          newCollaborationScore,
          currentData
        );
        
        // Update agent performance metrics
        updateAgentPerformance(tradingAgents, accuracyMetrics);
        
        setLoadingDecision(false);
      }, 1500);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setAgentRecommendations([]);
      setLoadingDecision(false);
      toast({
        title: "Error generating recommendations",
        description: "Failed to generate agent recommendations. Please try again.",
        variant: "destructive",
      });
    }
  }, [currentData, loadingDecision, generatePortfolioDecision, updateAgentPerformance, toast, realMarketData]);

  const handleExecuteDecision = useCallback((isSimulationMode: boolean) => {
    if (!portfolioDecision) return;
    
    toast({
      title: `${portfolioDecision.action} Order ${isSimulationMode ? "Simulated" : "Executed"}`,
      description: `${portfolioDecision.action} ${portfolioDecision.amount} ${portfolioDecision.ticker} at $${portfolioDecision.price}`,
      variant: "default",
    });
    
    setPortfolioDecision(null);
    setAgentRecommendations([]);
  }, [portfolioDecision, toast, setPortfolioDecision]);

  const handleRefreshAnalysis = useCallback(() => {
    console.log("Refreshing portfolio analysis");
    setPortfolioDecision(null);
    setAgentRecommendations([]);
    generateRecommendationsWithCollaboration();
    
    toast({
      title: "Analysis Refresh Requested",
      description: "Generating new agent recommendations with collaboration",
    });
  }, [generateRecommendationsWithCollaboration, toast]);

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
    handleRefreshAnalysis,
    realMarketData,
    hasRealMarketData: realMarketData.length > 0
  };
};
