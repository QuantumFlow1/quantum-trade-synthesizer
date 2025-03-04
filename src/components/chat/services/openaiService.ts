
import { supabase } from '@/lib/supabase';
import { GrokSettings } from '../types/GrokSettings';
import { toast } from '@/components/ui/use-toast';

export const generateOpenAIResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  settings?: GrokSettings
) => {
  console.log('Using OpenAI API...', { 
    messageLength: inputMessage?.length,
    historyLength: conversationHistory?.length,
    model: settings?.selectedModel
  });
  
  // Extract the OpenAI API key from settings
  const apiKey = settings?.apiKeys?.openaiApiKey;
  if (!apiKey) {
    throw new Error('OpenAI API key is required. Please set it in the settings.');
  }
  
  // Determine which model to use
  const model = settings?.selectedModel === 'gpt-4' ? 'gpt-4o' : 'gpt-4o-mini';
  console.log(`OpenAI: Using model ${model}`);
  
  try {
    // Display toast to inform user that we're processing
    toast({
      title: "OpenAI API",
      description: "Processing your request...",
      duration: 3000,
    });
    
    // Prepare the request to the OpenAI Edge Function
    const functionParams = { 
      message: inputMessage,
      context: conversationHistory,
      model: model,
      maxTokens: settings?.maxTokens || 1000,
      temperature: settings?.temperature || 0.7,
      apiKey: apiKey
    };
    
    console.log('Making request to OpenAI Edge Function with params:', {
      model: functionParams.model,
      maxTokens: functionParams.maxTokens,
      temperature: functionParams.temperature,
      messageLength: functionParams.message?.length,
      contextLength: functionParams.context?.length
    });
    
    // Make the request to the OpenAI Edge Function
    const response = await supabase.functions.invoke('openai-response', {
      body: functionParams
    });
    
    // Check for errors in the response
    if (response.error) {
      console.error('OpenAI Edge Function error:', response.error);
      
      // Provide more detailed error message based on the error type
      let errorMsg = 'OpenAI API Error: ';
      
      if (response.error.message.includes('non-2xx status code')) {
        errorMsg += 'The OpenAI API service might be temporarily unavailable. Please try again later or check your API key.';
      } else if (response.error.message.includes('timeout')) {
        errorMsg += 'Request timed out. The model might be overloaded, please try again later.';
      } else if (response.error.message.includes('API key')) {
        errorMsg += 'Invalid API key. Please check your API key in settings.';
      } else {
        errorMsg += response.error.message || 'Unknown error';
      }
      
      throw new Error(errorMsg);
    }
    
    // Check if we received a valid response
    if (!response.data?.response) {
      console.error('Invalid OpenAI response:', response.data);
      
      // If there's an error message in the response, show it
      if (response.data?.error) {
        throw new Error(`OpenAI API error: ${response.data.error}`);
      }
      
      throw new Error('Invalid response from OpenAI API. Please try again.');
    }
    
    // Log the successful response
    console.log('OpenAI response received successfully:', 
      response.data.response.substring(0, 100) + '...');
    
    return response.data.response;
  } catch (error) {
    console.error('Exception calling OpenAI:', error);
    
    // Provide a more descriptive error message
    let errorMessage = 'Error connecting to OpenAI API.';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error details:', error.message, error.stack);
    }
    
    // Check if the error is related to the API key
    if (errorMessage.includes('API key') || errorMessage.toLowerCase().includes('authentication')) {
      errorMessage = 'Invalid OpenAI API key. Please check your API key in settings.';
    }
    
    // Check if the error is related to the edge function being unavailable
    if (errorMessage.includes('non-2xx status code')) {
      errorMessage = 'OpenAI Edge Function is currently unavailable. This might be due to a temporary service issue or deployment error. Please try again later or use a different AI model.';
      
      // Show a toast with more helpful information
      toast({
        title: "OpenAI Service Unavailable",
        description: "Switching to a different AI service. Try again later or use another model.",
        variant: "destructive",
        duration: 5000,
      });
    }
    
    throw new Error(errorMessage);
  }
};
