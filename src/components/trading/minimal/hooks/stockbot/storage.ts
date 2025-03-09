
import { ChatMessage } from './types';

const STORAGE_KEY = 'stockbot-messages';

/**
 * Save messages to localStorage
 */
export const saveMessages = (messages: ChatMessage[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving messages to localStorage:', error);
  }
};

/**
 * Load messages from localStorage
 */
export const loadMessages = (): ChatMessage[] | null => {
  try {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      return Array.isArray(parsed) ? parsed : null;
    }
    return null;
  } catch (error) {
    console.error('Error loading messages from localStorage:', error);
    return null;
  }
};

/**
 * Clear all messages from localStorage
 */
export const clearMessages = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing messages from localStorage:', error);
  }
};
