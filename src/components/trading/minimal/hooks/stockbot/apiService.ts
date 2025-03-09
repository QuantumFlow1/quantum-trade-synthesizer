
import { ChatMessage } from './types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { getSimpleApiAvailability } from "@/hooks/trading-chart/api-key-manager";

/**
 * Send a message to the Stockbot service
 */
export const sendMessageToStockbot = async (
  message: string, 
  marketData: any[] = []
): Promise<ChatMessage> => {
  console.log("Sending message to Stockbot:", message);
  
  // Get the stored API key
  const groqKey = localStorage.getItem("groqApiKey");
  
  try {
    // Check if we have a valid key
    if (!groqKey || groqKey.trim().length === 0) {
      const serverKeyAvailable = await getSimpleApiAvailability('groq', true);
      
      if (!serverKeyAvailable) {
        throw new Error("No API key available");
      }
    }
    
    // Call the trading advice function
    const responseText = await fetchTradingAdvice(
      message, 
      [], // Empty context for now
      groqKey || ''
    );
    
    // Enhance the response with market data
    const enhancedResponse = enhanceResponseWithMarketData(
      message, 
      responseText, 
      marketData
    );
    
    // Return formatted message
    return {
      id: uuidv4(),
      sender: 'assistant',
      text: enhancedResponse,
      timestamp: new Date()
    };
  } catch (error) {
    console.error("Error in sendMessageToStockbot:", error);
    
    if (error instanceof Error) {
      showApiErrorToast(error);
    }
    
    // Return an error message
    return {
      id: uuidv4(),
      sender: 'assistant',
      text: `I'm sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or check your API key configuration.`,
      timestamp: new Date()
    };
  }
};

/**
 * Makes an API call to generate trading advice via the Supabase edge function
 */
export const fetchTradingAdvice = async (
  inputMessage: string, 
  contextMessages: { role: string; content: string }[],
  groqKey: string
): Promise<string> => {
  console.log("Making real API call to Groq via Supabase edge function");
  
  if (!groqKey) {
    // First check if we have a server-side API key available
    const serverKeyAvailable = await getSimpleApiAvailability('groq', true);
    
    if (!serverKeyAvailable) {
      console.error("No Groq API key provided");
      throw new Error("Groq API key is missing. Please configure your API key.");
    }
  }
  
  try {
    // Call the Supabase edge function
    const { data, error } = await supabase.functions.invoke('generate-trading-advice', {
      body: {
        message: inputMessage,
        userLevel: 'intermediate', // Could be made configurable
        previousMessages: contextMessages
      },
      headers: groqKey ? {
        'x-groq-api-key': groqKey
      } : {} // If no client key, use server key
    });
    
    if (error) {
      console.error("Error calling generate-trading-advice function:", error);
      // More detailed error message to help with troubleshooting
      const errorDetails = error.message || "Unknown error";
      throw new Error(`API call failed: ${errorDetails}. Status: ${error.status || "unknown"}`);
    }
    
    if (data && data.response) {
      return data.response;
    } else {
      console.warn("No valid response data received from Groq API");
      return "I didn't receive a valid response from the AI. Please try again.";
    }
  } catch (error) {
    console.error("Error in fetchTradingAdvice:", error);
    
    // Check if error is due to missing API key
    if (error.message && error.message.includes("API key")) {
      // Broadcast that the API key might be invalid
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('api-key-error', {
            detail: { error: error.message }
          }));
        }
      } catch (e) {
        console.error("Error broadcasting API key error:", e);
      }
    }
    
    throw error;
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
  try {
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
        if (latestData && latestData.close && !responseContent.includes(`$${latestData.close.toFixed(2)}`)) {
          return responseContent + `\n\nRecent data shows BTC trading at $${latestData.close.toFixed(2)}.`;
        }
      }
    }
    
    return responseContent;
  } catch (error) {
    console.error("Error enhancing response with market data:", error);
    // Return original response if enhancement fails
    return responseContent;
  }
};

/**
 * Shows an error toast
 */
export const showApiErrorToast = (error: Error): void => {
  // Customize error message based on error type
  let errorMessage = error.message || "Failed to get response";
  let title = "Error";
  
  if (errorMessage.includes("API key")) {
    title = "API Key Error";
  } else if (errorMessage.includes("network") || errorMessage.includes("connection")) {
    title = "Network Error";
  } else if (errorMessage.includes("timeout")) {
    title = "Request Timeout";
  }
  
  toast({
    title: title,
    description: errorMessage,
    variant: "destructive"
  });
};
