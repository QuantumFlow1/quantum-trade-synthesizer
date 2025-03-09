
import { ChatMessage } from './types';

const STORAGE_KEY = 'stockbot-chat-history';

/**
 * Loads chat history from localStorage
 */
export function loadChatHistory(): ChatMessage[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Convert timestamp strings back to Date objects
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
  } catch (error) {
    console.error('Error loading stockbot chat history:', error);
  }
  
  return [];
}

/**
 * Saves chat history to localStorage
 */
export function saveChatHistory(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving stockbot chat history:', error);
  }
}

// Aliases for backward compatibility
export const loadStockbotChatHistory = loadChatHistory;
export const saveStockbotChatHistory = saveChatHistory;
