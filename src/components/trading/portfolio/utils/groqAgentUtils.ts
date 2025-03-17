
/**
 * Utility functions for integrating with Groq-powered trading agents
 */

import { supabase } from "@/lib/supabase";

// Function to initialize Groq-powered trading agent
export const setGroqAgentInstance = async (groqAgent: any) => {
  try {
    if (!groqAgent) {
      return null;
    }
    
    console.log(`Initializing Groq-powered agent`);
    return {
      isActive: true,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error initializing Groq agent:`, error);
    return null;
  }
};

// Get enhanced recommendations from Supabase edge function
export const getEnhancedRecommendations = async (ticker: string, price: number) => {
  try {
    const { data, error } = await supabase.functions.invoke('real-crypto-data', {
      body: { action: 'analyze', symbol: ticker, price }
    });
    
    if (!error && data?.recommendations) {
      console.log("Using enhanced recommendations from real market data");
      return data.recommendations;
    }
    
    return null;
  } catch (e) {
    console.error("Error getting enhanced recommendations:", e);
    return null;
  }
};
