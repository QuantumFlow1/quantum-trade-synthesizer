
import { supabase } from '@/lib/supabase';
import { GrokSettings } from '../types/GrokSettings';

export const generateGeminiResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  settings?: GrokSettings
) => {
  console.log('Using Gemini API...', { inputMessage, settings });
  
  // Extract the Gemini API key from settings if available
  const apiKey = settings?.apiKeys?.geminiApiKey;
  
  const geminiResult = await supabase.functions.invoke('gemini-response', {
    body: { 
      message: inputMessage,
      context: conversationHistory,
      model: settings?.selectedModel,
      maxTokens: settings?.maxTokens,
      temperature: settings?.temperature,
      apiKey: apiKey // Pass the API key to the function
    }
  });
  
  if (!geminiResult.error && geminiResult.data?.response) {
    console.log('Gemini response received:', geminiResult.data.response.substring(0, 100) + '...');
    return geminiResult.data.response;
  } else {
    console.error('Gemini API error:', geminiResult.error);
    throw geminiResult.error || new Error('Geen antwoord van Gemini API');
  }
};
