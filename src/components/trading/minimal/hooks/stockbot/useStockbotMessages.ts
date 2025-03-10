
import { useState, useCallback } from "react";
import { 
  ChatMessage, 
  StockbotMessage,
  CheckApiKeyFunction,
} from "./types";
import { generateStockbotResponse } from "./responseSimulator";
import { toast } from "@/hooks/use-toast";
import { loadMessages, saveMessages } from "./storage";
import { useGroqApiCall } from "./useGroqApiCall";
import { useToolCallProcessor } from "./useToolCallProcessor";

export const useStockbotMessages = (
  marketData: any[] = [],
  hasGroqKey: boolean,
  isSimulationMode: boolean,
  checkApiKey: CheckApiKeyFunction
) => {
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages() as ChatMessage[]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { callGroqApi } = useGroqApiCall();
  const { processToolCalls } = useToolCallProcessor();

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;

    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user' as 'user', // Explicitly cast to ensure correct type
      role: 'user' as 'user',
      content: inputMessage,
      text: inputMessage,
      timestamp: new Date()
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setInputMessage("");

    try {
      let responseMessage: ChatMessage;
      let toolCalls: any[] | undefined;
      
      // Only use simulation mode if explicitly set or if there's no API key
      if (isSimulationMode || !hasGroqKey) {
        console.log('Using simulation mode for StockBot response');
        responseMessage = generateStockbotResponse(inputMessage, marketData);
      } else {
        // Double-check API key availability (may have changed)
        const apiKeyValid = await checkApiKey();
        
        if (!apiKeyValid) {
          console.warn('API key check failed, falling back to simulation');
          responseMessage = generateStockbotResponse(inputMessage, marketData);
          
          toast({
            title: "API Key Required",
            description: "Using simulated response. Configure your Groq API key for AI-powered responses.",
            variant: "warning",
          });
        } else {
          // Use the Groq API
          const result = await callGroqApi(inputMessage, messages);
          responseMessage = result.message;
          toolCalls = result.toolCalls;
        }
      }

      let finalMessages = [...updatedMessages, responseMessage];
      
      // Process any tool calls if they exist
      if (toolCalls && toolCalls.length > 0) {
        console.log('Processing tool calls:', toolCalls);
        const toolMessages = await processToolCalls(toolCalls);
        
        if (toolMessages.length > 0) {
          finalMessages = [...finalMessages, ...toolMessages];
        }
      }
      
      setMessages(finalMessages);
      saveMessages(finalMessages);
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      // Add error message to the chat
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'system' as 'system', // Explicitly cast to ensure correct type
        role: 'assistant' as 'assistant',
        content: `I'm sorry, I encountered an error processing your request. Please try again later.`,
        text: `I'm sorry, I encountered an error processing your request. Please try again later.`,
        timestamp: new Date()
      };
      
      setMessages([...updatedMessages, errorMessage]);
      saveMessages([...updatedMessages, errorMessage]);
      
      toast({
        title: "Error",
        description: error.message || "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, messages, marketData, isSimulationMode, hasGroqKey, checkApiKey, callGroqApi, processToolCalls]);

  const clearChat = useCallback(() => {
    setMessages([]);
    saveMessages([]);
  }, []);

  return {
    messages: messages as StockbotMessage[],
    inputMessage,
    setInputMessage,
    isLoading,
    handleSendMessage,
    clearChat
  };
};
