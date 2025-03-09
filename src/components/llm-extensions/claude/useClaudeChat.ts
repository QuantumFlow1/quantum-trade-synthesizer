
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
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
    const loadSavedData = () => {
      try {
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
      } catch (e) {
        console.error('Error loading saved Claude data:', e);
      }
    };
    
    // Load data with a slight delay to ensure stability
    setTimeout(loadSavedData, 300);
    
    // Listen for API key changes from other components
    const handleApiKeyUpdate = () => {
      const updatedKey = localStorage.getItem('claudeApiKey');
      if (updatedKey !== apiKey) {
        console.log('Claude API key updated from another component');
        setApiKey(updatedKey || '');
      }
    };
    
    window.addEventListener('apikey-updated', handleApiKeyUpdate);
    window.addEventListener('localStorage-changed', handleApiKeyUpdate);
    window.addEventListener('storage', handleApiKeyUpdate);
    
    return () => {
      window.removeEventListener('apikey-updated', handleApiKeyUpdate);
      window.removeEventListener('localStorage-changed', handleApiKeyUpdate);
      window.removeEventListener('storage', handleApiKeyUpdate);
    };
  }, [apiKey]);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('claudeChatMessages', JSON.stringify(messages));
      } catch (e) {
        console.error('Error saving Claude messages:', e);
      }
    }
  }, [messages]);

  // Generate a unique ID for messages
  const generateId = useCallback(() => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }, []);
  
  // Save API key
  const saveApiKey = useCallback((newApiKey: string) => {
    try {
      setApiKey(newApiKey);
      localStorage.setItem('claudeApiKey', newApiKey);
      
      toast({
        title: "API key saved",
        description: "Your Claude API key has been saved.",
        duration: 3000,
      });
      
      // Trigger custom event for other components
      window.dispatchEvent(new Event('apikey-updated'));
      window.dispatchEvent(new Event('localStorage-changed'));
      window.dispatchEvent(new Event('storage'));
      
      console.log('Claude API key saved successfully');
    } catch (e) {
      console.error('Error saving Claude API key:', e);
      toast({
        title: "Error saving API key",
        description: "Failed to save your Claude API key.",
        variant: "destructive",
        duration: 3000,
      });
    }
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
      // Prepare messages for Claude API
      const apiMessages = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      console.log('Sending messages to Claude API:', apiMessages);
      
      // Call the Claude edge function with error handling
      const { data, error } = await supabase.functions.invoke('claude-response', {
        body: {
          messages: apiMessages,
          model: 'claude-3-haiku-20240307',
          temperature: 0.7,
          max_tokens: 1000,
          apiKey
        }
      });
      
      console.log('Claude API response:', data, 'Error:', error);
      
      if (error) {
        throw new Error(error.message || 'Error calling Claude API');
      }
      
      if (!data) {
        throw new Error('Empty response from Claude API');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!data.response) {
        throw new Error('No response content from Claude API');
      }
      
      // Add assistant response
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      // Handle API errors
      console.error('Claude API error:', error);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: error instanceof Error 
          ? `Error: ${error.message}` 
          : 'An unknown error occurred with the Claude API.',
        timestamp: new Date(),
      };
      
      setMessages([...newMessages, errorMessage]);
      
      toast({
        title: "Claude API Error",
        description: error instanceof Error ? error.message : "Failed to get Claude response",
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
}, []);
