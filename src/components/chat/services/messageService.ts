
import { supabase } from '@/lib/supabase';
import { ChatMessage } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';

export const generateAIResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  apiAvailable: boolean
) => {
  let response;
  let error = null;
  
  if (apiAvailable) {
    console.log('Using Grok3 API...');
    const grokResult = await supabase.functions.invoke('grok3-response', {
      body: { 
        message: inputMessage,
        context: conversationHistory
      }
    });
    
    if (!grokResult.error && grokResult.data?.response) {
      response = grokResult.data.response;
    } else {
      console.error('Grok3 API error:', grokResult.error);
      error = grokResult.error;
    }
  }
  
  if (!response) {
    console.log('Using fallback AI service...');
    const fallbackResult = await supabase.functions.invoke('generate-ai-response', {
      body: { 
        message: inputMessage,
        history: conversationHistory
      }
    });
    
    if (!fallbackResult.error && fallbackResult.data?.response) {
      response = fallbackResult.data.response;
    } else {
      console.error('Fallback AI error:', fallbackResult.error);
      if (!error) error = fallbackResult.error;
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
