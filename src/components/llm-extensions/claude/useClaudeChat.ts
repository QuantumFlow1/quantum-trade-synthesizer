
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Message } from '../deepseek/types';
import { generateClaudeResponse } from '@/components/chat/services/claudeService';
import { GrokSettings } from '@/components/chat/types/GrokSettings';
import { fetchAdminApiKey } from '@/components/chat/services/utils/apiHelpers';
import { useAuth } from '@/components/auth/AuthProvider';
import { hasApiKeyAccess } from '@/utils/auth-utils';

export function useClaudeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const { userProfile } = useAuth();
  
  // Load API key from localStorage or admin database
  useEffect(() => {
    const loadApiKey = async () => {
      try {
        // First check localStorage
        const savedApiKey = localStorage.getItem('claudeApiKey');
        if (savedApiKey) {
          console.log('Claude API key loaded from localStorage');
          setApiKey(savedApiKey);
          return;
        }
        
        // If not in localStorage and user has access, try to fetch from admin database
        if (userProfile && hasApiKeyAccess(userProfile)) {
          const adminKey = await fetchAdminApiKey('claude');
          if (adminKey) {
            console.log('Claude API key loaded from admin database');
            setApiKey(adminKey);
            localStorage.setItem('claudeApiKey', adminKey);
          }
        }
      } catch (error) {
        console.error('Error loading Claude API key:', error);
      }
    };
    
    loadApiKey();
  }, [userProfile]);
  
  // Debug for API key value
  useEffect(() => {
    console.log('Current Claude API key status:', apiKey ? 'Present' : 'Not set');
  }, [apiKey]);
  
  // Load saved messages from localStorage when component mounts
  useEffect(() => {
    const savedMessages = localStorage.getItem('claudeChatMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Error parsing saved Claude messages:', e);
      }
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('claudeChatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Generate a unique ID for messages
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const saveApiKey = (key: string) => {
    if (!key.trim()) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid Claude API key",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    localStorage.setItem('claudeApiKey', key);
    setApiKey(key);
    setShowSettings(false);
    
    toast({
      title: "API Key Saved",
      description: "Your Claude API key has been saved.",
      duration: 3000,
    });
    
    console.log('Claude API key saved to localStorage');
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // Check if this LLM is enabled
    const enabledLLMs = localStorage.getItem('enabledLLMs');
    if (enabledLLMs) {
      const parsedEnabledLLMs = JSON.parse(enabledLLMs);
      if (!parsedEnabledLLMs.claude) {
        toast({
          title: "Claude is disabled",
          description: "Please enable Claude before sending messages.",
          variant: "destructive",
          duration: 3000
        });
        return;
      }
    }
    
    // Check if we have an API key from localStorage or admin
    const effectiveApiKey = apiKey || localStorage.getItem('claudeApiKey');
    
    if (!effectiveApiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your Claude API key in settings.",
        variant: "destructive",
        duration: 5000,
      });
      setShowSettings(true);
      return;
    }

    try {
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

      // Create message history for Claude API
      const messageHistory = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Create settings object for Claude
      const claudeSettings: GrokSettings = {
        selectedModel: "claude",
        apiKeys: {
          claudeApiKey: effectiveApiKey
        },
        temperature: 0.7,
        maxTokens: 1024,
        deepSearchEnabled: false,
        thinkEnabled: false
      };

      console.log('Sending message to Claude with API key:', effectiveApiKey ? 'Present' : 'Missing');

      // Call Claude API
      const response = await generateClaudeResponse(
        inputMessage,
        messageHistory,
        claudeSettings
      );

      console.log('Received response from Claude:', response ? 'Response received' : 'No response');

      // Add Claude's response to chat
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response || "Sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date(),
      };

      setMessages([...newMessages, assistantMessage]);
      
      toast({
        title: "Response received",
        description: "Claude has responded to your message.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error with Claude API:', error);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: error instanceof Error 
          ? `Error: ${error.message}` 
          : "Sorry, an unexpected error occurred. Please check your API key and try again.",
        timestamp: new Date(),
      };
      
      setMessages([...messages, errorMessage]);
      
      toast({
        title: "Claude API Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to get a response from Claude",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('claudeChatMessages');
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
    setInputMessage,
    sendMessage,
    clearChat,
    toggleSettings,
    setShowSettings,
    saveApiKey,
  };
}
