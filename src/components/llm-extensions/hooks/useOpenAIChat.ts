
import { useState, useCallback } from 'react';
import { Message } from '../types/chatTypes';

export function useOpenAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [edgeFunctionStatus, setEdgeFunctionStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [apiKey, setApiKey] = useState('');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const saveApiKey = useCallback((key: string) => {
    localStorage.setItem('openai-api-key', key);
    setApiKey(key);
    setShowSettings(false);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // This is a placeholder. In a real implementation, you would call an API
      // Simulating API response delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `This is a simulated response to: "${inputMessage}"`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading]);

  const toggleSettings = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  return {
    messages,
    inputMessage,
    isLoading,
    showSettings,
    edgeFunctionStatus,
    apiKey,
    lastChecked,
    setInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    setShowSettings,
    saveApiKey,
    setApiKey,
  };
}
