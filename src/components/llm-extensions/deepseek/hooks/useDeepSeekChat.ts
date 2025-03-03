
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Message } from '../types/deepseekChatTypes';
import { useDeepSeekApi } from './useDeepSeekApi';
import { 
  generateId, 
  formatConversationHistory,
  loadMessagesFromStorage,
  saveMessagesToStorage,
  loadApiKeyFromStorage,
  saveApiKeyToStorage
} from '../utils/deepseekChatUtils';
import { UseDeepSeekChatReturn } from '../types/deepseekChatTypes';

export function useDeepSeekChat(): UseDeepSeekChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  const { 
    edgeFunctionStatus, 
    checkEdgeFunctionStatus, 
    sendMessageToApi 
  } = useDeepSeekApi();
  
  // Load saved API key and messages from localStorage
  useEffect(() => {
    const savedApiKey = loadApiKeyFromStorage();
    if (savedApiKey) {
      console.log('Found saved DeepSeek API key in localStorage');
      setApiKey(savedApiKey);
    } else {
      // Show settings if no API key is found
      console.log('No DeepSeek API key found in localStorage');
      setShowSettings(true);
    }
    
    const savedMessages = loadMessagesFromStorage();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    }
    
    // Check edge function status
    checkEdgeFunctionStatus();
    
    // Listen for API key changes from other components
    const handleApiKeyUpdate = () => {
      const updatedKey = loadApiKeyFromStorage();
      if (updatedKey && updatedKey !== apiKey) {
        console.log('API key updated from another component');
        setApiKey(updatedKey);
      }
    };
    
    window.addEventListener('apikey-updated', handleApiKeyUpdate);
    window.addEventListener('localStorage-changed', handleApiKeyUpdate);
    
    return () => {
      window.removeEventListener('apikey-updated', handleApiKeyUpdate);
      window.removeEventListener('localStorage-changed', handleApiKeyUpdate);
    };
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    saveMessagesToStorage(messages);
  }, [messages]);

  // Save API key
  const saveApiKey = (newApiKey: string) => {
    setApiKey(newApiKey);
    saveApiKeyToStorage(newApiKey);
    
    toast({
      title: "API key saved",
      description: "Your DeepSeek API key has been saved.",
      duration: 3000,
    });
    
    // Trigger custom event for other components
    window.dispatchEvent(new Event('apikey-updated'));
    
    // Check edge function status again
    checkEdgeFunctionStatus();
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    if (!apiKey && edgeFunctionStatus !== 'available') {
      toast({
        title: "API key required",
        description: "Please set your DeepSeek API key in settings.",
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
      // Format conversation history for DeepSeek API
      const history = formatConversationHistory(newMessages.slice(0, -1));
      
      // Get response from API
      const { response } = await sendMessageToApi(inputMessage, history, apiKey);
      
      // Add assistant response
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error('DeepSeek API error:', error);
      
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
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('deepseekChatMessages');
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
    edgeFunctionStatus,
    saveApiKey,
    setInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    setShowSettings,
    checkEdgeFunctionStatus
  };
}
