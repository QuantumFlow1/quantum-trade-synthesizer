
import { useState, useEffect } from 'react';
import { Message } from './types';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export function useDeepSeekChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [edgeFunctionStatus, setEdgeFunctionStatus] = useState<'available' | 'unavailable' | 'unknown'>('unknown');

  // Load saved API key from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('deepseekApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    
    // Check edge function status on mount
    checkEdgeFunctionStatus();
  }, []);

  // Function to check if the DeepSeek edge function is available
  const checkEdgeFunctionStatus = async () => {
    try {
      console.log('Checking DeepSeek edge function status...');
      const { error } = await supabase.functions.invoke('deepseek-response', {
        body: { 
          message: "system: ping",
          context: [],
          model: "deepseek-chat",
          maxTokens: 10,
          temperature: 0.7,
          apiKey: apiKey || "test-key" // Just for checking if the function exists
        }
      });
      
      // We don't care about the API key error, just that the function responds
      if (error && !error.message.includes('API key')) {
        console.error('DeepSeek edge function is unavailable:', error);
        setEdgeFunctionStatus('unavailable');
        
        // Show toast with information about the unavailable service
        toast({
          title: "DeepSeek Service Unavailable",
          description: "The DeepSeek AI service is currently unavailable. Please try again later or use another AI model.",
          variant: "warning",
          duration: 5000
        });
      } else {
        console.log('DeepSeek edge function is available');
        setEdgeFunctionStatus('available');
      }
    } catch (error) {
      console.error('Error checking DeepSeek edge function status:', error);
      setEdgeFunctionStatus('unavailable');
    }
  };

  // Generate a unique ID for messages
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Toggle settings panel
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
      duration: 3000,
    });
  };

  // Save API key to localStorage when it changes
  const updateApiKey = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem('deepseekApiKey', newKey);
    toast({
      title: "API Key Saved",
      description: "Your DeepSeek API key has been saved.",
      duration: 3000,
    });
  };

  // Send message to DeepSeek API
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    if (edgeFunctionStatus === 'unavailable') {
      toast({
        title: "Service Unavailable",
        description: "The DeepSeek service is currently unavailable. Please try again later or use another AI model.",
        variant: "destructive",
      });
      return;
    }
    
    if (!apiKey) {
      toast({
        title: "API key required",
        description: "Please set your DeepSeek API key in settings.",
        variant: "destructive",
      });
      setShowSettings(true);
      return;
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

    try {
      // Prepare conversation history for API
      const conversationHistory = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Make request to DeepSeek API via Edge Function
      const response = await supabase.functions.invoke('deepseek-response', {
        body: {
          message: inputMessage,
          context: conversationHistory,
          model: 'deepseek-coder',
          maxTokens: 1000,
          temperature: 0.7,
          apiKey: apiKey
        }
      });

      // Handle errors
      if (response.error) {
        throw new Error(`DeepSeek API Error: ${response.error.message || 'Unknown error'}`);
      }

      if (!response.data?.response) {
        throw new Error('Invalid response from DeepSeek API. Please try again.');
      }

      // Add assistant response to chat
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
      };

      setMessages([...newMessages, assistantMessage]);

    } catch (error) {
      console.error('DeepSeek chat error:', error);
      
      // Check if the error might be due to the edge function being unavailable
      if (error instanceof Error && error.message.includes('non-2xx status code')) {
        setEdgeFunctionStatus('unavailable');
      }
      
      // Add error message to chat
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: error instanceof Error 
          ? `Error: ${error.message}` 
          : 'An unknown error occurred. Please try again.',
        timestamp: new Date(),
      };
      
      setMessages([...newMessages, errorMessage]);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    inputMessage,
    isLoading,
    showSettings,
    apiKey,
    edgeFunctionStatus,
    setInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    setShowSettings,
    updateApiKey,
    checkEdgeFunctionStatus
  };
}
