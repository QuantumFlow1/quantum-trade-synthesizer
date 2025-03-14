
import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { GrokSettings, DEFAULT_SETTINGS } from '../types/GrokSettings';

export function useGrokChatCore(skipInitialization = false) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [grokSettings, setGrokSettings] = useState<GrokSettings>(DEFAULT_SETTINGS);
  
  // Initialize with a welcome message
  useEffect(() => {
    if (skipInitialization) return;
    
    const welcomeMessage: ChatMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: 'Hallo! Ik ben je AI assistent. Hoe kan ik je vandaag helpen?',
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    console.log('Initialize chat with welcome message:', welcomeMessage);
  }, [skipInitialization]);

  // Send a message
  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;
    
    // Create a new user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    // Add the user message to the list
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Wait for 1 second (simulating API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a response message
      const responseMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: generateResponse(inputMessage),
        timestamp: new Date()
      };
      
      // Add the response to the list
      setMessages(prev => [...prev, responseMessage]);
      setApiAvailable(true);
    } catch (error) {
      console.error('Error sending message:', error);
      setApiAvailable(false);
      
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage]);

  const clearChat = useCallback(() => {
    const welcomeMessage: ChatMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: 'Hallo! Ik ben je AI assistent. Hoe kan ik je vandaag helpen?',
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    
    toast({
      title: "Chat Reset",
      description: "Chat history has been cleared.",
    });
  }, []);

  const retryApiConnection = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Simulate API check
      await new Promise(resolve => setTimeout(resolve, 1000));
      setApiAvailable(true);
      
      toast({
        title: "Connection Restored",
        description: "Successfully connected to the AI service.",
      });
    } catch (error) {
      setApiAvailable(false);
      
      toast({
        title: "Connection Failed",
        description: "Still unable to connect to the AI service.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Simple mock response generator
  const generateResponse = (message: string): string => {
    if (message.toLowerCase().includes('ollama')) {
      return "Ollama is een open-source project dat het gemakkelijk maakt om LLMs (Large Language Models) lokaal te draaien. Het ondersteunt modellen zoals Llama, Mistral, en andere. Het voordeel is dat je geen internetverbinding nodig hebt en dat je data privé blijft omdat alles lokaal gebeurt.";
    } else if (message.toLowerCase().includes('llama') || message.toLowerCase().includes('llama 3.3')) {
      return "Llama 3.3 is een krachtiger versie van Meta's Llama taalfamilie. Het biedt betere prestaties, meer contextuele begrip en efficiëntere verwerking dan voorgaande versies. Het is beschikbaar in verschillende formaten, waaronder een 8B en 70B parameterversie, en kan worden gebruikt via Ollama of andere platforms.";
    } else {
      return "Ik kan je helpen met vragen over AI-modellen zoals Ollama en Llama 3.3. Wat wil je precies weten?";
    }
  };

  return {
    messages,
    setMessages,
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
