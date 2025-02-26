
import { supabase } from '@/lib/supabase';
import { GrokSettings, ModelId } from '../types/GrokSettings';

interface OpenAIOptions {
  temperature?: number;
  maxTokens?: number;
}

export const generateOpenAIResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  options?: OpenAIOptions
) => {
  console.log('Using OpenAI API...', options);
  const openaiResult = await supabase.functions.invoke('openai-response', {
    body: { 
      message: inputMessage,
      context: conversationHistory,
      options: {
        temperature: options?.temperature || 0.7,
        maxTokens: options?.maxTokens || 1024
      }
    }
  });
  
  if (!openaiResult.error && openaiResult.data?.response) {
    return openaiResult.data.response;
  } else {
    console.error('OpenAI API error:', openaiResult.error);
    throw openaiResult.error || new Error('Geen antwoord van OpenAI API');
  }
};
