
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
  console.log('Using OpenAI API...', { 
    message: inputMessage,
    options: options,
    conversationHistoryLength: conversationHistory.length
  });
  
  try {
    // Log request to help with debugging
    console.log('Sending request to OpenAI API with:', {
      message: inputMessage.substring(0, 50) + '...',
      temperature: options?.temperature || 0.7,
      maxTokens: options?.maxTokens || 1024,
      historyLength: conversationHistory.length
    });
    
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
    
    console.log('OpenAI API full response:', openaiResult);
    
    if (openaiResult.error) {
      console.error('OpenAI API error:', openaiResult.error);
      throw new Error(`OpenAI API error: ${openaiResult.error.message || 'Unknown error'}`);
    }
    
    if (!openaiResult.data) {
      console.error('OpenAI API returned no data');
      throw new Error('No response data from OpenAI API');
    }
    
    // Handle different possible response formats from the edge function
    let responseText = '';
    
    if (typeof openaiResult.data === 'string') {
      responseText = openaiResult.data;
    } else if (openaiResult.data.response) {
      responseText = openaiResult.data.response;
    } else if (openaiResult.data.text) {
      responseText = openaiResult.data.text;
    } else if (openaiResult.data.content) {
      responseText = openaiResult.data.content;
    } else if (openaiResult.data.message) {
      responseText = openaiResult.data.message;
    } else if (openaiResult.data.generatedText) {
      responseText = openaiResult.data.generatedText;
    } else if (openaiResult.data.choices && openaiResult.data.choices.length > 0) {
      const choice = openaiResult.data.choices[0];
      responseText = choice.message?.content || choice.text || '';
    }
    
    if (!responseText) {
      console.error('Could not extract response text from OpenAI result:', openaiResult.data);
      throw new Error('Unable to parse OpenAI response');
    }
    
    console.log('Extracted OpenAI response text:', responseText.substring(0, 100) + '...');
    return responseText;
    
  } catch (error) {
    console.error('Error in OpenAI service:', error);
    throw error || new Error('Failed to get response from OpenAI API');
  }
};
