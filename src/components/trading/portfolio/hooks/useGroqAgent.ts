
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
      
      // Get API key from local storage if available
      const groqApiKey = localStorage.getItem('groqApiKey');
      
      // Include API key in the request if available
      const config = {
        ...agent.config,
        apiKey: groqApiKey || undefined
      };
      
      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('groq-analysis', {
        body: {
          marketData: marketData,
          config: config
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
        
        // Return a fallback recommendation when the API fails
        return generateFallbackRecommendation(agent, marketData);
      }
      
      // Check if we got a fallback response
      if (data?.source === 'fallback') {
        console.log('Received fallback response from Groq service');
        toast({
          title: "Using Simulated Analysis",
          description: "The Groq AI service is unavailable. Using simulated market analysis instead.",
          variant: "warning"
        });
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
        
        // Return a fallback recommendation when the response is invalid
        return generateFallbackRecommendation(agent, marketData);
      }
      
      const result = data.result as GroqAnalysisResult;
      
      // Map the Groq result to an AgentRecommendation
      const recommendation: AgentRecommendation = {
        agentId: agent.id,
        action: mapGroqActionToAgentAction(result.recommendation),
        ticker: marketData.symbol || "BTC",  // Add ticker from marketData
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
      
      // Return a fallback recommendation when an exception occurs
      return generateFallbackRecommendation(agent, marketData);
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
  
  // Generate a fallback recommendation when the API fails
  const generateFallbackRecommendation = (agent: GroqAgent, marketData: any): AgentRecommendation => {
    // Generate a pseudo-random but somewhat sensible recommendation
    const randomFactor = Math.random();
    const priceChange = marketData?.change24h || 0;
    const ticker = marketData?.symbol || "BTC";
    
    let action: "BUY" | "SELL" | "HOLD";
    let confidence: number;
    
    if (priceChange > 2 && randomFactor > 0.4) {
      // Positive market movement
      action = "BUY";
      confidence = 60 + Math.floor(randomFactor * 20);
    } else if (priceChange < -2 && randomFactor > 0.4) {
      // Negative market movement
      action = "SELL";
      confidence = 60 + Math.floor(randomFactor * 20);
    } else {
      // Neutral or uncertain
      action = "HOLD";
      confidence = 50 + Math.floor(randomFactor * 20);
    }
    
    return {
      agentId: agent.id,
      action,
      ticker,
      confidence,
      reasoning: `Based on analysis of market conditions for ${ticker}, the recommendation is to ${action.toLowerCase()}. This is a fallback recommendation due to API unavailability.`,
      timestamp: new Date().toISOString()
    };
  };

  return {
    generateGroqRecommendation,
    isLoading,
    error
  };
};
