
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Message } from '../deepseek/types';
import { generateClaudeResponse } from '@/components/chat/services/claudeService';

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

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('claudeApiKey', apiKey);
    }
  }, [apiKey]);

  // Generate a unique ID for messages
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
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
      // Convert messages to the format expected by the Claude API
      const conversationHistory = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call the Claude API with the chat history
      const response = await generateClaudeResponse(
        inputMessage, 
        conversationHistory,
        { 
          selectedModel: 'claude', 
          apiKeys: { claudeApiKey: apiKey },
          temperature: 0.7,
          maxTokens: 1000
        }
      );

      // Add assistant response to chat
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages([...newMessages, assistantMessage]);
      
      toast({
        title: "Response received",
        description: "Claude has responded to your message.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Claude API error:", error);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : "Failed to get response from Claude API"}`,
        timestamp: new Date(),
      };
      
      setMessages([...newMessages, errorMessage]);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response from Claude API",
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
    setApiKey,
    setInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    setShowSettings
  };
}
