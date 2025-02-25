
import { ChatMessage } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';
import { generateGrok3Response } from './grok3Service';
import { generateFallbackResponse } from './fallbackService';

export const generateAIResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  apiAvailable: boolean
) => {
  let response;
  let error = null;
  
  if (apiAvailable) {
    try {
      response = await generateGrok3Response(inputMessage, conversationHistory);
    } catch (grokError) {
      console.error('Grok3 service error:', grokError);
      error = grokError;
    }
  }
  
  if (!response) {
    try {
      response = await generateFallbackResponse(inputMessage, conversationHistory);
    } catch (fallbackError) {
      console.error('Fallback service error:', fallbackError);
      if (!error) error = fallbackError;
    }
  }
  
  if (!response) {
    throw new Error(error?.message || 'Geen antwoord van AI services');
  }
  
  return response;
};

export const createChatMessage = (
  role: 'user' | 'assistant',
  content: string
): ChatMessage => ({
  id: uuidv4(),
  role,
  content,
  timestamp: new Date()
});
