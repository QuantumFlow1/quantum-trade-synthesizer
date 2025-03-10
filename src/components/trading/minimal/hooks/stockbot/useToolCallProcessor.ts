
import { ChatMessage, StockbotToolCall } from "./types";

export const useToolCallProcessor = () => {
  // Process tool calls and generate tool response messages
  const processToolCalls = async (toolCalls: StockbotToolCall[]): Promise<ChatMessage[]> => {
    if (!toolCalls || toolCalls.length === 0) return [];
    
    const toolMessages: ChatMessage[] = [];
    
    for (const toolCall of toolCalls) {
      try {
        const { function: func } = toolCall;
        const { name, arguments: args } = func;
        let parsedArgs = {};
        try {
          parsedArgs = JSON.parse(args);
        } catch (e) {
          console.error(`Failed to parse arguments for ${name}:`, e);
        }
        
        console.log(`Processing tool call: ${name}`, parsedArgs);
        
        // Create a message for the tool call
        let responseContent = "";
        
        if (name === "showStockChart") {
          const { symbol, timeframe = "1M" } = parsedArgs as any;
          responseContent = `<function=showStockChart{"symbol":"${symbol}","timeframe":"${timeframe}"}>`;
        } 
        else if (name === "showMarketHeatmap") {
          const { sector = "all" } = parsedArgs as any;
          responseContent = `<function=showMarketHeatmap{"sector":"${sector}"}>`;
        }
        else if (name === "getStockNews") {
          const { symbol, count = 3 } = parsedArgs as any;
          responseContent = `<function=getStockNews{"symbol":"${symbol}","count":${count}}>`;
        }
        else if (name === "analyzeSentiment") {
          const { symbol, timeframe = "1D" } = parsedArgs as any;
          responseContent = `<function=analyzeSentiment{"symbol":"${symbol}","timeframe":"${timeframe}"}>`;
        }
        else {
          console.warn(`Unknown tool call function: ${name}`);
          responseContent = `Sorry, I don't know how to handle the function: ${name}`;
        }
        
        // Only add a message if we have content to show
        if (responseContent) {
          // Add a message for the tool response
          const toolMessage: ChatMessage = {
            id: crypto.randomUUID(),
            sender: 'system' as 'system',
            role: 'assistant' as 'assistant',
            content: responseContent,
            text: responseContent,
            timestamp: new Date(),
          };
          
          toolMessages.push(toolMessage);
        }
      } catch (error) {
        console.error(`Error processing tool call:`, error);
        // Add error message for failed tool call
        const errorMessage: ChatMessage = {
          id: crypto.randomUUID(),
          sender: 'system' as 'system',
          role: 'assistant' as 'assistant',
          content: `Failed to process tool call: ${error instanceof Error ? error.message : String(error)}`,
          text: `Failed to process tool call: ${error instanceof Error ? error.message : String(error)}`,
          timestamp: new Date(),
        };
        toolMessages.push(errorMessage);
      }
    }
    
    return toolMessages;
  };

  return { processToolCalls };
};
