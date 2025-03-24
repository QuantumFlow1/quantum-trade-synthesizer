
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useClaudeApiKey } from './useClaudeApiKey';
import { useClaudeMessages } from './useClaudeMessages';
import { useMCPSetting } from './useMCPSetting';
import { Message } from '../../types/chatTypes';

export function useClaudeChat() {
  const { apiKey, saveApiKey } = useClaudeApiKey();
  const { messages, setMessages, inputMessage, setInputMessage, generateId, clearChat } = useClaudeMessages();
  const { useMCP, toggleMCP } = useMCPSetting();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Initialize settings if no API key
  useEffect(() => {
    if (!apiKey) {
      setShowSettings(true);
    }
  }, [apiKey]);

  // Listen for API key changes from other components
  useEffect(() => {
    const handleApiKeyUpdate = () => {
      const updatedKey = localStorage.getItem('claudeApiKey');
      if (updatedKey !== apiKey) {
        console.log('Claude API key updated from another component');
        saveApiKey(updatedKey || '');
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
  }, [apiKey, saveApiKey]);

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
      
      console.log('Sending messages to Claude API:', apiMessages.length);
      console.log('Using MCP:', useMCP);
      
      // Call the Claude edge function with error handling
      const { data, error } = await supabase.functions.invoke('claude-response', {
        body: {
          messages: apiMessages,
          model: 'claude-3-haiku-20240307',
          temperature: 0.7,
          max_tokens: 1000,
          apiKey,
          useMCP // Pass the MCP setting to the edge function
        }
      });
      
      console.log('Claude API response received:', data ? 'Data present' : 'No data', 'Error:', error);
      
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
        metadata: {
          usedMCP: data.usedMCP || useMCP
        }
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
  }, [inputMessage, messages, apiKey, generateId, useMCP, setMessages]);

  const toggleSettings = useCallback(() => {
    setShowSettings(!showSettings);
  }, [showSettings]);

  return {
    messages,
    inputMessage,
    isLoading,
    showSettings,
    apiKey,
    useMCP,
    saveApiKey,
    toggleMCP,
    setInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    setShowSettings
  };
}
