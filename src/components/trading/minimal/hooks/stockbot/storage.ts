
import { ChatMessage } from './types';

// Local storage key for chat history
const CHAT_STORAGE_KEY = 'stockbot-chat-history';

/**
 * Save chat history to local storage
 */
export const saveStockbotChatHistory = (messages: ChatMessage[]): void => {
  try {
    // Convert Date objects to strings for safe storage
    const serializedMessages = messages.map(message => ({
      ...message,
      timestamp: message.timestamp instanceof Date
        ? message.timestamp.toISOString()
        : message.timestamp
    }));
    
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(serializedMessages));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

/**
 * Load chat history from local storage
 */
export const loadStockbotChatHistory = (): ChatMessage[] => {
  try {
    const storedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
    
    if (!storedMessages) {
      return [];
    }
    
    // Convert string timestamps back to Date objects
    return JSON.parse(storedMessages).map((message: any) => ({
      ...message,
      timestamp: message.timestamp ? new Date(message.timestamp) : new Date()
    }));
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

/**
 * Clear chat history from local storage
 */
export const clearStockbotChatHistory = (): void => {
  try {
    localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
};
