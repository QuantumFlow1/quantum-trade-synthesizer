
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Message } from './types';
import { supabase } from '@/lib/supabase';

export function useDeepSeekChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [edgeFunctionStatus, setEdgeFunctionStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  
  // Check DeepSeek edge function status when component mounts
  useEffect(() => {
    checkEdgeFunctionStatus();
  }, []);
  
  // Load saved messages from localStorage when component mounts
  useEffect(() => {
    const savedMessages = localStorage.getItem('deepseekChatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Error parsing saved DeepSeek messages:', e);
      }
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('deepseekChatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Generate a unique ID for messages
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };
  
  // Check if the DeepSeek edge function is available
  const checkEdgeFunctionStatus = async () => {
    setEdgeFunctionStatus('checking');
    try {
      // Try to get the API key from localStorage first
      const apiKey = localStorage.getItem('deepseekApiKey');
      
      if (!apiKey) {
        console.log('No DeepSeek API key found in localStorage');
        setEdgeFunctionStatus('unavailable');
        return;
      }
      
      // Ping the edge function to check if it's available
      const { data, error } = await supabase.functions.invoke('deepseek-ping', {
        body: { test: true }
      });
      
      if (error || !data?.available) {
        console.error('DeepSeek edge function unavailable:', error || 'No availability data');
        setEdgeFunctionStatus('unavailable');
        return;
      }
      
      console.log('DeepSeek edge function is available');
      setEdgeFunctionStatus('available');
    } catch (error) {
      console.error('Error checking DeepSeek availability:', error);
      setEdgeFunctionStatus('unavailable');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Check if we have an API key
    const apiKey = localStorage.getItem('deepseekApiKey');
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
      // Format conversation history for API
      const history = newMessages.slice(0, -1).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Call the DeepSeek edge function
      const { data, error } = await supabase.functions.invoke('deepseek-response', {
        body: {
          message: inputMessage,
          context: history,
          model: 'deepseek-coder',
          temperature: 0.7,
          maxTokens: 1000,
          apiKey
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Add assistant response
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.response || "I couldn't generate a response at this time.",
        timestamp: new Date(),
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error('DeepSeek API error:', error);
      
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

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('deepseekChatMessages');
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
      duration: 3000,
    });
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return {
    messages,
    inputMessage,
    isLoading,
    showSettings,
    edgeFunctionStatus,
    setInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    setShowSettings,
    checkEdgeFunctionStatus
  };
}
