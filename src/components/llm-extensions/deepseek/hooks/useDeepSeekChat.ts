
import { useCallback, useEffect, useState } from 'react';
import { UseDeepSeekChatReturn, Message } from '../types/deepseekChatTypes';
import { generateId, formatConversationHistory } from '../utils/deepseekChatUtils';
import { useDeepSeekState } from './useDeepSeekState';
import { useDeepSeekApi } from './useDeepSeekApi';
import { toast } from '@/components/ui/use-toast';

export function useDeepSeekChat(): UseDeepSeekChatReturn {
  const {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    showSettings,
    setShowSettings,
    apiKey,
    saveApiKey,
    clearChat,
    toggleSettings,
  } = useDeepSeekState();

  const {
    isApiLoading,
    edgeFunctionStatus,
    lastChecked,
    checkDeepSeekApiStatus,
    sendMessageToDeepSeek,
  } = useDeepSeekApi();

  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'error'>('disconnected');

  // Check API status on mount and when API key changes
  useEffect(() => {
    checkEdgeFunctionStatus();
    
    // Also update connection status when API key changes
    if (apiKey) {
      checkEdgeFunctionStatus();
    }
  }, [apiKey]);

  // Update connection status when API status changes
  useEffect(() => {
    if (isApiLoading) {
      setConnectionStatus('connecting');
    } else if (edgeFunctionStatus === 'available') {
      if (apiKey) {
        setConnectionStatus('connected');
        
        // Dispatch an event to notify other components
        const event = new CustomEvent('connection-status-changed', {
          detail: { provider: 'deepseek', status: 'connected' }
        });
        window.dispatchEvent(event);
      } else {
        setConnectionStatus('disconnected');
      }
    } else {
      setConnectionStatus('error');
    }
  }, [isApiLoading, edgeFunctionStatus, apiKey]);

  /**
   * Checks the status of the DeepSeek API edge function
   */
  const checkEdgeFunctionStatus = useCallback(async () => {
    setConnectionStatus('connecting');
    try {
      await checkDeepSeekApiStatus();
      if (apiKey) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Error checking DeepSeek API status:', error);
      setConnectionStatus('error');
      toast({
        title: "Connection Error",
        description: "Could not connect to DeepSeek API. Please try again later.",
        variant: "destructive"
      });
    }
  }, [checkDeepSeekApiStatus, apiKey]);

  /**
   * Retry connection to the DeepSeek API
   */
  const retryConnection = async () => {
    toast({
      title: "Retrying connection",
      description: "Attempting to reconnect to DeepSeek API...",
    });
    await checkEdgeFunctionStatus();
  };

  /**
   * Sends a message to the DeepSeek API
   */
  const sendMessage = async () => {
    if (!inputMessage.trim() || isApiLoading) {
      return;
    }

    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please set your DeepSeek API key in the settings to use this model.",
        variant: "destructive"
      });
      setShowSettings(true);
      return;
    }

    // Create a new user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    // Create a placeholder for the assistant's response
    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    // Add messages to the state
    const updatedMessages = [...messages, userMessage, assistantMessage];
    setMessages(updatedMessages);
    setInputMessage('');

    try {
      // Format messages for the API
      const formattedMessages = formatConversationHistory(updatedMessages.slice(0, -1));
      
      // Send the message to the API and get the response
      const response = await sendMessageToDeepSeek(formattedMessages, apiKey);
      
      // Update the assistant's message with the response
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        const lastMessageIndex = newMessages.length - 1;
        
        if (lastMessageIndex >= 0 && newMessages[lastMessageIndex].role === 'assistant') {
          newMessages[lastMessageIndex] = {
            ...newMessages[lastMessageIndex],
            content: response,
          };
        }
        
        return newMessages;
      });

      // Update connection status to connected after successful response
      setConnectionStatus('connected');
    } catch (error) {
      // If there's an error, update the assistant's message with an error message
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        const lastMessageIndex = newMessages.length - 1;
        
        if (lastMessageIndex >= 0 && newMessages[lastMessageIndex].role === 'assistant') {
          newMessages[lastMessageIndex] = {
            ...newMessages[lastMessageIndex],
            content: 'Error: Unable to get a response from DeepSeek AI. Please check your API key and try again.',
          };
        }
        
        return newMessages;
      });
      
      console.error('Error sending message:', error);
      setConnectionStatus('error');
      
      toast({
        title: "Failed to get response",
        description: "Could not get a response from DeepSeek. Please check your API key and connection.",
        variant: "destructive"
      });
    }
  };

  return {
    messages,
    inputMessage,
    isLoading: isApiLoading,
    showSettings,
    apiKey,
    edgeFunctionStatus,
    lastChecked,
    connectionStatus,
    saveApiKey,
    setInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    setShowSettings,
    checkEdgeFunctionStatus,
    retryConnection,
  };
}
