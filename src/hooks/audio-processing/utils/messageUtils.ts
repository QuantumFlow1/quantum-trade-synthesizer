
import { ChatMessage } from '@/components/admin/types/chat-types';

export const createChatMessage = (
  content: string, 
  role: 'user' | 'assistant' | 'system'
): ChatMessage => {
  return {
    id: Date.now().toString(),
    content,
    role,
    timestamp: new Date().toISOString(),
  };
};

export const extractContextFromChat = (
  chatHistory: ChatMessage[], 
  contextLength: number = 10
): ChatMessage[] => {
  return chatHistory.slice(-contextLength);
};
