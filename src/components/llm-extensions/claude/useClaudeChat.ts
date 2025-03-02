
import { useState, useEffect } from 'react';
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
      setApiKey(savedApiKey);
    } else {
      // Show settings if no API key is found
      setShowSettings(true);
    }
    
    const savedMessages = localStorage.getItem('claudeChatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Error parsing saved Claude messages:', e);
      }
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('claudeChatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Generate a unique ID for messages
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };
  
  // Save API key
  const saveApiKey = (newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem('claudeApiKey', newApiKey);
    
    toast({
      title: "API key saved",
      description: "Your Claude API key has been saved.",
      duration: 3000,
    });
    
    // Trigger custom event for other components
    window.dispatchEvent(new Event('apikey-updated'));
  };

  const sendMessage = async () => {
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
      
      // Call the Claude edge function
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
      console.error('Claude API error:', error);
      
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
    localStorage.removeItem('claudeChatMessages');
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
    saveApiKey,
    setInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    setShowSettings
  };
}
