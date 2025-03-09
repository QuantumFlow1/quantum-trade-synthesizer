
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ChatMessage } from "./types";
import { getSimulatedResponse } from "./responseSimulator";

export const useStockbotApi = (
  marketData: any[],
  messages: ChatMessage[],
  setMessages: (messages: ChatMessage[]) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  const handleSendMessage = async (inputMessage: string, isSimulationMode: boolean) => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
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

  return { handleSendMessage };
};
