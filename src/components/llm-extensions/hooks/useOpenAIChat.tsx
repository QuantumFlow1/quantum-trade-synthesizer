
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { Message } from '../types/chatTypes';

export function useOpenAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Load API key and chat history from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openaiApiKey') || '';
    setApiKey(savedApiKey);

    const savedMessages = localStorage.getItem('openaiChatMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Failed to parse saved messages:', error);
      }
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem('openaiChatMessages', JSON.stringify(messages));
  }, [messages]);

  const saveApiKey = useCallback((key: string) => {
    setApiKey(key);
    localStorage.setItem('openaiApiKey', key);
    setShowSettings(false);
    toast({
      title: 'API Key Saved',
      description: 'Your OpenAI API key has been saved.',
    });
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    toast({
      title: 'Chat Cleared',
      description: 'All messages have been removed.',
    });
  }, []);

  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;
    if (!apiKey) {
      toast({
        title: 'API Key Required',
        description: 'Please set your OpenAI API key in settings.',
        variant: 'destructive',
      });
      setShowSettings(true);
      return;
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Mock response for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: `This is a simulated response to: "${inputMessage}".\n\nPlease note that this is a placeholder. In a real implementation, this would call the OpenAI API with your API key.`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message to OpenAI:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response from OpenAI.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, apiKey]);

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
    sendMessage,
  };
}
