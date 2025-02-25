
import { ChatMessage } from '@/components/admin/types/chat-types';

export const createChatMessage = (
  content: string, 
  role: 'user' | 'assistant'
): ChatMessage => {
  return {
    id: Date.now().toString(),
    content,
    role,
    timestamp: new Date(),
  };
};

export const createUserMessage = (content: string): ChatMessage => {
  return createChatMessage(content, 'user');
};

export const createAssistantMessage = (content: string): ChatMessage => {
  return createChatMessage(content, 'assistant');
};

export const extractContextFromChat = (
  chatHistory: ChatMessage[], 
  contextLength: number = 10
): ChatMessage[] => {
  return chatHistory.slice(-contextLength);
};
