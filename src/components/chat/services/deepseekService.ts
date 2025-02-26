
import { supabase } from '@/lib/supabase';

export const generateDeepSeekResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
) => {
  console.log('Using DeepSeek API...');
  const deepseekResult = await supabase.functions.invoke('deepseek-response', {
    body: { 
      message: inputMessage,
      context: conversationHistory
    }
  });
  
  if (!deepseekResult.error && deepseekResult.data?.response) {
    return deepseekResult.data.response;
  } else {
    console.error('DeepSeek API error:', deepseekResult.error);
    throw deepseekResult.error || new Error('Geen antwoord van DeepSeek API');
  }
};
