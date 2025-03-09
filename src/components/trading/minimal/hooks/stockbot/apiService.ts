
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, StockbotApiResponse } from './types';

/**
 * Simulated API endpoint for Stockbot
 */
export async function callStockbotAPI(
  message: string,
  mockMarketData?: any[]
): Promise<StockbotApiResponse> {
  // This is a placeholder for actual API integration
  // In a real implementation, this would make a fetch call to an API endpoint

  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple simulation logic - if message contains certain keywords, return specific responses
    if (message.toLowerCase().includes('buy')) {
      return { 
        response: `Based on current market trends, buying now might be ${mockMarketData && mockMarketData.length > 0 ? 'a good strategy' : 'risky without more data'}. Before making any decision, consider your risk tolerance and investment horizon.`
      };
    } else if (message.toLowerCase().includes('sell')) {
      return { 
        response: `Selling decisions should be based on your investment goals. The current market ${mockMarketData && mockMarketData.length > 0 ? 'shows some volatility' : 'data is limited'}. Consider consulting with a financial advisor.`
      };
    } else if (message.toLowerCase().includes('market')) {
      return { 
        response: `The market is ${mockMarketData && mockMarketData.length > 0 ? 'showing some interesting patterns. Volume is ' + (Math.random() > 0.5 ? 'up' : 'down') + ' compared to yesterday.' : 'difficult to analyze without more comprehensive data.'}`
      };
    } else if (message.toLowerCase().includes('trend')) {
      return { 
        response: `Current trends indicate ${mockMarketData && mockMarketData.length > 0 ? 'a potential shift in market sentiment. Technical indicators are ' + (Math.random() > 0.5 ? 'bullish' : 'bearish') + ' on a short-term timeframe.' : 'insufficient data to make a confident assessment.'}`
      };
    } else {
      return { 
        response: `Thank you for your question about "${message}". ${mockMarketData && mockMarketData.length > 0 ? 'Based on available market data, I can assist with specific trading questions about price trends, volume analysis, or trading strategies.' : 'I can provide better insights with more specific questions about trading strategies or market analysis.'}`
      };
    }
  } catch (error) {
    console.error("Error calling Stockbot API:", error);
    return { 
      error: "Sorry, I encountered an error while processing your request. Please try again later."
    };
  }
}

/**
 * Create a properly formatted response message
 */
export function createAssistantMessage(content: string): ChatMessage {
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
 * Create an error message from Stockbot
 */
export function createErrorMessage(errorText: string): ChatMessage {
  return {
    id: uuidv4(),
    sender: 'assistant',
    role: 'assistant',
    text: errorText,
    content: errorText,
    timestamp: new Date()
  };
}
