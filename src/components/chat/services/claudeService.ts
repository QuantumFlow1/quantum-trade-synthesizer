
import { supabase } from '@/lib/supabase';

export const generateClaudeResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
) => {
  console.log('Using Claude API...');
  const claudeResult = await supabase.functions.invoke('claude-response', {
    body: { 
      message: inputMessage,
      context: conversationHistory
    }
  });
  
  if (!claudeResult.error && claudeResult.data?.response) {
    return claudeResult.data.response;
  } else {
    console.error('Claude API error:', claudeResult.error);
    throw claudeResult.error || new Error('Geen antwoord van Claude API');
  }
};
