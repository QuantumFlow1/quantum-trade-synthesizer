
import { supabase } from '@/lib/supabase';
import { GrokSettings } from '../types/GrokSettings';

export const generateOpenAIResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  settings?: GrokSettings
) => {
  console.log('Using OpenAI API...', { inputMessage, settings });
  
  // Extract the OpenAI API key from settings if available
  const apiKey = settings?.apiKeys?.openaiApiKey;
  
  const openaiResult = await supabase.functions.invoke('openai-response', {
    body: { 
      message: inputMessage,
      context: conversationHistory,
      model: settings?.selectedModel,
      maxTokens: settings?.maxTokens,
      temperature: settings?.temperature,
      apiKey: apiKey // Pass the API key to the function
    }
  });
  
  if (!openaiResult.error && openaiResult.data?.response) {
    console.log('OpenAI response received:', openaiResult.data.response.substring(0, 100) + '...');
    return openaiResult.data.response;
  } else {
    console.error('OpenAI API error:', openaiResult.error);
    throw openaiResult.error || new Error('Geen antwoord van OpenAI API');
  }
};
