
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { ChatMessage } from "./types";

/**
 * Makes an API call to generate trading advice via the Supabase edge function
 */
export const fetchTradingAdvice = async (
  inputMessage: string, 
  contextMessages: { role: string; content: string }[],
  groqKey: string
): Promise<string> => {
  console.log("Making real API call to Groq via Supabase edge function");
  
  // Call the Supabase edge function
  const { data, error } = await supabase.functions.invoke('generate-trading-advice', {
    body: {
      message: inputMessage,
      userLevel: 'intermediate', // Could be made configurable
      previousMessages: contextMessages
    },
    headers: {
      'x-groq-api-key': groqKey
    }
  });
  
  if (error) {
    console.error("Error calling generate-trading-advice function:", error);
    throw new Error(`API call failed: ${error.message}`);
  }
  
  if (data && data.response) {
    return data.response;
  } else {
    return "I didn't receive a valid response from the AI. Please try again.";
  }
};

/**
 * Enhances the response with market data insights when applicable
 */
export const enhanceResponseWithMarketData = (
  inputMessage: string,
  responseContent: string,
  marketData: any[]
): string => {
  // Only enhance if the question is market-related
  if (
    inputMessage.toLowerCase().includes("market") || 
    inputMessage.toLowerCase().includes("price") ||
    inputMessage.toLowerCase().includes("bitcoin") ||
    inputMessage.toLowerCase().includes("crypto") ||
    inputMessage.toLowerCase().includes("chart")
  ) {
    // Include market data in the response if available
    if (marketData && marketData.length > 0) {
      const latestData = marketData[marketData.length - 1];
      
      // Only append market data if not already mentioned in the response
      if (!responseContent.includes(`$${latestData.close.toFixed(2)}`)) {
        return responseContent + `\n\nRecent data shows BTC trading at $${latestData.close.toFixed(2)}.`;
      }
    }
  }
  
  return responseContent;
};

/**
 * Shows an error toast
 */
export const showApiErrorToast = (error: Error): void => {
  toast({
    title: "Error",
    description: error.message || "Failed to get response",
    variant: "destructive"
  });
};
