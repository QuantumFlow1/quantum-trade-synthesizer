
import { useState, useEffect } from 'react';
import { Message } from '../types/chatTypes';
import { toast } from '@/components/ui/use-toast';
import { processMessageText } from '@/components/chat/services/utils/messageUtils';

export const useOpenAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Load saved API key from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openaiApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      // Show settings on first load if no API key
      setShowSettings(true);
    }
  }, []);

  // Save API key
  const saveApiKey = () => {
    localStorage.setItem('openaiApiKey', apiKey);
    setShowSettings(false);
    toast({
      title: "API key saved",
      description: "Your OpenAI API key has been saved.",
      duration: 3000,
    });
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

  // Generate a unique ID for messages
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Send message to OpenAI API
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!apiKey) {
      toast({
        title: "API key required",
        description: "Please set your OpenAI API key in settings.",
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
      // Add assistant response indicating functionality is coming soon
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: "OpenAI integration is coming soon! This is a placeholder response. The actual API integration is under development.",
        timestamp: new Date(),
      };

      // Process the message to ensure proper formatting
      assistantMessage.content = processMessageText(assistantMessage.content);
      setMessages([...newMessages, assistantMessage]);

    } catch (error) {
      console.error('OpenAI chat error:', error);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: error instanceof Error 
          ? `Error: ${error.message}` 
          : 'An unknown error occurred. Please try again.',
        timestamp: new Date(),
      };
      
      // Process the error message to ensure proper formatting
      errorMessage.content = processMessageText(errorMessage.content);
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
    setInputMessage,
    isLoading,
    apiKey,
    setApiKey,
    showSettings,
    setShowSettings,
    saveApiKey,
    clearChat,
    sendMessage
  };
};
