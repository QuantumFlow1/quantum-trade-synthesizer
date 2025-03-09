
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Message } from '../../types/chatTypes';
import { supabase } from '@/lib/supabase';
import { useDeepSeekApi } from './useDeepSeekApi';

// Add loading property to Message type for temporary messages
interface LoadingMessage extends Message {
  isLoading?: boolean;
}

export function useDeepSeekChat() {
  const [messages, setMessages] = useState<LoadingMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { 
    isApiLoading, 
    edgeFunctionStatus, 
    lastChecked, 
    checkDeepSeekApiStatus,
    sendMessageToDeepSeek 
  } = useDeepSeekApi();

  useEffect(() => {
    // Load messages from localStorage on component mount
    const savedMessages = localStorage.getItem('deepseekChatMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages)) {
          setMessages(parsedMessages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
        }
      } catch (error) {
        console.error('Error parsing saved DeepSeek messages:', error);
      }
    }
    
    // Initialize connection check with a slight delay to ensure API key is loaded
    setTimeout(() => {
      checkDeepSeekApiStatus();
    }, 300);
  }, [checkDeepSeekApiStatus]);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('deepseekChatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('deepseekChatMessages');
    toast({
      title: 'Chat Cleared',
      description: 'All DeepSeek chat messages have been cleared.'
    });
  }, [toast]);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;
    
    try {
      // Get the API key from localStorage
      const deepseekApiKey = localStorage.getItem('deepseekApiKey');
      
      if (!deepseekApiKey) {
        toast({
          title: 'API Key Missing',
          description: 'Please set your DeepSeek API key in the settings first.',
          variant: 'destructive'
        });
        return;
      }
      
      // Persist the key again to ensure it's saved properly
      localStorage.setItem('deepseekApiKey', deepseekApiKey);
      
      // Dispatch events to notify other components about the API key
      try {
        window.dispatchEvent(new Event('apikey-updated'));
        window.dispatchEvent(new Event('localStorage-changed'));
        window.dispatchEvent(new Event('storage'));
        
        console.log('DeepSeek API key events dispatched, key length:', deepseekApiKey.length);
      } catch (e) {
        console.error('Failed to dispatch API key events:', e);
      }
      
      // Add user message to the chat
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      };
      
      // Add temporary assistant message with loading state
      const assistantMsg: LoadingMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isLoading: true
      };
      
      setMessages(prev => [...prev, userMsg, assistantMsg]);
      setIsProcessing(true);
      
      // Prepare the conversation history for the API
      const messageHistory = messages
        .filter(msg => !msg.isLoading) // Filter out any loading messages
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      
      // Add the current user message
      messageHistory.push({
        role: 'user',
        content: userMessage
      });
      
      try {
        // First, check if the API connection is working
        const statusCheck = await checkDeepSeekApiStatus();
        
        if (!statusCheck) {
          throw new Error('DeepSeek API is currently unavailable. Please check your API key and try again.');
        }
        
        // Send the message to the DeepSeek API
        const response = await sendMessageToDeepSeek(messageHistory, deepseekApiKey);
        
        // Update the assistant message with the response
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMsg.id 
              ? { ...msg, content: response, isLoading: false } 
              : msg
          )
        );
      } catch (apiError) {
        console.error('Error from DeepSeek API:', apiError);
        // Provide a fallback response
        const errorMessage = apiError instanceof Error 
          ? `Error: ${apiError.message}` 
          : 'Failed to get response from DeepSeek.';
          
        // Update the message to show the error
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMsg.id 
              ? { ...msg, content: errorMessage, isLoading: false } 
              : msg
          )
        );
        
        toast({
          title: 'DeepSeek Error',
          description: errorMessage,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error sending message to DeepSeek:', error);
      
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process your request.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [messages, sendMessageToDeepSeek, toast, checkDeepSeekApiStatus]);
  
  const checkApiStatus = useCallback(async () => {
    return await checkDeepSeekApiStatus();
  }, [checkDeepSeekApiStatus]);

  return {
    messages,
    isProcessing,
    edgeFunctionStatus,
    lastChecked,
    sendMessage,
    clearMessages,
    checkApiStatus
  };
}
