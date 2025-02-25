
import { ChatMessage } from '../types/chat';

export const loadChatHistory = (): ChatMessage[] => {
  const savedMessages = localStorage.getItem('grokChatHistory');
  if (savedMessages) {
    try {
      const parsedMessages = JSON.parse(savedMessages);
      return parsedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (error) {
      console.error('Error parsing saved chat history:', error);
      return [];
    }
  }
  return [];
};

export const saveChatHistory = (messages: ChatMessage[]): void => {
  localStorage.setItem('grokChatHistory', JSON.stringify(messages));
};
