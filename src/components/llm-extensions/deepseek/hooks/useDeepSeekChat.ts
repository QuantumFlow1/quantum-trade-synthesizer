
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useDeepSeekApi } from './useDeepSeekApi';
import { Message } from '../types';

export function useDeepSeekChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  const {
    isApiLoading,
    edgeFunctionStatus,
    lastChecked,
    checkDeepSeekApiStatus,
    sendMessageToDeepSeek,
  } = useDeepSeekApi();
  
  // Load saved messages and API key from localStorage when component mounts
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('deepseekChatMessages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
      
      const savedApiKey = localStorage.getItem('deepseekApiKey');
      if (savedApiKey) {
        setApiKey(savedApiKey);
      } else {
        setShowSettings(true); // Show settings if no API key is set
      }
    } catch (e) {
      console.error('Error loading DeepSeek data from localStorage:', e);
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('deepseekChatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Generate a unique ID for messages
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const saveApiKey = (key: string) => {
    setApiKey(key);
    setShowSettings(false);
    checkDeepSeekApiStatus();
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Check if DeepSeek is enabled
    const enabledLLMs = localStorage.getItem('enabledLLMs');
    if (enabledLLMs) {
      const parsedEnabledLLMs = JSON.parse(enabledLLMs);
      if (!parsedEnabledLLMs.deepseek) {
        toast({
          title: "DeepSeek is disabled",
          description: "Please enable DeepSeek before sending messages.",
          variant: "destructive",
          duration: 3000
        });
        return;
      }
    }

    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your DeepSeek API key in the settings.",
        variant: "destructive",
        duration: 3000
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

    try {
      // Prepare messages for API in the format DeepSeek expects
      const apiMessages = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add a placeholder for the assistant's response
      const placeholderId = generateId();
      setMessages([...newMessages, {
        id: placeholderId,
        role: 'assistant',
        content: 'Thinking...',
        timestamp: new Date(),
        isLoading: true
      }]);
      
      // Send the message to the DeepSeek API
      const response = await sendMessageToDeepSeek(apiMessages, apiKey);
      
      // Update the placeholder with the actual response
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === placeholderId
            ? {
                id: placeholderId,
                role: 'assistant',
                content: response,
                timestamp: new Date(),
                isLoading: false
              }
            : msg
        )
      );
      
    } catch (error) {
      console.error('Error sending message to DeepSeek:', error);
      
      // Remove the placeholder and add an error message
      setMessages(prevMessages => 
        prevMessages.filter(msg => !msg.isLoading)
      );
      
      toast({
        title: "Error",
        description: "Failed to get a response from DeepSeek. Please check your API key and try again.",
        variant: "destructive",
        duration: 5000,
      });
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
  
  const retryConnection = () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your DeepSeek API key first.",
        variant: "destructive",
        duration: 3000
      });
      setShowSettings(true);
      return;
    }
    
    checkDeepSeekApiStatus();
    toast({
      title: "Checking Connection",
      description: "Verifying DeepSeek API connectivity...",
      duration: 3000,
    });
  };

  return {
    messages,
    inputMessage,
    isLoading: isApiLoading,
    showSettings,
    edgeFunctionStatus,
    apiKey,
    lastChecked,
    saveApiKey,
    setInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    setShowSettings,
    checkEdgeFunctionStatus,
    retryConnection
  };
}
