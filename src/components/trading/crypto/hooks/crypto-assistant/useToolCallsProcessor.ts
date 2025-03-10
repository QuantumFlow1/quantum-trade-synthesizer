
import { useState } from 'react';
import { CryptoMessage } from '../../types';
import { StockbotToolCall } from '../../../minimal/hooks/stockbot/types';
import { v4 as uuidv4 } from 'uuid';

export function useToolCallsProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Modified to accept a function that adds a single message
  const processToolCalls = async (
    toolCalls: StockbotToolCall[],
    addMessageFn: (message: CryptoMessage) => void
  ) => {
    if (!toolCalls || toolCalls.length === 0) return [];
    
    setIsProcessing(true);
    const toolMessages: CryptoMessage[] = [];
    
    try {
      for (const toolCall of toolCalls) {
        console.log('Processing tool call:', toolCall);
        
        if (toolCall.type !== 'function') continue;
        
        const { name, arguments: argsString } = toolCall.function;
        let args;
        
        try {
          args = JSON.parse(argsString);
        } catch (e) {
          console.error('Failed to parse tool call arguments:', e);
          continue;
        }
        
        const toolResponse = await executeToolCall(name, args);
        
        // Create message for the tool execution result
        const resultMessage: CryptoMessage = {
          id: uuidv4(),
          role: 'assistant', // Changed from 'function' to a valid role
          content: JSON.stringify(toolResponse),
          timestamp: new Date(),
          functionCalls: [{ 
            name: name,
            arguments: args 
          }]
        };
        
        toolMessages.push(resultMessage);
        addMessageFn(resultMessage); // Use the function to add each message
      }
    } catch (error) {
      console.error('Error processing tool calls:', error);
    } finally {
      setIsProcessing(false);
    }
    
    return toolMessages;
  };
  
  return { processToolCalls, isProcessing };
}

// Execute the tool call based on the function name
async function executeToolCall(name: string, args: any) {
  switch (name) {
    case 'getCurrentPrice':
      return simulateGetCurrentPrice(args.symbol);
    case 'getMarketSentiment':
      return simulateGetMarketSentiment(args.symbol);
    case 'getHistoricalData':
      return simulateGetHistoricalData(args.symbol, args.timeframe);
    default:
      return { 
        status: 'error',
        message: `Unknown function: ${name}`
      };
  }
}

// Simulated tool functions
function simulateGetCurrentPrice(symbol: string) {
  const price = Math.random() * (symbol === 'BTC' ? 50000 : 2000) + (symbol === 'BTC' ? 30000 : 1000);
  return {
    symbol,
    price: price.toFixed(2),
    timestamp: new Date().toISOString(),
    status: 'success'
  };
}

function simulateGetMarketSentiment(symbol: string) {
  const sentimentValues = ['bullish', 'bearish', 'neutral', 'extremely bullish', 'extremely bearish'];
  const sentiment = sentimentValues[Math.floor(Math.random() * sentimentValues.length)];
  return {
    symbol,
    sentiment,
    confidence: (Math.random() * 50 + 50).toFixed(1) + '%',
    timestamp: new Date().toISOString(),
    status: 'success'
  };
}

function simulateGetHistoricalData(symbol: string, timeframe: string) {
  const dataPoints = [];
  const now = new Date();
  const basePrice = symbol === 'BTC' ? 40000 : 1800;
  const volatility = symbol === 'BTC' ? 2000 : 100;
  
  // Generate 10 data points going backwards in time
  for (let i = 0; i < 10; i++) {
    const timestamp = new Date(now);
    timestamp.setHours(now.getHours() - i * (timeframe === 'hourly' ? 1 : 24));
    
    dataPoints.push({
      timestamp: timestamp.toISOString(),
      price: (basePrice + (Math.random() - 0.5) * volatility).toFixed(2),
      volume: Math.floor(Math.random() * 1000000)
    });
  }
  
  return {
    symbol,
    timeframe,
    data: dataPoints,
    status: 'success'
  };
}
