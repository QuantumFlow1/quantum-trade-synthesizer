
import { supabase } from '@/lib/supabase';

export const generateFallbackResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
) => {
  console.log('Using fallback AI service...');
  const fallbackResult = await supabase.functions.invoke('generate-ai-response', {
    body: { 
      message: inputMessage,
      history: conversationHistory
    }
  });
  
  if (!fallbackResult.error && fallbackResult.data?.response) {
    return fallbackResult.data.response;
  } else {
    console.error('Fallback AI error:', fallbackResult.error);
    throw fallbackResult.error || new Error('Geen antwoord van fallback AI service');
  }
};
