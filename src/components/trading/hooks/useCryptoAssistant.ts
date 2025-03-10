
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ToolCall {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
}

export interface UseCryptoAssistantReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

export function useCryptoAssistant(): UseCryptoAssistantReturn {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: 'Hi, I\'m CryptoBot. I can help you analyze cryptocurrency markets and provide insights. What would you like to know about cryptocurrencies today?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Create and add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the Groq API key from localStorage if available
      const groqApiKey = localStorage.getItem('groqApiKey');
      
      // Format the conversation history for the API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add the user's new message
      conversationHistory.push({
        role: 'user',
        content
      });
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('crypto-groq-assistant', {
        body: {
          messages: conversationHistory,
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 1024,
          function_calling: "auto"
        },
        headers: groqApiKey ? { 'x-groq-api-key': groqApiKey } : undefined
      });
      
      if (error) {
        console.error('Error calling crypto-groq-assistant function:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }
      
      if (!data || data.status === 'error') {
        throw new Error(data?.error || 'Invalid response from AI service');
      }
      
      // Process the response and create assistant message
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      
      // Handle tool calls if present
      const toolCalls = data.tool_calls;
      if (toolCalls && toolCalls.length > 0) {
        console.log('Tool calls received:', toolCalls);
        // Tool calls can be processed here if needed
      }
      
    } catch (error) {
      console.error('Error in sendMessage:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      
      toast({
        title: "AI Error",
        description: error instanceof Error ? error.message : "Failed to get crypto analysis",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Hi, I\'m CryptoBot. I can help you analyze cryptocurrency markets and provide insights. What would you like to know about cryptocurrencies today?',
        timestamp: new Date()
      }
    ]);
    setError(null);
    
    toast({
      title: "Chat Cleared",
      description: "Your conversation has been reset.",
      duration: 3000
    });
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat
  };
}
