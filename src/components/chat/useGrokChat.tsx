
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { ChatMessage } from './types/chat';
import { loadChatHistory, saveChatHistory } from './utils/storage';
import { useApiAvailability } from './hooks/useApiAvailability';
import { generateAIResponse, createChatMessage } from './services/messageService';
import { GrokSettings, DEFAULT_SETTINGS } from './types/GrokSettings';

export function useGrokChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [grokSettings, setGrokSettings] = useState<GrokSettings>(DEFAULT_SETTINGS);
  const { apiAvailable, isLoading, checkGrokAvailability, checkOpenAIAvailability, retryApiConnection } = useApiAvailability();

  // Check API availability on mount
  useEffect(() => {
    if (grokSettings.selectedModel === 'grok3') {
      checkGrokAvailability();
    } else if (grokSettings.selectedModel === 'openai') {
      checkOpenAIAvailability();
    } else {
      checkGrokAvailability();
    }
  }, [grokSettings.selectedModel]);

  // Load chat history from localStorage when component mounts
  useEffect(() => {
    const savedMessages = loadChatHistory();
    setMessages(savedMessages);
    
    // Load saved Grok settings if available
    const savedSettings = localStorage.getItem('grokSettings');
    if (savedSettings) {
      try {
        setGrokSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Error parsing saved Grok settings:', e);
      }
    }
  }, []);

  // Save chat history to localStorage when it changes
  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('grokSettings', JSON.stringify(grokSettings));
  }, [grokSettings]);

  const sendMessage = async (messageContent = inputMessage) => {
    if (!messageContent.trim()) return;

    // Create and add user message
    const userMessage = createChatMessage('user', messageContent);
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      // If API availability is unknown, check it based on selected model
      if (apiAvailable === null) {
        if (grokSettings.selectedModel === 'grok3') {
          await checkGrokAvailability();
        } else if (grokSettings.selectedModel === 'openai') {
          await checkOpenAIAvailability();
        }
      }
      
      console.log('Generating AI response...');
      
      // Create conversation history in the format expected by API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const response = await generateAIResponse(messageContent, conversationHistory, apiAvailable, grokSettings);
      
      console.log('Received AI response:', response);
      
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
    retryApiConnection,
    grokSettings,
    setGrokSettings
  };
}

export type { ChatMessage };
