
import { GrokSettings } from '../types/GrokSettings';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { getApiKey } from './utils/apiHelpers';

export const generateOpenAIResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  settings: GrokSettings
): Promise<string> => {
  try {
    // Get the API key from settings, localStorage, or admin keys
    const apiKey = await getApiKey('openai', settings.apiKeys.openaiApiKey);
    
    if (!apiKey) {
      console.error('OpenAI API key is missing');
      toast({
        title: "Missing API Key",
        description: "No OpenAI API key is available. Please set one in settings or contact an administrator.",
        variant: "destructive"
      });
      throw new Error('OpenAI API key is missing');
    }
    
    console.log('Calling OpenAI API with model:', settings.selectedModel);
    
    // Format conversation history
    const messages = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
    
    // Add the new user message
    messages.push({
      role: 'user',
      content: inputMessage
    });
    
    // Prepare request
    const modelName = settings.selectedModel === 'openai' ? 'gpt-4o' : settings.selectedModel;
    
    try {
      // Call Supabase Edge Function for OpenAI response
      const { data, error } = await supabase.functions.invoke('openai-response', {
        body: {
          messages,
          model: modelName,
          temperature: settings.temperature || 0.7,
          max_tokens: settings.maxTokens || 1024,
          apiKey: apiKey
        }
      });
      
      if (error) {
        console.error('OpenAI Supabase function error:', error);
        throw new Error(`OpenAI API Error: ${error.message}`);
      }
      
      if (!data || !data.response) {
        console.error('Invalid response from OpenAI API:', data);
        throw new Error('Invalid response from OpenAI API');
      }
      
      return data.response;
    } catch (innerError) {
      console.error('Error during OpenAI API call:', innerError);
      // Add more specific error handling for lockdown errors
      if (innerError.message && innerError.message.includes('intrinsics')) {
        throw new Error('Security restriction detected. Please try again with different parameters.');
      }
      throw innerError;
    }
  } catch (error) {
    console.error('Error generating OpenAI response:', error);
    throw error;
  }
};
