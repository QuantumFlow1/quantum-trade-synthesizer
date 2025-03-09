
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { ChatMessage, StockbotApiResponse } from './types';

/**
 * Makes a request to the Groq API via edge function
 */
export const fetchGroqApiResponse = async (
  prompt: string, 
  apiKey?: string
): Promise<StockbotApiResponse> => {
  console.log('Making request to Groq API via edge function');
  
  try {
    // Call the Groq Edge Function
    const { data, error } = await supabase.functions.invoke('groq-chat', {
      body: { 
        prompt,
        apiKey
      }
    });
    
    if (error) {
      console.error('Error calling Groq API:', error);
      return {
        response: "",
        error: error.message || 'Failed to get response from Groq'
      };
    }
    
    if (!data || !data.response) {
      console.error('Invalid response from Groq API:', data);
      
      if (data?.error) {
        return {
          response: "",
          error: `Groq API error: ${data.error}`
        };
      }
      
      return {
        response: "",
        error: 'Invalid response from Groq API'
      };
    }
    
    return { response: data.response };
  } catch (error) {
    console.error('Exception calling Groq API:', error);
    return {
      response: "",
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
};

/**
 * Simulates an API response for testing purposes
 */
export const simulateApiResponse = async (prompt: string): Promise<StockbotApiResponse> => {
  console.log('Simulating Stockbot API response');
  
  // Add a delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate a simple response based on the prompt
  const response = `This is a simulated response to your query: "${prompt}"\n\nIn simulation mode, no real API calls are made. This allows testing without using API credits or requiring an API key.`;
  
  return { response };
};

/**
 * Convert API response to a ChatMessage
 */
export const createResponseMessage = (response: string): ChatMessage => {
  return {
    id: uuidv4(),
    sender: 'assistant',
    role: 'assistant',
    text: response,
    content: response,
    timestamp: new Date()
  };
};
