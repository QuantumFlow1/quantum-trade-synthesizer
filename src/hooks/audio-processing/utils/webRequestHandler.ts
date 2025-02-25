
import { ChatMessage } from '@/components/admin/types/chat-types';
import { createChatMessage } from './messageUtils';

export const handleWebRequest = async (
  url: string,
  method: 'GET' | 'POST' = 'GET',
  body?: any,
  headers?: Record<string, string>
): Promise<any> => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...(body && { body: JSON.stringify(body) }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in handleWebRequest:', error);
    throw error;
  }
};

export const createMessageFromJson = (json: any, role: 'user' | 'assistant'): ChatMessage => {
  return createChatMessage(json.content || json.text || 'Empty message', role);
};
