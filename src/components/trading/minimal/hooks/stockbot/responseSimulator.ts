
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, StockbotMessage } from './types';

/**
 * Generates a simulated response from Stockbot based on the user's message
 */
export function generateStockbotResponse(message: string, marketData: any[] = []): ChatMessage {
  // Generate a response based on the message content
  let responseContent = '';
  
  // Convert message to lowercase for easier matching
  const lowercaseMessage = message.toLowerCase();
  
  // Check for common phrases and generate appropriate responses
  if (lowercaseMessage.includes('hello') || 
      lowercaseMessage.includes('hi') || 
      lowercaseMessage.includes('hey')) {
    responseContent = "Hello! I'm Stockbot, your virtual trading assistant. How can I help you today?";
  }
  else if (lowercaseMessage.includes('help')) {
    responseContent = "I can help you analyze market trends, track specific stocks, or provide general trading advice. What would you like to know?";
  }
  else if (lowercaseMessage.includes('api key') || 
          lowercaseMessage.includes('not working')) {
    responseContent = "To access advanced AI features, you'll need to configure a Groq API key. You can do this by clicking on the settings icon and entering your API key. Currently running in simulation mode.";
  }
  else if (lowercaseMessage.includes('market') || 
          lowercaseMessage.includes('trend')) {
    // Use market data if available
    if (marketData && marketData.length > 0) {
      const randomTrend = Math.random() > 0.5 ? 'bullish' : 'bearish';
      responseContent = `Based on the latest market data, I'm seeing ${randomTrend} trends across most sectors. The overall market volatility index is ${Math.floor(Math.random() * 30) + 10}%, which suggests caution in short-term trading.`;
    } else {
      responseContent = "The market shows mixed signals today. Tech stocks are generally trending upward, while energy sectors are experiencing some volatility.";
    }
  }
  else if (lowercaseMessage.includes('stock') || 
          lowercaseMessage.includes('buy') || 
          lowercaseMessage.includes('sell')) {
    responseContent = "While I can't provide specific investment advice, generally it's important to consider your risk tolerance, investment timeline, and portfolio diversification before making any trading decisions.";
  }
  else if (lowercaseMessage.includes('bitcoin') || 
          lowercaseMessage.includes('crypto') || 
          lowercaseMessage.includes('btc')) {
    responseContent = "Cryptocurrency markets are known for their volatility. Bitcoin has shown significant price movements recently. Remember that crypto investments carry higher risk compared to traditional assets.";
  }
  else {
    // Default response for other queries
    responseContent = "I understand you're interested in trading information. Could you provide more specific details about what you'd like to know? I can discuss market trends, general trading concepts, or basic stock information.";
  }
  
  // Add a disclaimer for simulation mode
  responseContent += "\n\n[Note: This is a simulated response. For personalized AI-powered analysis, please configure your Groq API key in settings.]";
  
  return {
    id: uuidv4(),
    sender: 'assistant',
    role: 'assistant',
    text: responseContent,
    content: responseContent,
    timestamp: new Date()
  };
}

/**
 * Generates an error response
 */
export function generateErrorResponse(errorMsg: string): ChatMessage {
  return {
    id: uuidv4(),
    sender: 'assistant',
    role: 'assistant',
    text: `I encountered an error: ${errorMsg}. Please try again later or contact support if the issue persists.`,
    content: `I encountered an error: ${errorMsg}. Please try again later or contact support if the issue persists.`,
    timestamp: new Date()
  };
}

// For backward compatibility
export const generateSimulatedResponse = generateStockbotResponse;
