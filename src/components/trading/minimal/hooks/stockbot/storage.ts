
import { ChatMessage } from './types';

// Save chat history to localStorage
export const saveStockbotChatHistory = (messages: ChatMessage[]) => {
  try {
    localStorage.setItem('stockbotChatHistory', JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving stockbot chat history:', error);
  }
};

// Load chat history from localStorage
export const loadStockbotChatHistory = (): ChatMessage[] => {
  try {
    const history = localStorage.getItem('stockbotChatHistory');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading stockbot chat history:', error);
    return [];
  }
};

// Aliases for backwards compatibility
export const saveMessages = saveStockbotChatHistory;
export const loadMessages = loadStockbotChatHistory;
