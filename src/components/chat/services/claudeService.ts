
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
    historyLength: conversationHistory.length
  });
  
  // Check for API key in both settings and localStorage
  const apiKey = settings?.apiKeys?.claudeApiKey || localStorage.getItem('claudeApiKey');
  
  if (!apiKey) {
    console.error('Claude API key not found in settings or localStorage');
    throw new Error('Claude API key not found. Please add your API key in settings.');
  }
  
  console.log('Calling Claude API with key:', apiKey ? 'present' : 'not found');
  
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
      console.error('Claude API error:', claudeResult.error);
      throw new Error(`Claude API error: ${claudeResult.error.message || 'Unknown error'}`);
    }
    
    if (!claudeResult.data?.response) {
      console.error('No response data from Claude API');
      throw new Error('No response received from Claude');
    }
    
    console.log('Claude response received:', claudeResult.data.response.substring(0, 100) + '...');
    return claudeResult.data.response;
  } catch (error) {
    console.error('Error in Claude API call:', error);
    
    // Show a toast with the error
    toast({
      title: "Claude API Error",
      description: error instanceof Error ? error.message : "Failed to connect to Claude",
      variant: "destructive",
      duration: 5000,
    });
    
    throw error;
  }
};
