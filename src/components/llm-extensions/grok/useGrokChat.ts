
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Message } from '../types/chatTypes';
import { supabase } from '@/lib/supabase';

export function useGrokChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  
  // Check API availability on mount
  useEffect(() => {
    checkApiAvailability();
    
    // Load saved messages from localStorage when component mounts
    const savedMessages = localStorage.getItem('grokChatMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } catch (e) {
        console.error('Error parsing saved Grok messages:', e);
      }
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('grokChatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Check if the Grok API is available
  const checkApiAvailability = useCallback(async () => {
    try {
      console.log('Checking Grok API availability...');
      
      const { data, error } = await supabase.functions.invoke('grok3-ping', {
        body: { isAvailabilityCheck: true }
      });
      
      if (error) {
        console.error('Error checking Grok API:', error);
        setApiAvailable(false);
        return false;
      }
      
      const isAvailable = data?.status === 'available';
      console.log('Grok API availability check result:', { isAvailable, data });
      setApiAvailable(isAvailable);
      return isAvailable;
    } catch (e) {
      console.error('Exception checking Grok API:', e);
      setApiAvailable(false);
      return false;
    }
  }, []);

  // Generate a unique ID for messages
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;
    
    // Check if this LLM is enabled
    const enabledLLMs = localStorage.getItem('enabledLLMs');
    if (enabledLLMs) {
      const parsedEnabledLLMs = JSON.parse(enabledLLMs);
      if (!parsedEnabledLLMs.grok) {
        toast({
          title: "Grok is disabled",
          description: "Please enable Grok before sending messages.",
          variant: "destructive",
          duration: 3000
        });
        return;
      }
    }

    // Add user message to chat
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    // Check if API is available
    if (apiAvailable === null) {
      const isAvailable = await checkApiAvailability();
      if (!isAvailable) {
        const errorMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: "The Grok service is currently unavailable. Please try again later or check your connection.",
          timestamp: new Date(),
        };
        setMessages([...newMessages, errorMessage]);
        setIsLoading(false);
        return;
      }
    } else if (apiAvailable === false) {
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: "The Grok service is currently unavailable. Please try again later or check your connection.",
        timestamp: new Date(),
      };
      setMessages([...newMessages, errorMessage]);
      setIsLoading(false);
      return;
    }

    try {
      // Format message history for API
      const formattedMessages = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Call the Grok API through edge function
      const { data, error } = await supabase.functions.invoke('grok3-response', {
        body: { 
          context: formattedMessages.slice(0, -1),
          message: formattedMessages[formattedMessages.length - 1].content
        }
      });
      
      if (error) {
        console.error('Error from Grok API call:', error);
        throw new Error(error.message || 'Failed to get response from Grok');
      }
      
      if (!data || !data.response) {
        console.error('Invalid response from Grok API:', data);
        
        // If we received a specific error message, use it
        if (data?.error) {
          throw new Error(data.error);
        }
        
        throw new Error('Received invalid response from Grok');
      }
      
      // Add the assistant response
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };
      
      setMessages([...newMessages, assistantMessage]);
      
      toast({
        title: "Response received",
        description: "Received response from Grok.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error in sendMessage:', error);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response from Grok'}`,
        timestamp: new Date(),
      };
      
      setMessages([...newMessages, errorMessage]);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to get response from Grok',
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, messages, apiAvailable, checkApiAvailability]);

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('grokChatMessages');
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
      duration: 3000,
    });
  }, []);

  const toggleSettings = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  return {
    messages,
    inputMessage,
    isLoading,
    showSettings,
    apiAvailable,
    setInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    setShowSettings,
    checkApiAvailability
  };
}
