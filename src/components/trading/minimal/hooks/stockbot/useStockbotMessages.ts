
import { useState, useCallback } from "react";
import { 
  ChatMessage, 
  StockbotMessage,
  CheckApiKeyFunction,
} from "./types";
import { toast } from "@/hooks/use-toast";
import { loadMessages, saveMessages } from "./storage";
import { useGroqApiCall } from "./useGroqApiCall";
import { useToolCallProcessor } from "./useToolCallProcessor";

export const useStockbotMessages = (
  marketData: any[] = [],
  hasGroqKey: boolean
) => {
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages() as ChatMessage[]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  
  const { callGroqApi } = useGroqApiCall();
  const { processToolCalls } = useToolCallProcessor();

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;

    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user' as 'user',
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
      
      if (!hasGroqKey) {
        console.warn('API key check failed, unable to proceed');
        
        responseMessage = {
          id: crypto.randomUUID(),
          sender: 'system' as 'system',
          role: 'assistant' as 'assistant',
          content: "I need an API key to connect to Groq and provide responses. Please configure your API key to continue.",
          text: "I need an API key to connect to Groq and provide responses. Please configure your API key to continue.",
          timestamp: new Date()
        };
        
        toast({
          title: "API Key Required",
          description: "Please configure your Groq API key to use Stockbot.",
          variant: "warning",
        });
      } else {
        // Use the Groq API
        try {
          console.log('Attempting to call Groq API with valid key');
          const result = await callGroqApi(inputMessage, messages);
          responseMessage = result.message;
          toolCalls = result.toolCalls;
          // Reset error count on successful call
          setErrorCount(0);
        } catch (apiError) {
          console.error('Error from Groq API:', apiError);
          // Increment error count
          const newErrorCount = errorCount + 1;
          setErrorCount(newErrorCount);
          
          if (newErrorCount >= 3) {
            // After 3 consecutive errors, show error toast
            toast({
              title: "API Connection Issues",
              description: "Multiple API errors detected. Please check your connection or API key.",
              variant: "destructive",
              duration: 6000
            });
          }
          
          // Create error message
          responseMessage = {
            id: crypto.randomUUID(),
            sender: 'system' as 'system',
            role: 'assistant' as 'assistant',
            content: `I'm sorry, I encountered an error connecting to the Groq API. ${apiError.message || ''}`,
            text: `I'm sorry, I encountered an error connecting to the Groq API. ${apiError.message || ''}`,
            timestamp: new Date()
          };
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
        sender: 'system' as 'system',
        role: 'assistant' as 'assistant',
        content: `I'm sorry, I encountered an error processing your request. ${error.message || 'Please try again later.'}`,
        text: `I'm sorry, I encountered an error processing your request. ${error.message || 'Please try again later.'}`,
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
  }, [inputMessage, messages, marketData, hasGroqKey, callGroqApi, processToolCalls, errorCount]);

  const clearChat = useCallback(() => {
    setMessages([]);
    saveMessages([]);
    setErrorCount(0);
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
