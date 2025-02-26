
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
  
  const deepseekResult = await supabase.functions.invoke('deepseek-response', {
    body: { 
      message: inputMessage,
      context: conversationHistory,
      model: settings?.selectedModel,
      maxTokens: settings?.maxTokens,
      temperature: settings?.temperature,
      apiKey: apiKey // Pass the API key to the function
    }
  });
  
  if (!deepseekResult.error && deepseek