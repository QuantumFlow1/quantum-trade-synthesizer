
import { supabase } from '@/lib/supabase';

export const generateGrok3Response = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
) => {
  console.log('Using Grok3 API...');
  const grokResult = await supabase.functions.invoke('grok3-response', {
    body: { 
      message: inputMessage,
      context: conversationHistory
    }
  });
  
  if (!grokResult.error && grokResult.data?.response) {
    return grokResult.data.response;
  } else {
    console.error('Grok3 API error:', grokResult.error);
    throw grokResult.error || new Error('Geen antwoord van Grok3 API');
  }
};
