
import { supabase } from '@/lib/supabase';
import { GrokSettings } from '../types/GrokSettings';

export const generateDeepSeekResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  settings?: GrokSettings
) => {
  console.log('Using DeepSeek API...', { inputMessage, settings });
  
  // Extract the DeepSeek API key from settings if available
  const apiKey = settings?.apiKeys?.deepseekApiKey;
  
  // Use specific model if provided, otherwise default to deepseek-coder
  const model = settings?.selectedModel === 'deepseek-chat' ? 'deepseek-chat' : 'deepseek-coder';
  
  console.log(`DeepSeek: Using model ${model}`);
  
  try {
    const deepseekResult = await supabase.functions.invoke('deepseek-response', {
      body: { 
        message: inputMessage,
        context: conversationHistory,
        model: model,
        maxTokens: settings?.maxTokens,
        temperature: settings?.temperature,
        apiKey: apiKey // Pass the API key to the function
      }
    });
    
    if (!deepseekResult.error && deepseekResult.data?.response) {
      console.log('DeepSeek response received:', deepseekResult.data.response.substring(0, 100) + '...');
      return deepseekResult.data.response;
    } else {
      console.error('DeepSeek API error:', deepseekResult.error || deepseekResult.data?.error);
      throw deepseekResult.error || new Error(deepseekResult.data?.error || 'Geen antwoord van DeepSeek API');
    }
  } catch (error) {
    console.error('Exception calling DeepSeek:', error);
    throw error;
  }
};
