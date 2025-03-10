
import { ChatMessage } from "./types";

// Simple response generator for when API is not available
export const generateStockbotResponse = (inputMessage: string, marketData: any[] = []): ChatMessage => {
  console.log('Using simulation mode to generate response');
  
  // Default response in case nothing matches
  let responseText = "I'm Stockbot, your trading assistant. I can help you analyze market data and provide insights about stocks. What would you like to know?";
  
  // Normalize input for easier matching
  const normalizedInput = inputMessage.toLowerCase();
  
  // Check for common queries to provide more targeted responses
  if (normalizedInput.includes('hello') || normalizedInput.includes('hi ') || normalizedInput === 'hi') {
    responseText = "Hello! I'm Stockbot, your trading assistant. How can I help you with market analysis today?";
  }
  else if (normalizedInput.includes('help') || normalizedInput.includes('what can you do')) {
    responseText = "I can help you with market analysis, stock information, and trading insights. You can ask me about specific stocks, market trends, or trading strategies. For example, try asking 'How is AAPL performing?' or 'Show me tech sector performance'.";
  }
  else if (normalizedInput.includes('chart') || normalizedInput.includes('graph')) {
    const symbol = extractSymbol(normalizedInput) || 'AAPL';
    responseText = `I'd be happy to show you a chart for ${symbol}. In the full version with API access, I would display an interactive chart here. [TradingView Chart Widget for ${symbol} with timeframe 1M]`;
  }
  else if (normalizedInput.includes('sector') || normalizedInput.includes('industry')) {
    const sector = extractSector(normalizedInput) || 'technology';
    responseText = `Here's an overview of the ${sector} sector performance. In the full version with API access, I would display a heatmap. [Market Heatmap for ${sector} sectors]`;
  }
  else if (normalizedInput.includes('news') || normalizedInput.includes('headlines')) {
    const symbol = extractSymbol(normalizedInput) || 'market';
    responseText = `Let me show you the latest news for ${symbol === 'market' ? 'the overall market' : symbol}. [Latest news for ${symbol} (3 items)]`;
  }
  else if (normalizedInput.includes('sentiment') || normalizedInput.includes('analysis') || normalizedInput.includes('feeling') || normalizedInput.includes('opinion')) {
    const symbol = extractSymbol(normalizedInput) || 'AAPL';
    responseText = `I'd be happy to analyze the market sentiment for ${symbol}. Here's the current sentiment analysis: [Sentiment Analysis for ${symbol}]`;
  }
  else if (normalizedInput.includes('price') || normalizedInput.includes('value') || normalizedInput.includes('worth')) {
    const symbol = extractSymbol(normalizedInput);
    if (symbol) {
      const priceData = getSimulatedPriceData(symbol);
      responseText = `${symbol} is currently trading at $${priceData.price}. It's ${priceData.change >= 0 ? 'up' : 'down'} ${Math.abs(priceData.change).toFixed(2)}% today on a volume of ${priceData.volume} shares.`;
    } else {
      responseText = "I'd be happy to provide price information. Could you specify which stock or cryptocurrency you're interested in?";
    }
  }
  // If we have market data, provide some insights
  else if (marketData && marketData.length > 0) {
    try {
      // Sample the first few market data items
      const topMarkets = marketData.slice(0, 3);
      const marketSummary = topMarkets.map(m => 
        `${m.symbol || 'Unknown'}: $${m.price || m.close || 0} (${m.change_percentage || '0'}%)`
      ).join(', ');
      
      responseText = `Based on the current market data I have, here's a quick overview: ${marketSummary}. You can ask me about specific stocks for more details.`;
    } catch (error) {
      console.error('Error processing market data in simulation:', error);
      // Fallback to generic response
      responseText = "I'm analyzing the current market data. Is there a specific stock or sector you'd like insights about?";
    }
  }
  
  // Never send irrelevant responses about cryptocurrency pricing or general info
  // unless explicitly asked about them
  
  return {
    id: crypto.randomUUID(),
    sender: 'assistant' as 'assistant',
    role: 'assistant' as 'assistant',
    content: responseText,
    text: responseText,
    timestamp: new Date()
  };
};

// Helper function to extract stock symbol from user message
const extractSymbol = (message: string): string | null => {
  // Common stock tickers pattern (1-5 uppercase letters)
  const tickerRegex = /\b[A-Z]{1,5}\b/g;
  const matches = message.match(tickerRegex);
  
  if (matches && matches.length > 0) {
    // Filter out common words that might be in all caps
    const commonWords = ['I', 'A', 'THE', 'TO', 'FOR', 'AND', 'OR'];
    const filteredMatches = matches.filter(match => !commonWords.includes(match));
    return filteredMatches.length > 0 ? filteredMatches[0] : null;
  }
  
  return null;
};

// Helper function to extract sector from user message
const extractSector = (message: string): string | null => {
  const sectors = ['technology', 'energy', 'financial', 'healthcare', 'consumer', 'industrial'];
  
  for (const sector of sectors) {
    if (message.toLowerCase().includes(sector)) {
      return sector;
    }
  }
  
  return null;
};

// Generate simulated price data for a symbol
const getSimulatedPriceData = (symbol: string) => {
  // Use the symbol string to generate a consistent but pseudo-random price
  const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const basePrice = (hash % 1000) + 10; // Price between $10 and $1010
  const change = (hash % 20) - 10; // Change between -10% and +10%
  const volume = ((hash % 10) + 1) * 100000; // Volume between 100,000 and 1,000,000
  
  return {
    price: basePrice.toFixed(2),
    change: change / 100,
    volume: volume.toLocaleString()
  };
};
