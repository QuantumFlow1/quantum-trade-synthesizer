
import { supabase } from '@/lib/supabase';
import { GrokSettings } from '../types/GrokSettings';

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
    throw new Error('Claude API key not found');
  }
  
  console.log('Calling Claude API with key:', apiKey ? 'present' : 'not found');
  
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
  
  if (!claudeResult.error && claudeResult.data?.response) {
    console.log('Claude response received:', claudeResult.data.response.substring(0, 100) + '...');
    return claudeResult.data.response;
  } else {
    console.error('Claude API error:', claudeResult.error);
    throw claudeResult.error || new Error('No response from Claude API');
  }
};
