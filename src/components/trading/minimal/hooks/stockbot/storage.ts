
import { ChatMessage, StockbotMessage } from './types';
import { 
  saveApiKey as saveApiKeyToManager, 
  hasApiKey, 
  broadcastApiKeyChange 
} from '@/utils/apiKeyManager';

/**
 * Save stockbot chat messages to localStorage
 */
export const saveStockbotChatHistory = (messages: StockbotMessage[] | ChatMessage[]) => {
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
export const loadStockbotChatHistory = (): StockbotMessage[] => {
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

// Load API key from storage with health check
export const loadApiKey = (provider: string = 'groq'): string | null => {
  try {
    const key = localStorage.getItem(`${provider}ApiKey`);
    console.log(`Loading ${provider} API key from localStorage: ${key ? 'found' : 'not found'}`);
    return key;
  } catch (error) {
    console.error(`Error loading ${provider} API key:`, error);
    return null;
  }
};

// Save API key to storage with health indicators
export const saveApiKey = (key: string, provider: string = 'groq'): boolean => {
  try {
    // Use the centralized API key manager
    const success = saveApiKeyToManager(provider, key);
    console.log(`Saved ${provider} API key to storage via manager: ${success}`);
    
    if (!success) {
      console.error(`Failed to save ${provider} API key via manager`);
      // Fallback direct save as a precaution
      localStorage.setItem(`${provider}ApiKey`, key);
      
      // Dispatch events as fallback
      broadcastApiKeyChange();
    }
    
    return true;
  } catch (error) {
    console.error(`Error saving ${provider} API key:`, error);
    return false;
  }
};

// Check if any API key exists with health indicators
export const hasAnyApiKey = (): boolean => {
  const providers = ['groq', 'openai', 'anthropic', 'deepseek'];
  const result = providers.some(provider => hasApiKey(provider));
  console.log('Checking for any API keys:', { exists: result });
  return result;
};

// Get API key status for all providers with detailed health information
export const getApiKeyStatus = (): Record<string, boolean> => {
  const providers = ['groq', 'openai', 'anthropic', 'deepseek'];
  const status = providers.reduce((status, provider) => {
    const exists = hasApiKey(provider);
    status[provider] = exists;
    return status;
  }, {} as Record<string, boolean>);
  
  console.log('API key status health check:', status);
  return status;
};
