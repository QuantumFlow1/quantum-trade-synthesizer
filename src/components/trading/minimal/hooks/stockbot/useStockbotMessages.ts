
import { useState, useCallback } from "react";
import { 
  ChatMessage, 
  StockbotMessage,
  StockbotMessageRole,
  CheckApiKeyFunction,
  StockbotToolCall
} from "./types";
import { generateStockbotResponse } from "./responseSimulator";
import { toast } from "@/hooks/use-toast";
import { loadMessages, saveMessages } from "./storage";
import { supabase } from "@/lib/supabase";

export const useStockbotMessages = (
  marketData: any[] = [],
  hasGroqKey: boolean,
  isSimulationMode: boolean,
  checkApiKey: CheckApiKeyFunction
) => {
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages() as ChatMessage[]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const callGroqApi = async (userMessage: string): Promise<{message: ChatMessage, toolCalls?: StockbotToolCall[]}> => {
    try {
      console.log('Calling Groq API for response');
      
      // Get Groq API key from localStorage if available
      const groqApiKey = localStorage.getItem('groqApiKey');
      
      // Prepare the conversation history
      const messageHistory = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));
      
      // Add the user's new message
      messageHistory.push({
        role: 'user',
        content: userMessage
      });
      
      // Add market data context to the system message
      const systemMessage = {
        role: 'system',
        content: `You are Stockbot, a helpful trading assistant that provides insights about stocks and financial markets. 
        You can analyze market data and use tools to visualize information.
        You should use tools whenever they would enhance your response, especially when discussing specific stocks or market sectors.
        Today's date is ${new Date().toLocaleDateString()}.
        When responding about market data, always mention that it's for the current date.
        Current market data: ${JSON.stringify(marketData)}`
      };
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('groq-chat', {
        body: {
          messages: [systemMessage, ...messageHistory],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 1024,
          function_calling: "auto"
        },
        headers: groqApiKey ? { 'x-groq-api-key': groqApiKey } : undefined
      });
      
      if (error) {
        console.error('Error calling groq-chat function:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }
      
      if (!data || data.status === 'error') {
        throw new Error(data?.error || 'Invalid response from AI service');
      }
      
      // Process the function call if it exists
      let responseContent = data.response;
      
      // Handle function calls in the response
      // Check if the response contains a function call pattern
      const functionMatch = responseContent.match(/<function=(\w+)(\{.*\})>/);
      if (functionMatch) {
        console.log("Function call detected in Groq response:", functionMatch[0]);
      }
      
      const message: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'assistant' as 'assistant', // Explicitly cast to ensure correct type
        role: 'assistant' as StockbotMessageRole,
        content: responseContent,
        text: responseContent,
        timestamp: new Date()
      };
      
      // Return both the message and any tool calls
      return {
        message,
        toolCalls: data.tool_calls
      };
    } catch (error) {
      console.error('Error in callGroqApi:', error);
      throw error;
    }
  };

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
        
        // Add a message for the tool response
        const toolMessage: ChatMessage = {
          id: crypto.randomUUID(),
          sender: 'system' as 'system', // Explicitly cast to ensure correct type
          role: 'assistant' as StockbotMessageRole,
          content: responseContent,
          text: responseContent,
          timestamp: new Date(),
        };
        
        toolMessages.push(toolMessage);
      } catch (error) {
        console.error(`Error processing tool call:`, error);
        // Add error message for failed tool call
        const errorMessage: ChatMessage = {
          id: crypto.randomUUID(),
          sender: 'system' as 'system', // Explicitly cast to ensure correct type
          role: 'assistant' as StockbotMessageRole,
          content: `Failed to process tool call: ${error instanceof Error ? error.message : String(error)}`,
          text: `Failed to process tool call: ${error instanceof Error ? error.message : String(error)}`,
          timestamp: new Date(),
        };
        toolMessages.push(errorMessage);
      }
    }
    
    return toolMessages;
  };

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;

    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user' as 'user', // Explicitly cast to ensure correct type
      role: 'user' as StockbotMessageRole,
      content: inputMessage,
      text: inputMessage,
      timestamp: new Date()
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setInputMessage("");

    try {
      let responseMessage: ChatMessage;
      let toolCalls: StockbotToolCall[] | undefined;
      
      // Only use simulation mode if explicitly set or if there's no API key
      if (isSimulationMode || !hasGroqKey) {
        console.log('Using simulation mode for StockBot response');
        responseMessage = generateStockbotResponse(inputMessage, marketData);
      } else {
        // Double-check API key availability (may have changed)
        const apiKeyValid = await checkApiKey();
        
        if (!apiKeyValid) {
          console.warn('API key check failed, falling back to simulation');
          responseMessage = generateStockbotResponse(inputMessage, marketData);
          
          toast({
            title: "API Key Required",
            description: "Using simulated response. Configure your Groq API key for AI-powered responses.",
            variant: "warning",
          });
        } else {
          // Use the Groq API
          const result = await callGroqApi(inputMessage);
          responseMessage = result.message;
          toolCalls = result.toolCalls;
        }
      }

      let finalMessages = [...updatedMessages, responseMessage];
      
      // Process any tool calls if they exist
      if (toolCalls && toolCalls.length > 0) {
        console.log('Processing tool calls:', toolCalls);
        const toolMessages = await processToolCalls(toolCalls);
        
        if (toolMessages.length > 0) {
          finalMessages = [...finalMessages, ...toolMessages];
        }
      }
      
      setMessages(finalMessages);
      saveMessages(finalMessages);
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      // Add error message to the chat
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'system' as 'system', // Explicitly cast to ensure correct type
        role: 'assistant' as StockbotMessageRole,
        content: `I'm sorry, I encountered an error processing your request. Please try again later.`,
        text: `I'm sorry, I encountered an error processing your request. Please try again later.`,
        timestamp: new Date()
      };
      
      setMessages([...updatedMessages, errorMessage]);
      saveMessages([...updatedMessages, errorMessage]);
      
      toast({
        title: "Error",
        description: error.message || "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, messages, marketData, isSimulationMode, hasGroqKey, checkApiKey]);

  const clearChat = useCallback(() => {
    setMessages([]);
    saveMessages([]);
  }, []);

  return {
    messages: messages as StockbotMessage[],
    inputMessage,
    setInputMessage,
    isLoading,
    handleSendMessage,
    clearChat
  };
};
