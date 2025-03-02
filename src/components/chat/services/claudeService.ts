
import { GrokSettings } from '../types/GrokSettings';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { getApiKey } from './utils/apiHelpers';

export const generateClaudeResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  settings: GrokSettings
): Promise<string> => {
  try {
    // Get the API key from settings, localStorage, or admin keys
    const apiKey = await getApiKey('claude', settings.apiKeys.claudeApiKey);
    
    if (!apiKey) {
      console.error('Claude API key is missing');
      toast({
        title: "Missing API Key",
        description: "No Claude API key is available. Please set one in settings or contact an administrator.",
        variant: "destructive"
      });
      throw new Error('Claude API key is missing');
    }
    
    console.log('Calling Claude API with model:', settings.selectedModel);
    
    // Determine which Claude model to use
    let modelName = 'claude-3-haiku-20240307';
    if (settings.selectedModel === 'claude-3-sonnet') {
      modelName = 'claude-3-sonnet-20240229';
    } else if (settings.selectedModel === 'claude-3-opus') {
      modelName = 'claude-3-opus-20240229';
    }
    
    // Format conversation history for Claude
    const messages = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
    
    // Add the new user message
    messages.push({
      role: 'user',
      content: inputMessage
    });
    
    try {
      // Call Supabase Edge Function for Claude response
      const { data, error } = await supabase.functions.invoke('claude-response', {
        body: {
          messages,
          model: modelName,
          temperature: settings.temperature || 0.7,
          max_tokens: settings.maxTokens || 1024,
          apiKey: apiKey
        }
      });
      
      if (error) {
        console.error('Claude Supabase function error:', error);
        throw new Error(`Claude API Error: ${error.message}`);
      }
      
      if (!data || !data.response) {
        console.error('Invalid response from Claude API:', data);
        throw new Error('Invalid response from Claude API');
      }
      
      console.log('Claude response:', data.response.substring(0, 100) + '...');
      return data.response;
    } catch (innerError) {
      console.error('Error during Claude API call:', innerError);
      throw innerError;
    }
  } catch (error) {
    console.error('Error generating Claude response:', error);
    throw error;
  }
};
