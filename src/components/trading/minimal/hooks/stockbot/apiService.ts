
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, StockbotApiResponse } from './types';

/**
 * Call the Stockbot API with the user message
 * @param message User's message
 * @param apiKey Groq API key
 * @returns Promise with the API response
 */
export const callStockbotAPI = async (
  message: string, 
  apiKey: string
): Promise<StockbotApiResponse> => {
  try {
    console.log('Calling Stockbot API with message:', message);
    
    // For now, simulate the API call
    // TODO: Replace with actual API call when ready
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responseText = generateSimulatedResponse(message);
    
    return {
      success: true,
      response: responseText
    };
  } catch (error) {
    console.error('Error calling Stockbot API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

/**
 * Create an assistant message from the API response
 * @param text The response text from the API
 * @returns A formatted ChatMessage
 */
export const createAssistantMessage = (text: string): ChatMessage => {
  return {
    id: uuidv4(),
    sender: 'assistant', // This is correct now that we've updated the type
    role: 'assistant',
    content: text,
    text: text,
    timestamp: new Date()
  };
};

/**
 * Create an error message as an assistant message
 * @param errorText The error text to display
 * @returns A formatted ChatMessage
 */
export const createErrorMessage = (errorText: string): ChatMessage => {
  return {
    id: uuidv4(),
    sender: 'assistant', // This is correct now that we've updated the type
    role: 'assistant',
    content: `Error: ${errorText}`,
    text: `Error: ${errorText}`,
    timestamp: new Date()
  };
};

/**
 * Generate a simulated response for testing purposes
 * @param message The user's message
 * @returns A simulated response
 */
function generateSimulatedResponse(message: string): string {
  const lowercaseMessage = message.toLowerCase();
  
  // Simple pattern matching for different types of questions
  if (lowercaseMessage.includes('stock') && lowercaseMessage.includes('recommend')) {
    return "Based on current market analysis, I recommend considering some stable dividend stocks in the technology and healthcare sectors. However, please remember that all investments carry risk and you should do your own research.";
  } else if (lowercaseMessage.includes('market') && (lowercaseMessage.includes('outlook') || lowercaseMessage.includes('forecast'))) {
    return "The market outlook appears cautiously optimistic with major indices showing stability. The Fed's recent comments suggest a potential rate adjustment in the coming quarter, which might impact market dynamics.";
  } else if (lowercaseMessage.includes('portfolio') && lowercaseMessage.includes('diversif')) {
    return "Diversification is key to managing risk. I suggest allocating your investments across different sectors such as technology, healthcare, consumer staples, and possibly some international exposure depending on your risk tolerance.";
  } else if (lowercaseMessage.includes('trading') && lowercaseMessage.includes('strateg')) {
    return "Effective trading strategies often combine technical analysis with fundamental research. Consider setting clear entry and exit points, managing position sizes based on your risk tolerance, and avoiding emotional decision-making.";
  }
  
  // Default response for other questions
  return "I'm your Stockbot assistant. I can help with market analysis, trading strategies, and investment recommendations. What specific information are you looking for today?";
}
