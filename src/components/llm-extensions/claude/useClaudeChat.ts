
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Message } from '../deepseek/types';
import { supabase } from '@/lib/supabase';

export function useClaudeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  // Load saved API key and messages from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('claudeApiKey');
    if (savedApiKey) {
      console.log('Found saved Claude API key in localStorage');
      setApiKey(savedApiKey);
    } else {
      // Show settings if no API key is found
      console.log('No Claude API key found in localStorage');
      setShowSettings(true);
    }
    
    const savedMessages = localStorage.getItem('claudeChatMessages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } catch (e) {
        console.error('Error parsing saved Claude messages:', e);
        // If parsing fails, clear the corrupted messages
        localStorage.removeItem('claudeChatMessages');
      }
    }
    
    // Listen for API key changes from other components
    const handleApiKeyUpdate = () => {
      const updatedKey = localStorage.getItem('claudeApiKey');
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
      localStorage.setItem('claudeChatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Generate a unique ID for messages
  const generateId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }, []);
  
  // Save API key
  const saveApiKey = useCallback((newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem('claudeApiKey', newApiKey);
    
    toast({
      title: "API key saved",
      description: "Your Claude API key has been saved.",
      duration: 3000,
    });
    
    // Trigger custom event for other components
    window.dispatchEvent(new Event('apikey-updated'));
  }, []);

  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;
    
    if (!apiKey) {
      toast({
        title: "API key required",
        description: "Please set your Claude API key in settings.",
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
      // Format conversation history for Claude API
      const history = newMessages.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      
      // Call the Claude edge function with error handling
      try {
        const { data, error } = await supabase.functions.invoke('claude-response', {
          body: {
            messages: [...history, { role: 'user', content: inputMessage }],
            model: 'claude-3-haiku-20240307',
            temperature: 0.7,
            max_tokens: 1000,
            apiKey
          }
        });
        
        if (error) {
          throw new Error(error.message || 'Error calling Claude API');
        }
        
        if (!data || !data.response) {
          throw new Error(data?.error || 'Invalid response from Claude API');
        }
        
        // Add assistant response
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };

        setMessages([...newMessages, assistantMessage]);
      } catch (apiError) {
        // Handle API errors
        console.error('Claude API error:', apiError);
        
        // Add error message to chat
        const errorMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: apiError instanceof Error 
            ? `Error: ${apiError.message}` 
            : 'An unknown error occurred with the Claude API.',
          timestamp: new Date(),
        };
        
        setMessages([...newMessages, errorMessage]);
        
        toast({
          title: "Claude API Error",
          description: apiError instanceof Error ? apiError.message : "Failed to get Claude response",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error in chat process:', error);
      
      // Add general error message
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: error instanceof Error 
          ? `Error: ${error.message}` 
          : 'An unexpected error occurred. Please try again.',
        timestamp: new Date(),
      };
      
      setMessages([...newMessages, errorMessage]);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, messages, apiKey, generateId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('claudeChatMessages');
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
      duration: 3000,
    });
  }, []);

  const toggleSettings = useCallback(() => {
    setShowSettings(!showSettings);
  }, [showSettings]);

  return {
    messages,
    inputMessage,
    isLoading,
    showSettings,
    apiKey,
    saveApiKey,
    setInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    setShowSettings
  };
}
