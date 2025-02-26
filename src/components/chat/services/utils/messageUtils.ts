
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '../../types/chat';
import { isAdminContext } from './apiHelpers';

// Create a properly formatted chat message
export const createChatMessage = (role: 'user' | 'assistant', content: string): ChatMessage => {
  // Skip intensive operations in admin context
  if (isAdminContext()) {
    return {
      id: 'admin-context-disabled',
      role,
      content: content || "Chat disabled in admin context",
      timestamp: new Date(),
    };
  }

  const newMessage = {
    id: uuidv4(),
    role,
    content: content || "Error: Empty message content",
    timestamp: new Date(),
  };
  console.log(`Created new ${role} message:`, newMessage);
  return newMessage;
};

// Format conversation history for API requests
export const formatConversationHistory = (conversationHistory: Array<{ role: string; content: string }>) => {
  return conversationHistory.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));
};
