
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AgentRecommendation, TradingAgent } from '../types/portfolioTypes';
import { generateCollaborationMessages } from '../utils/collaborationUtils';
import { generateBacktestResults, calculateAgentAccuracy } from '../utils/backtestingUtils';
import { generateAgentRecommendations } from '../utils/recommendationUtils';

export const useRecommendationGenerator = () => {
  const { toast } = useToast();
  const [agentRecommendations, setAgentRecommendations] = useState<AgentRecommendation[]>([]);
  const [loadingDecision, setLoadingDecision] = useState(false);
  const [collaborationMessages, setCollaborationMessages] = useState<any[]>([]);
  const [collaborationScore, setCollaborationScore] = useState(0);
  const [activeDiscussions, setActiveDiscussions] = useState<any[]>([]);
  const [backtestResults, setBacktestResults] = useState<any[]>([]);
  const [agentAccuracy, setAgentAccuracy] = useState<Record<string, any>>({});

  // Generate recommendations with collaboration
  const generateRecommendationsWithCollaboration = useCallback(async (
    currentData: any,
    tradingAgents: TradingAgent[],
    realMarketData: any[] = []
  ) => {
    if (!currentData) {
      console.log("No current data available for portfolio analysis");
      return null;
    }
    
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
      // Generate agent recommendations - properly awaiting the Promise
      const newRecommendations = await generateAgentRecommendations(
        currentData, 
        tradingAgents,
        accuracyMetrics,
        realMarketData.length > 0 ? realMarketData : undefined
      );
      
      console.log(`Generated ${newRecommendations.length} trading agent recommendations`);
      setAgentRecommendations(newRecommendations);
      
      // Return all the generated data for portfolio decision creation
      return {
        recommendations: newRecommendations,
        collaborationMessages: collaborationMsgs,
        collaborationScore: newCollaborationScore,
        accuracyMetrics
      };
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setAgentRecommendations([]);
      toast({
        title: "Error generating recommendations",
        description: "Failed to generate agent recommendations. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      // Note: We don't set loadingDecision to false here because the portfolio decision
      // generation will happen after this, and we'll set it to false after that completes
    }
  }, [toast]);

  return {
    agentRecommendations,
    setAgentRecommendations,
    loadingDecision,
    setLoadingDecision,
    collaborationMessages,
    collaborationScore,
    activeDiscussions,
    agentAccuracy,
    backtestResults,
    generateRecommendationsWithCollaboration
  };
};
