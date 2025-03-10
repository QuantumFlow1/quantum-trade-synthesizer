
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
import { supabase } from "@/lib/supabase";

export const useStockbotMessages = (
  marketData: any[] = [],
  hasGroqKey: boolean,
  isSimulationMode: boolean,
  checkApiKey: CheckApiKeyFunction
) => {
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages() as ChatMessage[]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const callGroqApi = async (userMessage: string): Promise<ChatMessage> => {
    try {
      console.log('Calling Groq API for response');
      
      // Get Groq API key from localStorage if available
      const groqApiKey = localStorage.getItem('groqApiKey');
      
      // Prepare the conversation history
      const messageHistory = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));
      
      // Add the user's new message
      messageHistory.push({
        role: 'user',
        content: userMessage
      });
      
      // Add market data context to the system message
      const systemMessage = {
        role: 'system',
        content: `You are Stockbot, a helpful trading assistant that provides insights about stocks and financial markets. 
        You always give a confident, direct answer based on the available data.
        Current market data: ${JSON.stringify(marketData)}`
      };
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('groq-chat', {
        body: {
          messages: [systemMessage, ...messageHistory],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 1024
        },
        headers: groqApiKey ? { 'x-groq-api-key': groqApiKey } : undefined
      });
      
      if (error) {
        console.error('Error calling groq-chat function:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }
      
      if (!data || data.status === 'error') {
        throw new Error(data?.error || 'Invalid response from AI service');
      }
      
      return {
        id: crypto.randomUUID(),
        sender: 'system',
        role: 'assistant',
        content: data.response,
        text: data.response,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error in callGroqApi:', error);
      throw error;
    }
  };

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
          responseMessage = await callGroqApi(inputMessage);
        }
      }

      const finalMessages = [...updatedMessages, responseMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      // Add error message to the chat
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'system',
        role: 'assistant',
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
  }, [inputMessage, messages, marketData, isSimulationMode, hasGroqKey, checkApiKey]);

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
