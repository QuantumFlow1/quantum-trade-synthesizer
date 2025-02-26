
import { supabase } from '@/lib/supabase';
import { GrokSettings } from '../types/GrokSettings';

export const generateDeepSeekResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  settings?: GrokSettings
) => {
  console.log('Using DeepSeek API...', { 
    messageLength: inputMessage?.length,
    historyLength: conversationHistory?.length,
    model: settings?.selectedModel
  });
  
  // Extract the DeepSeek API key from settings
  const apiKey = settings?.apiKeys?.deepseekApiKey;
  if (!apiKey) {
    throw new Error('DeepSeek API key is required. Please set it in the settings.');
  }
  
  // Determine which model to use
  const model = settings?.selectedModel === 'deepseek-chat' ? 'deepseek-chat' : 'deepseek-coder';
  console.log(`DeepSeek: Using model ${model}`);
  
  try {
    // Prepare the request to the DeepSeek Edge Function
    const functionParams = { 
      message: inputMessage,
      context: conversationHistory,
      model: model,
      maxTokens: settings?.maxTokens || 1000,
      temperature: settings?.temperature || 0.7,
      apiKey: apiKey
    };
    
    console.log('Making request to DeepSeek Edge Function with params:', {
      model: functionParams.model,
      maxTokens: functionParams.maxTokens,
      temperature: functionParams.temperature,
      messageLength: functionParams.message?.length,
      contextLength: functionParams.context?.length
    });
    
    // Make the request to the DeepSeek Edge Function
    const deepseekResult = await supabase.functions.invoke('deepseek-response', {
      body: functionParams
    });
    
    // Check for errors in the response
    if (deepseekResult.error) {
      console.error('DeepSeek Edge Function error:', deepseekResult.error);
      throw new Error(`DeepSeek API Error: ${deepseekResult.error.message || 'Unknown error'}`);
    }
    
    // Check if we received a valid response
    if (!deepseekResult.data?.response) {
      console.error('Invalid DeepSeek response:', deepseekResult.data);
      throw new Error('Invalid response from DeepSeek API. Please try again.');
    }
    
    // Log the successful response
    console.log('DeepSeek response received successfully:', 
      deepseekResult.data.response.substring(0, 100) + '...');
    
    return deepseekResult.data.response;
  } catch (error) {
    console.error('Exception calling DeepSeek:', error);
    
    // Provide a more descriptive error message
    let errorMessage = 'Error connecting to DeepSeek API.';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error details:', error.message, error.stack);
    }
    
    // Check if the error is related to the API key
    if (errorMessage.includes('API key') || errorMessage.toLowerCase().includes('authentication')) {
      errorMessage = 'Invalid DeepSeek API key. Please check your API key in settings.';
    }
    
    throw new Error(errorMessage);
  }
};
