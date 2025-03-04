
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Message } from '../deepseek/types';

export function useGrokChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Load saved messages from localStorage when component mounts
  useEffect(() => {
    const savedMessages = localStorage.getItem('grokChatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Error parsing saved Grok messages:', e);
      }
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('grokChatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Generate a unique ID for messages
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Check if this LLM is enabled
    const enabledLLMs = localStorage.getItem('enabledLLMs');
    if (enabledLLMs) {
      const parsedEnabledLLMs = JSON.parse(enabledLLMs);
      if (!parsedEnabledLLMs.grok) {
        toast({
          title: "Grok is disabled",
          description: "Please enable Grok before sending messages.",
          variant: "destructive",
          duration: 3000
        });
        return;
      }
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
        content: "Grok integration is coming soon! This is a placeholder response. The actual API integration is under development.",
        timestamp: new Date(),
      };

      setMessages([...newMessages, assistantMessage]);
      setIsLoading(false);
      
      toast({
        title: "Response received",
        description: "Placeholder response from Grok.",
        duration: 3000,
      });
    }, 1000);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('grokChatMessages');
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
    setInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    setShowSettings
  };
}
