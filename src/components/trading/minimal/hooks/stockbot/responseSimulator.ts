
import { ChatMessage } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a simulated response for Stockbot
 */
export const generateStockbotResponse = (message: string, marketData: any[] = []): ChatMessage => {
  const responseText = getSimulatedResponse(message, marketData);
  
  return {
    id: uuidv4(),
    sender: 'assistant',
    text: responseText,
    timestamp: new Date()
  };
};

/**
 * Function to generate simulated responses
 */
export function getSimulatedResponse(message: string, marketData: any[]): string {
  message = message.toLowerCase();
  
  // Price inquiry
  if (message.includes("price") || message.includes("market") || message.includes("trading at")) {
    const price = marketData.length > 0 
      ? marketData[marketData.length - 1].close 
      : Math.floor(Math.random() * 10000) + 30000;
    
    return `Based on the latest data, Bitcoin (BTC) is currently trading at $${price.toFixed(2)}. The market has been ${Math.random() > 0.5 ? "bullish" : "bearish"} over the past 24 hours.`;
  }
  
  // Trading strategy
  if (message.includes("strategy") || message.includes("trade") || message.includes("invest")) {
    return "For a solid trading strategy, consider using dollar-cost averaging (DCA) when entering positions. It's also important to set clear stop-loss levels to manage risk. Remember that diversification across multiple assets can help reduce overall portfolio volatility.";
  }
  
  // Market analysis
  if (message.includes("analysis") || message.includes("predict") || message.includes("forecast")) {
    return "Market analysis suggests that we're currently in a consolidation phase. Key support levels are around $30,500, while resistance is forming at $36,200. Trading volume has been declining, which could indicate a potential breakout in the near future.";
  }
  
  // Default response
  return "I'm your trading assistant. I can help with market analysis, trading strategies, and keeping track of cryptocurrency prices. What would you like to know about the crypto market today?";
}
