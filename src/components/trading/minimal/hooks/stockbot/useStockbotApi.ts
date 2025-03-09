
import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "./types";
import { getSimulatedResponse } from "./responseSimulator";
import { 
  fetchTradingAdvice,
  enhanceResponseWithMarketData,
  showApiErrorToast
} from "./apiService";

export const useStockbotApi = (
  marketData: any[],
  messages: ChatMessage[],
  setMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void,
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
    
    setMessages((prev: ChatMessage[]) => [...prev, userMessage]);
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
        // Prepare previous messages for context (limit to last 5 messages)
        const contextMessages = messages.slice(-5).map(msg => ({
          role: msg.role,
          content: msg.content
        }));
        
        // Make the API call to get a response
        responseContent = await fetchTradingAdvice(inputMessage, contextMessages, groqKey);
        
        // Enhance the response with market data if relevant
        responseContent = enhanceResponseWithMarketData(inputMessage, responseContent, marketData);
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
      
      setMessages((prev: ChatMessage[]) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      
      setMessages((prev: ChatMessage[]) => [...prev, errorMessage]);
      
      // Show error toast
      showApiErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSendMessage };
};
