
import { supabase } from '@/lib/supabase';

export const generateOpenAIResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
) => {
  console.log('Using OpenAI API...');
  const openaiResult = await supabase.functions.invoke('openai-response', {
    body: { 
      message: inputMessage,
      context: conversationHistory
    }
  });
  
  if (!openaiResult.error && openaiResult.data?.response) {
    return openaiResult.data.response;
  } else {
    console.error('OpenAI API error:', openaiResult.error);
    throw openaiResult.error || new Error('Geen antwoord van OpenAI API');
  }
};
