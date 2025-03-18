
import { StockbotMessage, StockbotToolCall } from "./types";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export const useGroqApiCall = () => {
  const callGroqApi = async (userMessage: string, messages: StockbotMessage[]): Promise<{message: StockbotMessage, toolCalls?: StockbotToolCall[]}> => {
    try {
      console.log('Calling Groq API for response to:', userMessage.substring(0, 50) + (userMessage.length > 50 ? '...' : ''));
      
      // Get Groq API key from localStorage if available
      const groqApiKey = localStorage.getItem('groqApiKey');
      
      if (!groqApiKey) {
        throw new Error('Groq API key is not configured');
      }
      
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
        
        IMPORTANT: For crypto or stock queries, use a function to display real-time charts. ALWAYS include a function call for charts when discussing assets:
        
        - For cryptocurrencies use: <function=showStockChart{"symbol":"BINANCE:BTCUSD","timeframe":"1D"}></function> 
        - For stocks use: <function=showStockChart{"symbol":"AAPL","timeframe":"1D"}></function>
        
        When discussing market trends, use the market heatmap: <function=showMarketHeatmap{"sector":"all"}></function>
        
        For news about assets, use: <function=getStockNews{"symbol":"AAPL","count":3}></function>
        
        Today's date is ${new Date().toLocaleDateString()}.
        When responding about market data, always mention that it's for the current date.`
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
      
      // Check for keywords in the response to automatically add charts
      if ((/bitcoin|btc|crypto/i.test(userMessage) || /bitcoin|btc|crypto/i.test(responseContent)) 
           && !responseContent.includes('<function=')) {
        // Add a Bitcoin chart if discussing Bitcoin without a chart
        if (/bitcoin|btc/i.test(userMessage) || /bitcoin|btc/i.test(responseContent)) {
          console.log("Auto-injecting Bitcoin chart into response");
          responseContent += `\n\n<function=showStockChart{"symbol":"BINANCE:BTCUSD","timeframe":"1D"}></function>`;
        }
      }
      
      const message: StockbotMessage = {
        id: crypto.randomUUID(),
        sender: 'assistant' as 'assistant', // Explicitly cast to ensure correct type
        role: 'assistant' as 'assistant',
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
      
      // Show toast notification for API errors
      toast({
        title: "API Error",
        description: error.message || "Failed to get response from Groq API",
        variant: "destructive"
      });
      
      throw error;
    }
  };

  return { callGroqApi };
};
