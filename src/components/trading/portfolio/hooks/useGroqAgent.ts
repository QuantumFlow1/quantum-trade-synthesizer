
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AgentRecommendation } from '../types/portfolioTypes';
import { GroqAgent, GroqAnalysisResult } from '../types/groqAgentTypes';
import { useToast } from '@/hooks/use-toast';

export const useGroqAgent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateGroqRecommendation = useCallback(async (
    marketData: any,
    agent: GroqAgent
  ): Promise<AgentRecommendation | null> => {
    if (!agent.config.enabled) {
      console.log(`Groq agent ${agent.id} is disabled`);
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Generating recommendation using Groq agent ${agent.id} for ${marketData.symbol}`);
      
      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('groq-analysis', {
        body: {
          marketData: marketData,
          config: agent.config
        }
      });
      
      if (error) {
        console.error('Error calling groq-analysis function:', error);
        setError(`Failed to get Groq analysis: ${error.message}`);
        toast({
          title: "Groq Analysis Error",
          description: error.message,
          variant: "destructive"
        });
        return null;
      }
      
      if (!data || data.status === 'error' || !data.result) {
        const errorMessage = data?.error || 'Failed to get analysis result';
        console.error('Groq analysis error:', errorMessage);
        setError(errorMessage);
        toast({
          title: "Groq Analysis Error",
          description: errorMessage,
          variant: "destructive"
        });
        return null;
      }
      
      const result = data.result as GroqAnalysisResult;
      
      // Map the Groq result to an AgentRecommendation
      const recommendation: AgentRecommendation = {
        agentId: agent.id,
        action: mapGroqActionToAgentAction(result.recommendation),
        confidence: result.confidence,
        reasoning: result.reasoning,
        timestamp: new Date().toISOString()
      };
      
      console.log(`Groq recommendation generated: ${recommendation.action} with ${recommendation.confidence}% confidence`);
      
      return recommendation;
    } catch (error) {
      console.error('Error in generateGroqRecommendation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      toast({
        title: "Groq Analysis Error",
        description: errorMessage,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Map Groq's recommendation to our trading action types
  const mapGroqActionToAgentAction = (groqAction: string): "BUY" | "SELL" | "HOLD" => {
    const action = groqAction.toUpperCase();
    if (action === "BUY") return "BUY";
    if (action === "SELL") return "SELL";
    return "HOLD";
  };

  return {
    generateGroqRecommendation,
    isLoading,
    error
  };
};
