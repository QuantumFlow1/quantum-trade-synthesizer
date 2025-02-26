
import { supabase } from '@/lib/supabase';
import { GrokSettings } from '../types/GrokSettings';

export const generateGeminiResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  settings?: GrokSettings
) => {
  console.log('Using Gemini API...');
  const geminiResult = await supabase.functions.invoke('gemini-response', {
    body: { 
      message: inputMessage,
      context: conversationHistory,
      model: settings?.selectedModel,
      maxTokens: settings?.maxTokens,
      temperature: settings?.temperature
    }
  });
  
  if (!geminiResult.error && geminiResult.data?.response) {
    return geminiResult.data.response;
  } else {
    console.error('Gemini API error:', geminiResult.error);
    throw geminiResult.error || new Error('Geen antwoord van Gemini API');
  }
};
