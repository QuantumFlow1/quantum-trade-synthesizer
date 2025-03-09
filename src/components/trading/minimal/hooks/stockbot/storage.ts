
import { ChatMessage } from "./types";

const STOCKBOT_CHAT_STORAGE_KEY = 'stockbotChatHistory';

export const loadStockbotChatHistory = (): ChatMessage[] => {
  const savedMessages = localStorage.getItem(STOCKBOT_CHAT_STORAGE_KEY);
  if (savedMessages) {
    try {
      const parsedMessages = JSON.parse(savedMessages);
      // Convert ISO date strings back to Date objects
      return parsedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (error) {
      console.error('Error parsing saved Stockbot chat history:', error);
      return [];
    }
  }
  return [];
};

export const saveStockbotChatHistory = (messages: ChatMessage[]): void => {
  try {
    localStorage.setItem(STOCKBOT_CHAT_STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving Stockbot chat history:', error);
  }
};

export const clearStockbotChatHistory = (): void => {
  try {
    localStorage.removeItem(STOCKBOT_CHAT_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing Stockbot chat history:', error);
  }
};
