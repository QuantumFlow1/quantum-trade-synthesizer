
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { ChatMessage } from './types/chat';
import { loadChatHistory, saveChatHistory } from './utils/storage';
import { useApiAvailability } from './hooks/useApiAvailability';
import { generateAIResponse, createChatMessage } from './services/messageService';

export function useGrokChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const { apiAvailable, isLoading, checkGrokAvailability, retryApiConnection } = useApiAvailability();

  // Check API availability on mount
  useEffect(() => {
    checkGrokAvailability();
  }, []);

  // Load chat history from localStorage when component mounts
  useEffect(() => {
    const savedMessages = loadChatHistory();
    setMessages(savedMessages);
  }, []);

  // Save chat history to localStorage when it changes
  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Create and add user message
    const userMessage = createChatMessage('user', inputMessage);
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      // If Grok3 API availability is unknown, check it
      if (apiAvailable === null) {
        await checkGrokAvailability();
      }
      
      console.log('Generating AI response...');
      
      // Create conversation history in the format expected by API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const response = await generateAIResponse(inputMessage, conversationHistory, apiAvailable);
      
      // Add assistant response to chat
      const assistantMessage = createChatMessage('assistant', response);
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Error in chat process:', error);
      
      // Add error message
      const errorMessage = createChatMessage(
        'assistant',
        'Er is een fout opgetreden bij het genereren van een antwoord. Probeer het later opnieuw.'
      );
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Show error toast
      toast({
        title: "Er is een fout opgetreden",
        description: error instanceof Error ? error.message : "Kon geen antwoord genereren. Probeer het later opnieuw.",
        variant: "destructive"
      });
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('grokChatHistory');
  };

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    sendMessage,
    clearChat,
    apiAvailable,
    retryApiConnection
  };
}

export type { ChatMessage };
