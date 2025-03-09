
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const useStockbotChat = (marketData: any[] = []) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(true);
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  
  // Check for API key
  const [hasApiKey, setHasApiKey] = useState(false);
  
  useEffect(() => {
    // Check API key on mount
    checkApiKey();
    
    // Listen for API key updates
    const handleApiKeyUpdate = () => {
      checkApiKey();
    };
    
    window.addEventListener('apikey-updated', handleApiKeyUpdate);
    window.addEventListener('localStorage-changed', handleApiKeyUpdate);
    
    return () => {
      window.removeEventListener('apikey-updated', handleApiKeyUpdate);
      window.removeEventListener('localStorage-changed', handleApiKeyUpdate);
    };
  }, []);

  // Function to check API key
  const checkApiKey = () => {
    const groqKey = localStorage.getItem('groqApiKey');
    const hasKey = !!groqKey;
    
    console.log("Checking Groq API key:", { 
      exists: hasKey, 
      keyLength: groqKey ? groqKey.length : 0 
    });
    
    setHasApiKey(hasKey);
    
    // If we have a key but are in simulation mode, notify the user
    if (hasKey && isSimulationMode) {
      toast({
        title: "API Key Detected",
        description: "You can now switch to real AI mode for more accurate responses.",
        duration: 5000
      });
    }
  };
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    
    try {
      // Recheck API key before responding
      const groqKey = localStorage.getItem('groqApiKey');
      const hasKey = !!groqKey;
      
      let responseContent = "";
      
      if (isSimulationMode) {
        // Simulate API response delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate a simulated response
        responseContent = getSimulatedResponse(inputMessage, marketData);
      } else if (hasKey) {
        // Make a real API call using the Supabase edge function
        console.log("Making real API call to Groq via Supabase edge function");
        
        // Prepare previous messages for context (limit to last 5 messages)
        const contextMessages = messages.slice(-5).map(msg => ({
          role: msg.role,
          content: msg.content
        }));
        
        // Call the Supabase edge function
        const { data, error } = await supabase.functions.invoke('generate-trading-advice', {
          body: {
            message: inputMessage,
            userLevel: 'intermediate', // You could make this configurable
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
          responseContent = data.response;
          
          // Add market data insights if related to markets
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
                responseContent += `\n\nRecent data shows BTC trading at $${latestData.close.toFixed(2)}.`;
              }
            }
          }
        } else {
          responseContent = "I didn't receive a valid response from the AI. Please try again.";
        }
      } else {
        // No API key but not in simulation mode
        await new Promise(resolve => setTimeout(resolve, 800));
        responseContent = "I need a Groq API key to provide real AI responses. Please configure your API key to continue.";
      }
      
      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearChat = () => {
    setMessages([]);
  };
  
  const showApiKeyDialog = () => {
    setIsKeyDialogOpen(true);
  };
  
  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    hasApiKey,
    isSimulationMode,
    setIsSimulationMode,
    handleSendMessage,
    clearChat,
    showApiKeyDialog,
    isKeyDialogOpen,
    setIsKeyDialogOpen
  };
};

// Function to generate simulated responses
function getSimulatedResponse(message: string, marketData: any[]): string {
  message = message.toLowerCase();
  
  // Price inquiry
  if (message.includes("price") || message.includes("market") || message.includes("trading at")) {
    const price = marketData.length > 0 
      ? marketData[marketData.length - 1].close 
      : Math.floor(Math.random() * 10000) + 30000;
    
    return `Based on the latest data, Bitcoin (BTC) is currently trading at $${price.toFixed(2)}. The market has been ${Math.random() > 0.5 ? "bullish" : "bearish"} over the past 24 hours.`;
  }
  
  // Trading strategy
  if (message.includes("strategy") || message.includes("trade") || message.includes("invest")) {
    return "For a solid trading strategy, consider using dollar-cost averaging (DCA) when entering positions. It's also important to set clear stop-loss levels to manage risk. Remember that diversification across multiple assets can help reduce overall portfolio volatility.";
  }
  
  // Market analysis
  if (message.includes("analysis") || message.includes("predict") || message.includes("forecast")) {
    return "Market analysis suggests that we're currently in a consolidation phase. Key support levels are around $30,500, while resistance is forming at $36,200. Trading volume has been declining, which could indicate a potential breakout in the near future.";
  }
  
  // Default response
  return "I'm your trading assistant. I can help with market analysis, trading strategies, and keeping track of cryptocurrency prices. What would you like to know about the crypto market today?";
}
