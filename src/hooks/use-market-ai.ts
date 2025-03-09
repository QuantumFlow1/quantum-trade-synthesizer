
import { useState, useCallback } from 'react';
import { MarketData } from '@/components/market/types';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export const useMarketAI = (initialMarketData?: MarketData) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I can help you analyze market data. Ask me about trends, price movements, or trading strategies.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [marketData, setMarketData] = useState<MarketData | undefined>(initialMarketData);

  const generateResponse = useCallback(async (userMessage: string) => {
    setIsLoading(true);
    
    try {
      // Create a prompt that includes market context
      const marketContext = marketData 
        ? `Current market: ${marketData.market}, Symbol: ${marketData.symbol}, Price: $${marketData.price}, 24h Change: ${marketData.change24h}%`
        : 'No specific market data available';
      
      // In a real implementation, this would call Groq's API or another AI service
      // For this proof of concept, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate market analysis response based on user message
      let aiResponse = '';
      
      if (userMessage.toLowerCase().includes('trend')) {
        aiResponse = marketData?.change24h && marketData.change24h > 0
          ? `The market for ${marketData?.symbol} is trending upward with a ${marketData?.change24h}% increase in the last 24 hours. This suggests positive momentum.`
          : `The market for ${marketData?.symbol} is trending downward with a ${marketData?.change24h}% decrease in the last 24 hours. This suggests negative momentum.`;
      } else if (userMessage.toLowerCase().includes('volume')) {
        aiResponse = `The trading volume for ${marketData?.symbol} is ${marketData?.volume?.toLocaleString()} which is ${marketData?.volume && marketData.volume > 1000000 ? 'relatively high' : 'moderate to low'}.`;
      } else if (userMessage.toLowerCase().includes('predict') || userMessage.toLowerCase().includes('forecast')) {
        aiResponse = `While I can't predict the future with certainty, the current market indicators for ${marketData?.symbol} suggest ${marketData?.change24h && marketData.change24h > 0 ? 'continued positive momentum if market conditions remain stable' : 'potential volatility ahead'}.`;
      } else if (userMessage.toLowerCase().includes('buy') || userMessage.toLowerCase().includes('sell')) {
        aiResponse = `I don't provide specific buy or sell recommendations, but I can tell you that ${marketData?.symbol} currently shows ${marketData?.change24h && marketData.change24h > 0 ? 'positive price action' : 'negative price action'} with a 24-hour change of ${marketData?.change24h}%. Consider your investment goals and risk tolerance before making trading decisions.`;
      } else if (userMessage.toLowerCase().includes('compare')) {
        aiResponse = `To compare ${marketData?.symbol} with other assets in the ${marketData?.market} market, look at relative performance. ${marketData?.symbol} has changed by ${marketData?.change24h}% in the last 24 hours. Various indices like the S&P 500 or relevant sector ETFs would be good comparison benchmarks.`;
      } else {
        aiResponse = `Based on the current data for ${marketData?.symbol}, we're seeing a ${marketData?.change24h && marketData.change24h > 0 ? 'positive' : 'negative'} trend with a price of $${marketData?.price}. The 24-hour high was $${marketData?.high24h} and the low was $${marketData?.low24h}.`;
      }
      
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: aiResponse
      };
      
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error analyzing the market data. Please try again later.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [marketData]);

  const sendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    await generateResponse(userMessage.content);
  }, [inputValue, generateResponse]);

  const resetChat = useCallback(() => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Hello! I can help you analyze market data. Ask me about trends, price movements, or trading strategies.'
    }]);
  }, []);

  const updateMarketData = useCallback((data: MarketData) => {
    setMarketData(data);
  }, []);

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    sendMessage,
    resetChat,
    updateMarketData
  };
};
