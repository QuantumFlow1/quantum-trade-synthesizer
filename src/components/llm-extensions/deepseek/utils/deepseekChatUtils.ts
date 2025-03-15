
import { Message } from '../../types/chatTypes';

/**
 * Generates a unique ID for messages
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Formats conversation history for the DeepSeek API
 */
export const formatConversationHistory = (messages: Message[]) => {
  return messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));
};

/**
 * Loads messages from localStorage
 */
export const loadMessagesFromStorage = (): Message[] => {
  const savedMessages = localStorage.getItem('deepseekChatMessages');
  if (savedMessages) {
    try {
      return JSON.parse(savedMessages);
    } catch (e) {
      console.error('Error parsing saved DeepSeek messages:', e);
      return [];
    }
  }
  return [];
};

/**
 * Saves messages to localStorage
 */
export const saveMessagesToStorage = (messages: Message[]): void => {
  if (messages.length > 0) {
    localStorage.setItem('deepseekChatMessages', JSON.stringify(messages));
  }
};

/**
 * Loads API key from localStorage
 */
export const loadApiKeyFromStorage = (): string => {
  const savedApiKey = localStorage.getItem('deepseekApiKey');
  return savedApiKey || '';
};

/**
 * Saves API key to localStorage
 */
export const saveApiKeyToStorage = (apiKey: string): void => {
  localStorage.setItem('deepseekApiKey', apiKey);
};
