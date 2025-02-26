
import { supabase } from '@/lib/supabase';

export const generateGeminiResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
) => {
  console.log('Using Gemini API...');
  const geminiResult = await supabase.functions.invoke('gemini-response', {
    body: { 
      message: inputMessage,
      context: conversationHistory
    }
  });
  
  if (!geminiResult.error && geminiResult.data?.response) {
    return geminiResult.data.response;
  } else {
    console.error('Gemini API error:', geminiResult.error);
    throw geminiResult.error || new Error('Geen antwoord van Gemini API');
  }
};
