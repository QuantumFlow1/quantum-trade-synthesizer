
import { ChatMessage, StockbotMessage } from './types';
import { 
  saveApiKey as saveApiKeyToManager, 
  hasApiKey, 
  getApiKey, 
  broadcastApiKeyChange 
} from '@/utils/apiKeyManager';

/**
 * Save stockbot chat messages to localStorage
 */
export const saveMessages = (messages: ChatMessage[] | StockbotMessage[]) => {
  try {
    localStorage.setItem('stockbot-chat-history', JSON.stringify(messages));
    return true;
  } catch (error) {
    console.error("Error saving stockbot chat history:", error);
    return false;
  }
};

/**
 * Load stockbot chat messages from localStorage
 */
export const loadMessages = (): ChatMessage[] => {
  try {
    const savedMessages = localStorage.getItem('stockbot-chat-history');
    if (savedMessages) {
      return JSON.parse(savedMessages);
    }
  } catch (error) {
    console.error("Error loading stockbot chat history:", error);
  }
  return [];
};

/**
 * Clear stockbot chat history
 */
export const clearMessages = () => {
  try {
    localStorage.removeItem('stockbot-chat-history');
    return true;
  } catch (error) {
    console.error("Error clearing stockbot chat history:", error);
    return false;
  }
};

/**
 * Save API key to localStorage
 * Returns true if successful, false otherwise
 */
export const saveApiKey = (provider: "openai" | "groq" | "claude" | "anthropic" | "gemini" | "deepseek", key: string): boolean => {
  try {
    // Use the centralized API key manager
    const result = saveApiKeyToManager(provider, key);
    
    // For backward compatibility
    if (!result) {
      console.log(`Using fallback method to save ${provider} API key`);
      
      // Skip if key is empty
      if (!key || key.trim() === '') {
        localStorage.removeItem(`${provider}ApiKey`);
        broadcastApiKeyChange(provider, false);
        return false;
      }
      
      // Directly save to localStorage
      localStorage.setItem(`${provider}ApiKey`, key);
      
      // Dispatch events as fallback
      broadcastApiKeyChange(provider, true);
    }
    
    return true;
  } catch (error) {
    console.error(`Error saving ${provider} API key:`, error);
    return false;
  }
};

// Aliases for backward compatibility
export const loadStockbotChatHistory = loadMessages;
export const saveStockbotChatHistory = saveMessages;
