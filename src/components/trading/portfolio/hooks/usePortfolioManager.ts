
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { PortfolioManagerHookReturn } from '../types/portfolioTypes';
import { tradingAgents } from '../data/tradingAgents';
import { useAgentPerformance } from './useAgentPerformance';
import { usePortfolioDecisions } from './usePortfolioDecisions';
import { useMarketDataFetcher } from './useMarketDataFetcher';
import { useRecommendationGenerator } from './useRecommendationGenerator';
import { setGroqAgentInstance } from '../utils/recommendationUtils';

export const usePortfolioManager = (currentData: any): PortfolioManagerHookReturn => {
  const { toast } = useToast();
  const lastDataRef = useRef<any>(null);
  const generationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Import all the necessary hooks
  const { 
    realMarketData, 
    hasRealMarketData 
  } = useMarketDataFetcher();
  
  const {
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
  } = useRecommendationGenerator();
  
  const { 
    agentPerformance, 
    updateAgentPerformance 
  } = useAgentPerformance();
  
  const { 
    portfolioDecision, 
    riskScore, 
    generatePortfolioDecision, 
    setPortfolioDecision 
  } = usePortfolioDecisions();

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
      handleRefreshAnalysis();
    }, 300); // Debounce time
    
    // Clean up on unmount
    return () => {
      if (generationTimeoutRef.current) {
        clearTimeout(generationTimeoutRef.current);
      }
    };
  }, [currentData, agentRecommendations.length]);

  // Function to handle refreshing the analysis
  const handleRefreshAnalysis = useCallback(async () => {
    console.log("Refreshing portfolio analysis");
    setPortfolioDecision(null);
    setAgentRecommendations([]);
    
    // Generate new recommendations and collaboration data
    const result = await generateRecommendationsWithCollaboration(
      currentData, 
      tradingAgents,
      realMarketData
    );
    
    // If successful, generate a portfolio decision
    if (result) {
      setTimeout(() => {
        // Generate portfolio decision
        generatePortfolioDecision(
          result.recommendations,
          tradingAgents,
          result.accuracyMetrics,
          result.collaborationMessages,
          result.collaborationScore,
          currentData
        );
        
        // Update agent performance metrics
        updateAgentPerformance(tradingAgents, result.accuracyMetrics);
        
        setLoadingDecision(false);
      }, 1500);
    } else {
      setLoadingDecision(false);
    }
    
    toast({
      title: "Analysis Refresh Requested",
      description: "Generating new agent recommendations with collaboration",
    });
  }, [
    currentData, 
    generateRecommendationsWithCollaboration, 
    generatePortfolioDecision, 
    updateAgentPerformance, 
    setAgentRecommendations, 
    setPortfolioDecision, 
    setLoadingDecision, 
    realMarketData, 
    toast
  ]);

  // Function to handle executing a decision
  const handleExecuteDecision = useCallback((isSimulationMode: boolean) => {
    if (!portfolioDecision) return;
    
    toast({
      title: `${portfolioDecision.finalDecision} Order ${isSimulationMode ? "Simulated" : "Executed"}`,
      description: `${portfolioDecision.finalDecision} ${portfolioDecision.amount} ${portfolioDecision.ticker} at $${portfolioDecision.price}`,
      variant: "default",
    });
    
    setPortfolioDecision(null);
    setAgentRecommendations([]);
  }, [portfolioDecision, toast, setPortfolioDecision, setAgentRecommendations]);

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
    hasRealMarketData
  };
};
