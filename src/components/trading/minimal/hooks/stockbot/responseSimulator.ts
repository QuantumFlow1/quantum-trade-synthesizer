
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from './types';

/**
 * Generate a simulated stockbot response based on user input
 */
export function generateStockbotResponse(userInput: string, marketData: any[] = []): ChatMessage {
  // Lowercase the input for easier matching
  const input = userInput.toLowerCase();
  
  let responseText = '';
  
  // Check for market data availability to provide more contextual responses
  const hasMarketData = Array.isArray(marketData) && marketData.length > 0;
  const currentMarket = hasMarketData ? marketData[marketData.length - 1] : null;
  
  // Generate different responses based on input keywords
  if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
    responseText = 'Hello! I\'m Stockbot, your trading assistant. How can I help you today?';
  } 
  else if (input.includes('help') || input.includes('what can you do')) {
    responseText = 'I can help you with market analysis, trading strategies, and answer questions about financial markets. Feel free to ask me about specific stocks, trends, or indicators!';
  }
  else if (input.includes('price') || input.includes('current price') || input.includes('how much')) {
    if (hasMarketData && currentMarket) {
      const price = currentMarket.close || currentMarket.price || 45000;
      const symbol = currentMarket.symbol || 'BTC';
      responseText = `The current price of ${symbol} is $${price.toLocaleString()}. This is based on the latest data I have available.`;
    } else {
      responseText = 'I don\'t have the latest price data available at the moment. Please check a financial website for the most up-to-date information.';
    }
  }
  else if (input.includes('trend') || input.includes('direction') || input.includes('market direction')) {
    if (hasMarketData && marketData.length > 1) {
      const latestPrice = currentMarket.close || currentMarket.price || 0;
      const previousPrice = marketData[marketData.length - 2].close || marketData[marketData.length - 2].price || 0;
      
      if (latestPrice > previousPrice) {
        responseText = 'The market is currently showing an upward trend. However, remember that past performance is not indicative of future results.';
      } else if (latestPrice < previousPrice) {
        responseText = 'The market is currently showing a downward trend. However, market conditions can change rapidly.';
      } else {
        responseText = 'The market is currently stable with minimal price movement.';
      }
    } else {
      responseText = 'I cannot determine the current market trend without sufficient data. Consider consulting a financial professional for up-to-date analysis.';
    }
  }
  else if (input.includes('buy') || input.includes('should i buy')) {
    responseText = 'I cannot provide specific investment advice. Trading decisions should be based on your own research, financial situation, and risk tolerance. Consider consulting a financial advisor before making investment decisions.';
  }
  else if (input.includes('sell') || input.includes('should i sell')) {
    responseText = 'I cannot recommend whether to sell any security. Investment decisions should be based on your individual financial goals and circumstances. Consider speaking with a financial advisor for personalized advice.';
  }
  else if (input.includes('strategy') || input.includes('trading strategy') || input.includes('best strategy')) {
    responseText = 'Common trading strategies include day trading, swing trading, position trading, and buy-and-hold investing. Each has different risk profiles and time commitments. The best strategy depends on your individual goals, risk tolerance, and available time for market analysis.';
  }
  else if (input.includes('risk') || input.includes('risky')) {
    responseText = 'All investments carry risk. It\'s important to diversify your portfolio and only invest what you can afford to lose, especially in volatile markets like cryptocurrencies. Risk management strategies include setting stop-loss orders and position sizing.';
  }
  else if (input.includes('indicator') || input.includes('technical analysis')) {
    responseText = 'Common technical indicators include Moving Averages, RSI, MACD, and Bollinger Bands. They can help identify trends and potential entry/exit points, but should be used alongside other forms of analysis for better results.';
  }
  else {
    // Generic response for unrecognized inputs
    responseText = 'That\'s an interesting question about the markets. As a simulated assistant, I have limited capabilities, but I can help with basic market information and general trading concepts. Feel free to ask about price trends, indicators, or trading strategies!';
  }
  
  return {
    id: uuidv4(),
    sender: 'assistant',
    role: 'assistant',
    text: responseText,
    content: responseText,
    timestamp: new Date()
  };
}

/**
 * Generate an error response message
 */
export function generateErrorResponse(errorMessage: string): ChatMessage {
  return {
    id: uuidv4(),
    sender: 'assistant',
    role: 'assistant',
    text: errorMessage,
    content: errorMessage,
    timestamp: new Date()
  };
}
