
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { ChatMessage } from '../types/chat';
import { loadChatHistory, saveChatHistory } from '../utils/storage';
import { createChatMessage } from '../services/messageService';
import { isOfflineMode } from '../services/utils/apiHelpers';

export function useGrokMessages(isAdminContext = false) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [offlineMode, setOfflineMode] = useState(isOfflineMode());

  // Set up listeners for online/offline status
  useEffect(() => {
    const handleOnline = () => setOfflineMode(false);
    const handleOffline = () => setOfflineMode(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load chat history from localStorage when component mounts
  useEffect(() => {
    if (isAdminContext) {
      console.log('Skip loading chat history in admin context');
      return;
    }
    
    const savedMessages = loadChatHistory();
    console.log('Loaded saved messages:', savedMessages);
    if (savedMessages && savedMessages.length > 0) {
      setMessages(savedMessages);
    }
  }, [isAdminContext]);

  // Save chat history to localStorage when it changes
  useEffect(() => {
    if (isAdminContext || messages.length === 0) {
      return;
    }
    
    console.log('Saving messages to localStorage:', messages);
    saveChatHistory(messages);
  }, [messages, isAdminContext]);

  const clearChat = useCallback(() => {
    if (isAdminContext) {
      console.log('clearChat blocked in admin context');
      return;
    }
    
    setMessages([]);
    localStorage.removeItem('grokChatHistory');
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
      duration: 3000
    });
  }, [isAdminContext]);

  return {
    messages,
    setMessages,
    inputMessage,
    setInputMessage,
    isProcessing,
    setIsProcessing,
    clearChat,
    offlineMode
  };
}
