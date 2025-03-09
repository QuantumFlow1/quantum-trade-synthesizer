
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MarketData } from "../types";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export function useAIAnalysis(marketData?: MarketData) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I can help you analyze market data. Ask me about trends, price movements, or trading strategies.'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const { toast } = useToast();

  // Call the Supabase edge function to get an AI-generated response
  const generateResponse = async (userMessage: string) => {
    setIsLoading(true);
    setAiError(null);
    
    try {
      console.log("Calling market-analysis function with message:", userMessage);
      
      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('market-analysis', {
        body: { 
          message: userMessage,
          marketData: marketData 
        }
      });
      
      if (error) {
        console.error('Error calling market-analysis function:', error);
        throw new Error(error.message || "Failed to connect to AI service");
      }
      
      if (!data || !data.response) {
        console.error('Invalid response from market-analysis function:', data);
        throw new Error("Received invalid response from AI service");
      }
      
      console.log('Received AI response:', data.response.substring(0, 100) + '...');
      
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response
      };
      
      setMessages(prev => [...prev, newMessage]);
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      setAiError('Failed to generate market analysis. Please try again later.');
      toast({
        title: "AI Analysis Error",
        description: error instanceof Error ? error.message : "Could not generate market analysis response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (messageContent: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent
    };
    
    setMessages(prev => [...prev, userMessage]);
    await generateResponse(messageContent);
  };

  const resetChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Hello! I can help you analyze market data. Ask me about trends, price movements, or trading strategies.'
    }]);
    toast({
      title: "Chat Reset",
      description: "The market analysis chat has been reset",
    });
  };

  return {
    messages,
    isLoading,
    aiError,
    handleSendMessage,
    resetChat
  };
}
