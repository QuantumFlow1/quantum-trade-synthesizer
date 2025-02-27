
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
  
  console.log('Calling Claude API with key:', apiKey ? 'present (key length: ' + apiKey.length + ')' : 'not found');
  
  try {
    const claudeResult = await supabase.functions.invoke('claude-response', {
      body: { 
        message: inputMessage,
        context: conversationHistory,
        model: 'claude-3-haiku-20240307',
        maxTokens: settings?.maxTokens || 1024,
        temperature: settings?.temperature || 0.7,
        apiKey: apiKey
      }
    });
    
    if (claudeResult.error) {
      console.error('Claude API error from edge function:', claudeResult.error);
      toast({
        title: "Claude API Error",
        description: claudeResult.error.message || 'Error calling Claude API',
        variant: "destructive",
        duration: 5000,
      });
      throw new Error(claudeResult.error.message || 'Error calling Claude API');
    }
  
    if (!claudeResult.data?.response) {
      console.error('No response data from Claude API:', claudeResult);
      toast({
        title: "Invalid Response",
        description: "Received an invalid response from Claude API",
        variant: "destructive",
        duration: 5000,
      });
      throw new Error('No response from Claude API');
    }
    
    console.log('Claude response received:', claudeResult.data.response.substring(0, 100) + '...');
    return claudeResult.data.response;
    
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
