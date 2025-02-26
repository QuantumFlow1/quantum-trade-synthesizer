
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
    
    // Check for different response formats
    let responseText;
    if (typeof openaiResult.data?.response === 'string') {
      responseText = openaiResult.data.response;
    } else if (openaiResult.data?.response?.content) {
      // Handle case where response is an object with content property
      responseText = openaiResult.data.response.content;
    } else if (openaiResult.data?.content) {
      // Handle case where content is directly on data
      responseText = openaiResult.data.content;
    } else if (openaiResult.data?.choices && openaiResult.data.choices.length > 0) {
      // Handle standard OpenAI API format
      responseText = openaiResult.data.choices[0].message?.content || '';
    } else {
      console.error('Unexpected OpenAI API response format:', openaiResult.data);
      throw new Error('Unexpected response format from OpenAI API');
    }
    
    if (!responseText) {
      console.error('No text content in OpenAI response:', openaiResult.data);
      throw new Error('Geen tekstinhoud in OpenAI-antwoord');
    }
    
    console.log('Extracted OpenAI response text:', responseText);
    return responseText;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};
