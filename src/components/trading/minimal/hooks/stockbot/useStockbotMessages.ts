import { useState, useCallback, useRef, useEffect } from "react";
import { 
  StockbotMessage,
  StockbotToolCall
} from "./types";
import { toast } from "@/hooks/use-toast";
import { loadMessages, saveMessages } from "./storage";
import { useGroqApiCall } from "./useGroqApiCall";
import { useToolCallProcessor } from "./useToolCallProcessor";

export const useStockbotMessages = (
  marketData: any[] = [],
  hasGroqKey: boolean
) => {
  const [messages, setMessages] = useState<StockbotMessage[]>(loadMessages() as StockbotMessage[]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  
  const messagesRef = useRef(messages);
  const isLoadingRef = useRef(false);
  
  useEffect(() => {
    messagesRef.current = messages;
    isLoadingRef.current = isLoading;
  }, [messages, isLoading]);
  
  const { callGroqApi } = useGroqApiCall();
  const { processToolCalls } = useToolCallProcessor();

  const activeRequestRef = useRef<AbortController | null>(null);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoadingRef.current) return;

    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
    }
    
    activeRequestRef.current = new AbortController();
    setIsLoading(true);
    isLoadingRef.current = true;
    
    const userMessage: StockbotMessage = {
      id: crypto.randomUUID(),
      sender: 'user' as 'user',
      role: 'user' as 'user',
      content: inputMessage,
      text: inputMessage,
      timestamp: new Date()
    };
    const updatedMessages = [...messagesRef.current, userMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setInputMessage("");

    try {
      let responseMessage: StockbotMessage;
      let toolCalls: StockbotToolCall[] | undefined;
      
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
        try {
          console.log('Attempting to call Groq API with valid key');
          
          const timeoutId = setTimeout(() => {
            if (activeRequestRef.current) {
              activeRequestRef.current.abort();
            }
          }, 30000);
          
          const result = await callGroqApi(inputMessage, updatedMessages);
          clearTimeout(timeoutId);
          
          responseMessage = result.message;
          toolCalls = result.toolCalls;
          setErrorCount(0);
        } catch (apiError) {
          console.error('Error from Groq API:', apiError);
          const newErrorCount = errorCount + 1;
          setErrorCount(newErrorCount);
          
          if (newErrorCount >= 3) {
            toast({
              title: "API Connection Issues",
              description: "Multiple API errors detected. Please check your connection or API key.",
              variant: "destructive",
              duration: 6000
            });
          }
          
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

      if (!activeRequestRef.current?.signal.aborted) {
        let finalMessages = [...updatedMessages, responseMessage];
        
        if (toolCalls && toolCalls.length > 0) {
          console.log('Processing tool calls:', toolCalls);
          const toolMessages = await processToolCalls(toolCalls);
          
          if (toolMessages.length > 0) {
            finalMessages = [...finalMessages, ...toolMessages];
          }
        }
        
        setMessages(finalMessages);
        saveMessages(finalMessages);
      }
    } catch (error: any) {
      if (!activeRequestRef.current?.signal.aborted) {
        const errorMessage: StockbotMessage = {
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
      }
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
      activeRequestRef.current = null;
    }
  }, [inputMessage, errorCount, hasGroqKey, callGroqApi, processToolCalls]);

  useEffect(() => {
    return () => {
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
    };
  }, []);

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
