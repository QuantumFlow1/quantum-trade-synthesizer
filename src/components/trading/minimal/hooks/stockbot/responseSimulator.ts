
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from './types';

/**
 * Generate simulated responses for the stockbot chat
 */
export const generateStockbotResponse = (
  inputMessage: string,
  marketData: any[] = []
): ChatMessage => {
  // Get the latest price from market data if available
  const latestPrice = marketData && marketData.length > 0 
    ? marketData[marketData.length - 1].close 
    : 43500.75;
  
  // Determine response based on input message content
  let responseText = "I'm your trading assistant. How can I help you today?";
  
  if (inputMessage.toLowerCase().includes('price')) {
    responseText = `Based on the latest data, Bitcoin is trading at $${latestPrice.toFixed(2)}.`;
  } else if (inputMessage.toLowerCase().includes('market')) {
    responseText = "The market has been showing increased volatility. It's important to manage risk and avoid emotional decisions.";
  } else if (inputMessage.toLowerCase().includes('strategy')) {
    responseText = "For a good trading strategy, consider dollar-cost averaging and setting clear stop-loss levels. Would you like me to explain more?";
  } else if (inputMessage.toLowerCase().includes('trade') || inputMessage.toLowerCase().includes('buy') || inputMessage.toLowerCase().includes('sell')) {
    responseText = "I can provide market insights, but I recommend making trading decisions based on your own research and risk tolerance. Would you like to know more about risk management?";
  } else if (inputMessage.toLowerCase().includes('analysis')) {
    responseText = "Technical analysis suggests the market is currently in a consolidation phase. Key resistance levels are at $46,000 and support levels at $42,000.";
  } else if (inputMessage.toLowerCase().includes('help')) {
    responseText = "I can help with market data, trading strategies, risk management, and general market information. What specific area are you interested in?";
  }
  
  // Return formatted message
  return {
    id: uuidv4(),
    sender: 'assistant',
    role: 'assistant',
    text: responseText,
    content: responseText,
    timestamp: new Date()
  };
};

/**
 * Generate error response for the stockbot chat
 */
export const generateErrorResponse = (errorMessage: string = "Sorry, I encountered an error processing your request."): ChatMessage => {
  return {
    id: uuidv4(),
    sender: 'assistant',
    role: 'assistant',
    text: errorMessage,
    content: errorMessage,
    timestamp: new Date()
  };
};
