
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, StockbotApiResponse } from './types';

/**
 * Calls the Stockbot API to get a response to the user's message
 */
export async function callStockbotApi(
  message: string, 
  apiKey: string | null
): Promise<StockbotApiResponse> {
  try {
    // Log the API call for debugging
    console.log(`Calling Stockbot API with message length: ${message.length}`);
    console.log(`API key exists: ${!!apiKey}`);
    
    if (!apiKey) {
      throw new Error('No API key provided');
    }
    
    // Simulate network latency in development
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Call API endpoint - this would be replaced with the actual API call
    const response = await fetch('https://api.example.com/stockbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling Stockbot API:', error);
    return {
      response: `I'm having trouble connecting to the AI service. ${error instanceof Error ? error.message : 'Please try again later.'}`,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Creates a response message from the API
 */
export function createResponseMessage(content: string): ChatMessage {
  return {
    id: uuidv4(),
    sender: 'assistant',
    role: 'assistant',
    text: content,
    content: content,
    timestamp: new Date()
  };
}

/**
 * Creates an error message
 */
export function createErrorMessage(errorMessage: string): ChatMessage {
  return {
    id: uuidv4(),
    sender: 'assistant',
    role: 'assistant',
    text: `Error: ${errorMessage}`,
    content: `Error: ${errorMessage}`,
    timestamp: new Date()
  };
}
