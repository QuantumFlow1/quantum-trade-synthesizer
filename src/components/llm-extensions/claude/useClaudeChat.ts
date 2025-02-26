
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Message } from '../deepseek/types';
import { generateClaudeResponse } from '@/components/chat/services/claudeService';
import { GrokSettings } from '@/components/chat/types/GrokSettings';
import { isLLMActive, useLLMChangeListener } from '../utils/llmManager';

export function useClaudeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [isActive, setIsActive] = useState(isLLMActive('claude'));
  
  // Listen for LLM changes
  useLLMChangeListener(useCallback((activeLLM) => {
    setIsActive(activeLLM === 'claude');
    console.log(`Claude is now ${activeLLM === 'claude' ? 'active' : 'inactive'}`);
  }, []));
  
  // Load API key from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('claudeApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      console.log('Claude API key loaded from localStorage');
    }
  }, []);
  
  // Load saved messages from localStorage when component mounts
  useEffect(() => {
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

  const saveApiKey = (key: string) => {
    localStorage.setItem('claudeApiKey', key);
    setApiKey(key);
    setShowSettings(false);
    toast({
      title: "API Key Saved",
      description: "Your Claude API key has been saved.",
      duration: 3000,
    });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Check if Claude is the active LLM
    if (!isActive) {
      toast({
        title: "Claude is not active",
        description: "Please activate Claude first by selecting its tab.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your Claude API key in settings.",
        variant: "destructive",
        duration: 5000,
      });
      setShowSettings(true);
      return;
    }

    try {
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

      // Create message history for Claude API
      const messageHistory = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Create settings object for Claude
      const claudeSettings: GrokSettings = {
        selectedModel: "claude",
        apiKeys: {
          claudeApiKey: apiKey
        },
        temperature: 0.7,
        maxTokens: 1024,
        deepSearchEnabled: false,
        thinkEnabled: false
      };

      // Call Claude API
      const response = await generateClaudeResponse(
        inputMessage,
        messageHistory,
        claudeSettings
      );

      // Add Claude's response to chat
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response || "Sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date(),
      };

      setMessages([...newMessages, assistantMessage]);
      
      toast({
        title: "Response received",
        description: "Claude has responded to your message.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error with Claude API:', error);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: error instanceof Error 
          ? `Error: ${error.message}` 
          : "Sorry, an unexpected error occurred. Please check your API key and try again.",
        timestamp: new Date(),
      };
      
      setMessages([...messages, errorMessage]);
      
      toast({
        title: "Claude API Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to get a response from Claude",
        variant: "destructive",
        duration: 5000,
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
    isActive,
    setInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    setShowSettings,
    saveApiKey,
  };
}
