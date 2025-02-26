
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Message } from '../deepseek/types';

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

  const sendMessage = () => {
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

    // Simulate API call with timeout
    setTimeout(() => {
      // Add assistant response indicating functionality is coming soon
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: "Claude integration is coming soon! This is a placeholder response. The actual API integration is under development.",
        timestamp: new Date(),
      };

      setMessages([...newMessages, assistantMessage]);
      setIsLoading(false);
      
      toast({
        title: "Response received",
        description: "Placeholder response from Claude.",
        duration: 3000,
      });
    }, 1000);
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
    setApiKey,
    setInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    setShowSettings
  };
}
