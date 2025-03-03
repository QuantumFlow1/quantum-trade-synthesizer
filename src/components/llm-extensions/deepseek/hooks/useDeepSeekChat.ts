
import { useCallback, useEffect } from 'react';
import { UseDeepSeekChatReturn, Message } from '../types/deepseekChatTypes';
import { generateId, formatConversationHistory } from '../utils/deepseekChatUtils';
import { useDeepSeekState } from './useDeepSeekState';
import { useDeepSeekApi } from './useDeepSeekApi';

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

  // Check API status on mount
  useEffect(() => {
    checkEdgeFunctionStatus();
  }, []);

  /**
   * Checks the status of the DeepSeek API edge function
   */
  const checkEdgeFunctionStatus = useCallback(async () => {
    await checkDeepSeekApiStatus();
  }, [checkDeepSeekApiStatus]);

  /**
   * Sends a message to the DeepSeek API
   */
  const sendMessage = async () => {
    if (!inputMessage.trim() || !apiKey.trim() || isApiLoading) {
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
    saveApiKey,
    setInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    setShowSettings,
    checkEdgeFunctionStatus,
  };
}
