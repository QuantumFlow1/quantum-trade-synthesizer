
import { supabase } from '@/lib/supabase';

/**
 * A simple client for interacting with the Groq API
 */
export class GroqApiClient {
  private apiKey?: string;
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }
  
  /**
   * Sends a chat completion request to the Groq API
   * @param messages Array of message objects with role and content
   * @param model The model to use (defaults to llama-3.3-70b-versatile)
   * @returns The completion response
   */
  async createChatCompletion(
    messages: Array<{ role: 'system' | 'user' | 'assistant', content: string }>,
    model: string = 'llama-3.3-70b-versatile'
  ) {
    try {
      console.log(`Sending chat completion request to Groq API with model: ${model}`);
      
      // First try to get API key from localStorage
      const localStorageKey = localStorage.getItem('groqApiKey');
      const apiKey = this.apiKey || localStorageKey;
      
      // Create headers object
      const headers: Record<string, string> = {};
      if (apiKey) {
        headers['x-groq-api-key'] = apiKey;
      }
      
      // Call our edge function which will handle the API request
      const { data, error } = await supabase.functions.invoke('groq-chat', {
        body: {
          messages,
          model,
        },
        headers
      });
      
      if (error) {
        console.error('Error calling Groq API via edge function:', error);
        throw new Error(error.message || 'Error calling Groq API');
      }
      
      return data;
    } catch (error) {
      console.error('Error in createChatCompletion:', error);
      throw error;
    }
  }
  
  /**
   * Sets the API key for this client instance
   * @param apiKey The Groq API key
   */
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  /**
   * Checks if a Groq API key is available (either provided to this client or in localStorage)
   * @returns Boolean indicating if an API key is available
   */
  hasApiKey(): boolean {
    return !!(this.apiKey || localStorage.getItem('groqApiKey'));
  }
}

// Export a singleton instance for easy import
export const groqApi = new GroqApiClient();

// Export a testing function to check if the Groq API is working
export async function testGroqApiConnection(): Promise<{ success: boolean, message: string }> {
  try {
    const response = await groqApi.createChatCompletion([
      { role: 'user', content: 'Hello, are you working? Please respond with a single word: "Working"' }
    ]);
    
    if (response.status === 'success') {
      return { 
        success: true, 
        message: 'Successfully connected to Groq API' 
      };
    } else {
      return { 
        success: false, 
        message: response.error || 'Unknown error occurred' 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to connect to Groq API'
    };
  }
}
