
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
  
  try {
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
    
    console.log('OpenAI API response:', openaiResult);
    
    if (openaiResult.error) {
      console.error('OpenAI API error:', openaiResult.error);
      throw new Error(openaiResult.error.message || 'Error from OpenAI API');
    }
    
    if (!openaiResult.data?.response) {
      console.error('No response data from OpenAI API');
      throw new Error('Geen antwoord van OpenAI API');
    }
    
    return openaiResult.data.response;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};
