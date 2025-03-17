
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

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
      
      if (!apiKey) {
        console.error('No Groq API key available');
        return {
          status: 'error',
          error: 'No Groq API key available. Please configure your API key in settings.'
        };
      }
      
      // Be more lenient with API key format validation - only warn but don't block
      if (!apiKey.startsWith('gsk_')) {
        console.warn('Groq API key does not start with "gsk_", but proceeding anyway');
      }
      
      // Create headers object
      const headers: Record<string, string> = {};
      if (apiKey) {
        headers['x-groq-api-key'] = apiKey;
      }
      
      console.log('Calling Groq API edge function with headers set:', !!headers['x-groq-api-key']);
      
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
        
        // Show a toast notification for API errors
        toast({
          title: "API Error",
          description: error.message || "Error calling Groq API",
          variant: "destructive"
        });
        
        return {
          status: 'error',
          error: error.message || 'Error calling Groq API'
        };
      }
      
      return data;
    } catch (error) {
      console.error('Error in createChatCompletion:', error);
      
      // Show a toast notification for exceptions
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      
      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
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
  
  /**
   * Validates if the provided or stored API key is in the correct format
   * @returns Boolean indicating if the API key is valid
   */
  hasValidApiKey(): boolean {
    const key = this.apiKey || localStorage.getItem('groqApiKey');
    // Be more lenient with validation - just check if it exists and has reasonable length
    return !!key && key.length > 10;
  }
}

// Export a singleton instance for easy import
export const groqApi = new GroqApiClient();

// Export a testing function to check if the Groq API is working
export async function testGroqApiConnection(): Promise<{ success: boolean, message: string }> {
  try {
    if (!groqApi.hasValidApiKey()) {
      return { 
        success: false, 
        message: 'No valid Groq API key found. Please ensure your API key is at least 10 characters.'
      };
    }
    
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
