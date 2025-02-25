
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useGrokChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check API availability on mount
  useEffect(() => {
    checkGrokAvailability();
  }, []);

  // Load chat history from localStorage when component mounts
  useEffect(() => {
    const savedMessages = localStorage.getItem('grokChatHistory');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert string timestamps back to Date objects
        const messagesWithDateObjects = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDateObjects);
      } catch (error) {
        console.error('Error parsing saved chat history:', error);
      }
    }
  }, []);

  // Save chat history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('grokChatHistory', JSON.stringify(messages));
  }, [messages]);

  // Function to check if Grok API is available
  const checkGrokAvailability = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-api-keys', {
        body: { service: 'grok3' }
      });
      
      if (error || !data?.available) {
        toast({
          title: "Grok API Status",
          description: "De Grok API is momenteel niet beschikbaar. Sommige functies werken mogelijk niet.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error checking Grok API:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Create and add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('Calling Grok3 API via Edge Function...');
      
      // Create conversation history in the format expected by Grok API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: { 
          message: inputMessage,
          context: conversationHistory
        }
      });
      
      if (error) {
        console.error('Error calling Grok3 API:', error);
        throw new Error(`API error: ${error.message}`);
      }
      
      if (!data || !data.response) {
        throw new Error('Invalid response from Grok3 API');
      }
      
      console.log('Grok3 response received:', data);
      
      // Add assistant response to chat
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Show success toast
      toast({
        title: "Antwoord ontvangen",
        description: "Grok heeft je vraag beantwoord.",
      });
    } catch (error) {
      console.error('Error in chat process:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Er is een fout opgetreden bij het genereren van een antwoord. Probeer het later opnieuw.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Show error toast
      toast({
        title: "Er is een fout opgetreden",
        description: "Kon geen verbinding maken met de Grok API. Controleer je internetverbinding en probeer het opnieuw.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('grokChatHistory');
  };

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    sendMessage,
    clearChat
  };
}

export type { ChatMessage };
