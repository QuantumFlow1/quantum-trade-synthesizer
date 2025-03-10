
import { useState, useCallback } from "react";
import { 
  ChatMessage, 
  StockbotMessage,
  StockbotMessageRole,
  CheckApiKeyFunction 
} from "./types";
import { generateStockbotResponse } from "./responseSimulator";
import { toast } from "@/hooks/use-toast";
import { loadMessages, saveMessages } from "./storage";

// Update the function signature to accept a promise-returning function
export const useStockbotMessages = (
  marketData: any[] = [],
  hasGroqKey: boolean,
  isSimulationMode: boolean,
  checkApiKey: CheckApiKeyFunction
) => {
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages() as ChatMessage[]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;

    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      role: 'user',
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
      if (isSimulationMode) {
        responseMessage = generateStockbotResponse(inputMessage, marketData);
      } else {
        const apiKeyValid = await checkApiKey();
        if (!apiKeyValid) {
          toast({
            title: "API Key Required",
            description: "Please configure your Groq API key to use the AI features.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        // For now, just simulate a response for non-simulation mode as well
        // This will be replaced with actual API calls in a future update
        responseMessage = generateStockbotResponse(inputMessage, marketData);
        
        // Add a delay to simulate network latency
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const finalMessages = [...updatedMessages, responseMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, messages, marketData, isSimulationMode, checkApiKey]);

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
