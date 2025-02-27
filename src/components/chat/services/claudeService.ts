
import { supabase } from '@/lib/supabase';
import { GrokSettings } from '../types/GrokSettings';
import { toast } from '@/components/ui/use-toast';

export const generateClaudeResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  settings?: GrokSettings
) => {
  console.log('Starting Claude API request...', { 
    messageLength: inputMessage.length,
    historyLength: conversationHistory.length,
    model: settings?.selectedModel || 'claude-3-haiku-20240307',
    temperature: settings?.temperature || 0.7
  });
  
  // Check for API key in both settings and localStorage
  const apiKey = settings?.apiKeys?.claudeApiKey || localStorage.getItem('claudeApiKey');
  
  if (!apiKey) {
    console.error('Claude API key not found in settings or localStorage');
    toast({
      title: "API Key Required",
      description: "You need to provide a Claude API key in settings",
      variant: "destructive"
    });
    throw new Error('Claude API key not found');
  }
  
  console.log('Calling Claude API with key:', apiKey ? `present (key length: ${apiKey.length})` : 'not found');
  
  try {
    console.log('Invoking claude-response edge function...');
    
    // Prepare the request payload with all necessary parameters
    const payload = { 
      message: inputMessage,
      context: conversationHistory,
      model: settings?.selectedModel === 'claude' ? 'claude-3-haiku-20240307' : settings?.selectedModel || 'claude-3-haiku-20240307',
      maxTokens: settings?.maxTokens || 1024,
      temperature: settings?.temperature || 0.7,
      apiKey: apiKey
    };
    
    console.log('Edge function payload prepared:', {
      model: payload.model,
      messageLength: payload.message.length,
      contextLength: payload.context.length
    });
    
    // Call the edge function
    const { data, error } = await supabase.functions.invoke('claude-response', {
      body: payload
    });
    
    // Log the response for debugging
    console.log('Edge function response received:', error ? 'Error' : 'Success', data);
    
    if (error) {
      console.error('Claude API error from edge function:', error);
      toast({
        title: "Claude API Error",
        description: error.message || 'Error calling Claude API',
        variant: "destructive",
        duration: 5000,
      });
      throw new Error(error.message || 'Error calling Claude API');
    }
  
    // Check for missing response data
    if (!data?.response) {
      console.error('No response data from Claude API:', data);
      
      // Handle error message in data
      if (data?.error) {
        toast({
          title: "Claude API Error",
          description: data.error,
          variant: "destructive",
          duration: 5000,
        });
        throw new Error(data.error);
      } else {
        toast({
          title: "Invalid Response",
          description: "Received an invalid response from Claude API",
          variant: "destructive",
          duration: 5000,
        });
        throw new Error('No response from Claude API');
      }
    }
    
    console.log('Claude response successfully received:', 
      data.response.substring(0, 100) + '...');
    
    return data.response;
    
  } catch (error) {
    console.error('Claude API call exception:', error);
    toast({
      title: "Claude API Error",
      description: error instanceof Error ? error.message : "Failed to get response from Claude",
      variant: "destructive",
      duration: 5000,
    });
    throw error;
  }
};
