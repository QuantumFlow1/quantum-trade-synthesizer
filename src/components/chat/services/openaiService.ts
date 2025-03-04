
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
  
  try {
    // Display toast to inform user that we're processing
    toast({
      title: "OpenAI API",
      description: "Processing your request...",
      duration: 3000,
    });
    
    // Determine which model to use - default to gpt-3.5-turbo if not specified
    const model = settings?.selectedModel?.startsWith('gpt-4') 
      ? 'gpt-4' 
      : settings?.selectedModel === 'gpt-3.5-turbo'
        ? 'gpt-3.5-turbo'
        : 'gpt-3.5-turbo';
    
    console.log(`OpenAI: Using model ${model}`);
    
    // Prepare API parameters
    const apiParams = { 
      messages: conversationHistory,
      model: model,
      max_tokens: settings?.maxTokens || 1000,
      temperature: settings?.temperature || 0.7,
      apiKey: apiKey
    };
    
    console.log('Making request to OpenAI with params:', {
      model: apiParams.model,
      max_tokens: apiParams.max_tokens,
      temperature: apiParams.temperature,
      messagesCount: apiParams.messages?.length
    });
    
    // Make direct request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: apiParams.model,
        messages: apiParams.messages,
        max_tokens: apiParams.max_tokens,
        temperature: apiParams.temperature
      })
    });
    
    // Check for errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', response.status, errorData);
      
      // Provide user-friendly error messages based on status code
      if (response.status === 401) {
        throw new Error('Invalid OpenAI API key. Please check your API key in settings.');
      } else if (response.status === 429) {
        throw new Error('OpenAI rate limit exceeded. Please try again later.');
      } else if (response.status >= 500) {
        throw new Error('OpenAI service is currently unavailable. Please try again later.');
      } else {
        throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
      }
    }
    
    // Parse the response
    const data = await response.json();
    
    // Check for valid response format
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('Invalid OpenAI response format:', data);
      throw new Error('Received invalid response format from OpenAI API');
    }
    
    console.log('OpenAI response received successfully');
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in generateOpenAIResponse:', error);
    
    // Format user-friendly error message
    let errorMessage = 'Error connecting to OpenAI API.';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    if (errorMessage.includes('API key')) {
      errorMessage = 'Invalid OpenAI API key. Please check your API key in settings.';
    }
    
    throw new Error(errorMessage);
  }
};
