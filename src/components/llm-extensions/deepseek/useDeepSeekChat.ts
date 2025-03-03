
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Message } from './types';
import { EdgeFunctionStatus } from '../types/chatTypes';
import { supabase } from '@/lib/supabase';

export function useDeepSeekChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [edgeFunctionStatus, setEdgeFunctionStatus] = useState<EdgeFunctionStatus>('checking');
  
  // Load saved API key and messages from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('deepseekApiKey');
    if (savedApiKey) {
      console.log('Found saved DeepSeek API key in localStorage');
      setApiKey(savedApiKey);
    } else {
      // Show settings if no API key is found
      console.log('No DeepSeek API key found in localStorage');
      setShowSettings(true);
    }
    
    const savedMessages = localStorage.getItem('deepseekChatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Error parsing saved DeepSeek messages:', e);
      }
    }
    
    // Check edge function status
    checkEdgeFunctionStatus();
    
    // Listen for API key changes from other components
    const handleApiKeyUpdate = () => {
      const updatedKey = localStorage.getItem('deepseekApiKey');
      if (updatedKey && updatedKey !== apiKey) {
        console.log('API key updated from another component');
        setApiKey(updatedKey);
      }
    };
    
    window.addEventListener('apikey-updated', handleApiKeyUpdate);
    window.addEventListener('localStorage-changed', handleApiKeyUpdate);
    
    return () => {
      window.removeEventListener('apikey-updated', handleApiKeyUpdate);
      window.removeEventListener('localStorage-changed', handleApiKeyUpdate);
    };
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
  
  // Save API key
  const saveApiKey = (newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem('deepseekApiKey', newApiKey);
    
    toast({
      title: "API key saved",
      description: "Your DeepSeek API key has been saved.",
      duration: 3000,
    });
    
    // Trigger custom event for other components
    window.dispatchEvent(new Event('apikey-updated'));
    
    // Check edge function status again
    checkEdgeFunctionStatus();
  };
  
  // Check if the DeepSeek Edge Function is available
  const checkEdgeFunctionStatus = async () => {
    setEdgeFunctionStatus('checking');
    
    try {
      // Try to ping the deepseek service
      const { data, error } = await supabase.functions.invoke('deepseek-response', {
        body: { ping: true }
      });
      
      if (error) {
        console.error('DeepSeek edge function error:', error);
        setEdgeFunctionStatus('unavailable');
        return;
      }
      
      if (data?.available) {
        setEdgeFunctionStatus('available');
      } else {
        setEdgeFunctionStatus('unavailable');
      }
    } catch (error) {
      console.error('Error checking DeepSeek availability:', error);
      setEdgeFunctionStatus('unavailable');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    if (!apiKey && edgeFunctionStatus !== 'available') {
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
      // Format conversation history for DeepSeek API
      const history = newMessages.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      
      // Call the DeepSeek edge function
      const { data, error } = await supabase.functions.invoke('deepseek-response', {
        body: {
          messages: [...history, { role: 'user', content: inputMessage }],
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
    apiKey,
    edgeFunctionStatus,
    saveApiKey,
    setInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    setShowSettings,
    checkEdgeFunctionStatus
  };
}
