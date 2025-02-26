
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
    // Skip the health check for now as it might be causing issues
    // Directly make the request to the DeepSeek Edge Function
    console.log('Making direct request to DeepSeek Edge Function...');
    
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
    
    console.log('DeepSeek response status:', deepseekResult.error ? 'Error' : 'Success');
    
    if (!deepseekResult.error && deepseekResult.data?.response) {
      console.log('DeepSeek response received:', deepseekResult.data.response.substring(0, 100) + '...');
      return deepseekResult.data.response;
    } else {
      // Log detailed error information
      console.error('DeepSeek API error details:', {
        error: deepseekResult.error,
        data: deepseekResult.data,
        statusCode: deepseekResult.status
      });
      
      throw new Error(
        deepseekResult.error?.message || 
        deepseekResult.data?.error || 
        'Geen antwoord van DeepSeek API. Controleer of uw API-sleutel correct is.'
      );
    }
  } catch (error) {
    console.error('Exception calling DeepSeek:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    throw error;
  }
};
