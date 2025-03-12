
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  AgentRecommendation, 
  PortfolioDecision, 
  TradeAction 
} from '@/types/agent';
import { 
  executePortfolioAnalysis,
  submitTradeRecommendation 
} from '@/services/agentNetwork';

export function useMarketAnalysis(user: any) {
  const { toast } = useToast();
  const [currentMarketData, setCurrentMarketData] = useState<any | null>(null);
  const [agentRecommendations, setAgentRecommendations] = useState<AgentRecommendation[]>([]);
  const [recentAgentRecommendations, setRecentAgentRecommendations] = useState<AgentRecommendation[]>([]);
  const [portfolioDecisions, setPortfolioDecisions] = useState<PortfolioDecision[]>([]);
  const [recentPortfolioDecisions, setRecentPortfolioDecisions] = useState<PortfolioDecision[]>([]);

  const generateAnalysis = useCallback(async (ticker: string, timeframe: string) => {
    if (!user || !ticker) return;
    
    try {
      const result = await executePortfolioAnalysis(ticker, timeframe);
      
      if (result) {
        setAgentRecommendations(result.recommendations || []);
        setRecentAgentRecommendations(result.recentRecommendations || []);
        setPortfolioDecisions(result.portfolioDecisions || []);
        setRecentPortfolioDecisions(result.recentPortfolioDecisions || []);
        
        toast({
          title: 'Analysis Complete',
          description: `${ticker} analysis for ${timeframe} completed successfully`,
        });
      }
    } catch (error) {
      console.error('Failed to generate analysis:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Could not generate market analysis',
        variant: 'destructive',
      });
    }
  }, [user, toast]);

  const submitRecommendation = useCallback(async (ticker: string, action: TradeAction, confidence: number) => {
    if (!user || !ticker || !action) return null;
    
    try {
      const result = await submitTradeRecommendation(ticker, action, confidence);
      
      if (result) {
        toast({
          title: 'Recommendation Submitted',
          description: `${action} recommendation for ${ticker} submitted successfully`,
        });
        
        return result;
      }
    } catch (error) {
      console.error('Failed to submit recommendation:', error);
      toast({
        title: 'Recommendation Failed',
        description: 'Could not submit trading recommendation',
        variant: 'destructive',
      });
    }
    
    return null;
  }, [user, toast]);

  return {
    currentMarketData,
    setCurrentMarketData,
    agentRecommendations,
    recentAgentRecommendations,
    portfolioDecisions,
    recentPortfolioDecisions,
    generateAnalysis,
    submitRecommendation
  };
}
