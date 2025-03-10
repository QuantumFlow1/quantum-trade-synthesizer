
import { ChatMessage } from './types';

/**
 * Save stockbot chat messages to localStorage
 */
export const saveStockbotChatHistory = (messages: ChatMessage[]) => {
  try {
    localStorage.setItem('stockbot-chat-history', JSON.stringify(messages));
    return true;
  } catch (error) {
    console.error('Error saving stockbot chat history:', error);
    return false;
  }
};

/**
 * Load stockbot chat messages from localStorage
 */
export const loadStockbotChatHistory = (): ChatMessage[] => {
  try {
    const savedMessages = localStorage.getItem('stockbot-chat-history');
    if (savedMessages) {
      return JSON.parse(savedMessages);
    }
  } catch (error) {
    console.error('Error loading stockbot chat history:', error);
  }
  return [];
};

// Alias functions for compatibility with the useStockbotApi hook
export const saveMessages = saveStockbotChatHistory;
export const loadMessages = loadStockbotChatHistory;

// Load API key from storage
export const loadApiKey = (provider: string = 'groq'): string | null => {
  try {
    return localStorage.getItem(`${provider}ApiKey`);
  } catch (error) {
    console.error(`Error loading ${provider} API key:`, error);
    return null;
  }
};

// Save API key to storage
export const saveApiKey = (key: string, provider: string = 'groq'): boolean => {
  try {
    localStorage.setItem(`${provider}ApiKey`, key);
    
    // Dispatch events to notify other components
    window.dispatchEvent(new Event('apikey-updated'));
    window.dispatchEvent(new Event('localStorage-changed'));
    
    return true;
  } catch (error) {
    console.error(`Error saving ${provider} API key:`, error);
    return false;
  }
};

// Check if any API key exists
export const hasAnyApiKey = (): boolean => {
  const providers = ['groq', 'openai', 'anthropic', 'deepseek'];
  return providers.some(provider => !!loadApiKey(provider));
};

// Get API key status for all providers
export const getApiKeyStatus = (): Record<string, boolean> => {
  const providers = ['groq', 'openai', 'anthropic', 'deepseek'];
  return providers.reduce((status, provider) => {
    status[provider] = !!loadApiKey(provider);
    return status;
  }, {} as Record<string, boolean>);
};
