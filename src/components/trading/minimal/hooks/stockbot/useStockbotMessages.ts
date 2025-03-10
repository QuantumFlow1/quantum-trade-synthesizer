import { useState, useCallback } from "react";
import { 
  StockbotMessage, 
  StockbotMessageRole,
  CheckApiKeyFunction 
} from "./types";
import { generateSimulatedResponse } from "./responseSimulator";
import { sendMessageToAPI } from "./apiService";
import { getStoredMessages, storeMessages } from "./storage";
import { toast } from "@/hooks/use-toast";

// Update the function signature to accept a promise-returning function
export const useStockbotMessages = (
  marketData: any[] = [],
  hasGroqKey: boolean,
  isSimulationMode: boolean,
  checkApiKey: CheckApiKeyFunction
) => {
  const [messages, setMessages] = useState<StockbotMessage[]>(getStoredMessages());
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;

    setIsLoading(true);
    const userMessage: StockbotMessage = {
      role: StockbotMessageRole.User,
      content: inputMessage,
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    storeMessages(updatedMessages);
    setInputMessage("");

    try {
      let responseContent: string;
      if (isSimulationMode) {
        responseContent = generateSimulatedResponse(marketData, inputMessage);
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
        responseContent = await sendMessageToAPI(updatedMessages, marketData);
      }

      const botMessage: StockbotMessage = {
        role: StockbotMessageRole.Bot,
        content: responseContent,
      };
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      storeMessages(finalMessages);
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
    storeMessages([]);
  }, []);

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    handleSendMessage,
    clearChat
  };
};
