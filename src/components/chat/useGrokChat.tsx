
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
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);

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
    setIsLoading(true);
    try {
      console.log('Checking Grok3 API availability...');
      const { data, error } = await supabase.functions.invoke('check-api-keys', {
        body: { service: 'grok3' }
      });
      
      if (error) {
        console.error('Error checking Grok API:', error);
        setApiAvailable(false);
        toast({
          title: "API Status",
          description: "De Grok API is momenteel niet beschikbaar. We gebruiken een alternatieve AI-service.",
          variant: "destructive",
          duration: 7000
        });
        return false;
      }
      
      const isAvailable = data?.available || false;
      setApiAvailable(isAvailable);
      
      if (!isAvailable) {
        toast({
          title: "API Status",
          description: "De Grok API is momenteel niet beschikbaar. We gebruiken een alternatieve AI-service.",
          variant: "destructive",
          duration: 7000
        });
      }
      
      console.log('Grok3 API available:', isAvailable);
      return isAvailable;
    } catch (error) {
      console.error('Failed to check API availability:', error);
      setApiAvailable(false);
      return false;
    } finally {
      setIsLoading(false);
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
      // If Grok3 API availability is unknown, check it
      if (apiAvailable === null) {
        await checkGrokAvailability();
      }
      
      console.log('Generating AI response...');
      
      // Create conversation history in the format expected by API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      let response;
      let error = null;
      
      // Try Grok3 API first if it's available
      if (apiAvailable) {
        console.log('Using Grok3 API...');
        const grokResult = await supabase.functions.invoke('grok3-response', {
          body: { 
            message: inputMessage,
            context: conversationHistory
          }
        });
        
        if (!grokResult.error && grokResult.data?.response) {
          response = grokResult.data.response;
        } else {
          console.error('Grok3 API error:', grokResult.error);
          error = grokResult.error;
        }
      }
      
      // Fallback to OpenAI if Grok3 is unavailable or failed
      if (!response) {
        console.log('Using fallback AI service...');
        const fallbackResult = await supabase.functions.invoke('generate-ai-response', {
          body: { 
            message: inputMessage,
            history: conversationHistory
          }
        });
        
        if (!fallbackResult.error && fallbackResult.data?.response) {
          response = fallbackResult.data.response;
        } else {
          console.error('Fallback AI error:', fallbackResult.error);
          if (!error) error = fallbackResult.error;
        }
      }
      
      if (!response) {
        throw new Error(error?.message || 'Geen antwoord van AI services');
      }
      
      // Add assistant response to chat
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
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
        description: error instanceof Error ? error.message : "Kon geen antwoord genereren. Probeer het later opnieuw.",
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

  const retryApiConnection = async () => {
    const isAvailable = await checkGrokAvailability();
    if (isAvailable) {
      toast({
        title: "Verbinding hersteld",
        description: "De Grok API is nu beschikbaar.",
        duration: 3000,
      });
    }
    return isAvailable;
  };

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    sendMessage,
    clearChat,
    apiAvailable,
    retryApiConnection
  };
}

export type { ChatMessage };
