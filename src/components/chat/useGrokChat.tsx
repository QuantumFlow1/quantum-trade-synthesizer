
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { ChatMessage } from './types/chat';
import { loadChatHistory, saveChatHistory } from './utils/storage';
import { useApiAvailability } from './hooks/useApiAvailability';
import { generateAIResponse, createChatMessage } from './services/messageService';
import { GrokSettings, DEFAULT_SETTINGS } from './types/GrokSettings';

export function useGrokChat(skipInitialization = false) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [grokSettings, setGrokSettings] = useState<GrokSettings>(DEFAULT_SETTINGS);
  const [isProcessing, setIsProcessing] = useState(false);
  const { apiAvailable, isLoading, checkGrokAvailability, retryApiConnection } = useApiAvailability();

  // Check if we're in the admin context by examining the URL
  const isAdminContext = typeof window !== 'undefined' && 
    (window.location.pathname.includes('/admin') || skipInitialization);
  
  // Only run effects if not in admin context
  useEffect(() => {
    if (isAdminContext) {
      console.log('Skip Grok API availability check in admin context');
      return;
    }
    checkGrokAvailability();
  }, [isAdminContext, checkGrokAvailability]);

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
    
    // Load saved Grok settings if available
    const savedSettings = localStorage.getItem('grokSettings');
    if (savedSettings) {
      try {
        setGrokSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Error parsing saved Grok settings:', e);
      }
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
  
  // Save settings to localStorage when they change
  useEffect(() => {
    if (isAdminContext) {
      return;
    }
    
    localStorage.setItem('grokSettings', JSON.stringify(grokSettings));
  }, [grokSettings, isAdminContext]);

  const sendMessage = useCallback(async (messageContent = inputMessage) => {
    if (!messageContent.trim()) return;
    
    if (isAdminContext) {
      console.log('sendMessage blocked in admin context');
      return;
    }
    
    console.log('sendMessage called with content:', messageContent);
    setIsProcessing(true);

    try {
      // Create and add user message
      const userMessage = createChatMessage('user', messageContent);
      console.log('Adding user message:', userMessage);
      
      const updatedMessages = [...messages, userMessage];
      
      // Immediately update messages state with user message
      setMessages(updatedMessages);
      console.log('Updated messages after adding user message:', updatedMessages);
      
      setInputMessage('');

      // If Grok3 API availability is unknown, check it
      if (apiAvailable === null) {
        await checkGrokAvailability();
      }
      
      console.log('Generating AI response with model:', grokSettings.selectedModel);
      
      // Create conversation history in the format expected by API
      const conversationHistory = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      console.log('Conversation history for API:', conversationHistory);
      
      try {
        const response = await generateAIResponse(messageContent, conversationHistory, apiAvailable !== false, grokSettings);
        console.log('Received AI response:', response);
        
        if (!response) {
          console.error('Empty response received from AI');
          throw new Error('Empty response received from AI');
        }
        
        // Add assistant response to chat
        const assistantMessage = createChatMessage('assistant', response);
        console.log('Adding assistant message:', assistantMessage);
        
        // Update messages state with both user and assistant messages
        const finalMessages = [...updatedMessages, assistantMessage];
        console.log('Final messages state:', finalMessages);
        setMessages(finalMessages);
        
        toast({
          title: "Response received",
          description: "The AI has responded to your message.",
          duration: 3000
        });
      } catch (apiError) {
        console.error('Error getting AI response:', apiError);
        
        // Add error message to chat
        const errorMessage = createChatMessage(
          'assistant',
          'Er is een fout opgetreden bij het genereren van een antwoord. Probeer het later opnieuw.'
        );
        
        setMessages([...updatedMessages, errorMessage]);
        
        toast({
          title: "Error generating response",
          description: apiError instanceof Error ? apiError.message : "Failed to generate a response",
          variant: "destructive",
          duration: 5000
        });
      }
      
    } catch (error) {
      console.error('Error in chat process:', error);
      
      // Add error message
      const errorMessage = createChatMessage(
        'assistant',
        'Er is een fout opgetreden bij het genereren van een antwoord. Probeer het later opnieuw.'
      );
      
      console.log('Adding error message to chat:', errorMessage);
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Show error toast
      toast({
        title: "Er is een fout opgetreden",
        description: error instanceof Error ? error.message : "Kon geen antwoord genereren. Probeer het later opnieuw.",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsProcessing(false);
    }
  }, [inputMessage, messages, apiAvailable, checkGrokAvailability, grokSettings, isAdminContext]);

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
    inputMessage,
    setInputMessage,
    isLoading: isLoading || isProcessing,
    sendMessage,
    clearChat,
    apiAvailable,
    retryApiConnection,
    grokSettings,
    setGrokSettings
  };
}

export type { ChatMessage };
