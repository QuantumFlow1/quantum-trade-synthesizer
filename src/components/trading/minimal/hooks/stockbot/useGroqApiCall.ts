
import { ChatMessage, StockbotToolCall } from "./types";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface GroqApiCallResponse {
  message: ChatMessage;
  toolCalls?: StockbotToolCall[];
}

export const useGroqApiCall = () => {
  const verifyGroqKey = async (apiKey: string): Promise<boolean> => {
    if (!apiKey || apiKey.length < 20) return false;
    
    try {
      // Try to make a simple models list request to verify the key
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error verifying Groq API key:', error);
      return false;
    }
  };

  const callGroqApi = async (userMessage: string, messages: ChatMessage[]): Promise<GroqApiCallResponse> => {
    try {
      console.log('Calling Groq API for response to:', userMessage.substring(0, 50) + (userMessage.length > 50 ? '...' : ''));
      
      // Get Groq API key from localStorage if available
      const groqApiKey = localStorage.getItem('groqApiKey');
      
      if (!groqApiKey) {
        throw new Error('Groq API key is not configured');
      }
      
      // Verify the API key before proceeding
      const isKeyValid = await verifyGroqKey(groqApiKey);
      if (!isKeyValid) {
        throw new Error('Invalid Groq API key. Please check your API key configuration.');
      }
      
      // Log key information for debugging (safely)
      console.log(`Using Groq API key: ${groqApiKey.substring(0, 4)}...${groqApiKey.substring(groqApiKey.length - 4)} (length: ${groqApiKey.length})`);
      
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
      
      // Call the Supabase Edge Function with proper error handling
      try {
        const { data, error } = await supabase.functions.invoke('groq-chat', {
          body: {
            messages: [systemMessage, ...messageHistory],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
            function_calling: "auto"
          },
          headers: { 'x-groq-api-key': groqApiKey }
        });
        
        if (error) {
          console.error('Error calling groq-chat function:', error);
          throw new Error(error.message || 'Failed to get AI response');
        }
        
        if (!data || data.status === 'error') {
          console.error('Invalid response from AI service:', data);
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
        
        const message: ChatMessage = {
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
      } catch (supabaseError) {
        // Handle Supabase specific errors
        console.error('Supabase function error:', supabaseError);
        
        // Try a direct API call to Groq as fallback
        try {
          console.log('Attempting direct API call to Groq as fallback');
          
          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${groqApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [systemMessage, ...messageHistory],
              temperature: 0.7,
              max_tokens: 1024
            })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API error: ${response.status}`);
          }
          
          const groqData = await response.json();
          
          const message: ChatMessage = {
            id: crypto.randomUUID(),
            sender: 'assistant',
            role: 'assistant',
            content: groqData.choices[0]?.message?.content || 'No response from Groq API',
            text: groqData.choices[0]?.message?.content || 'No response from Groq API',
            timestamp: new Date()
          };
          
          return { message };
        } catch (directApiError) {
          console.error('Direct API call error:', directApiError);
          throw new Error('Failed to call Groq API directly: ' + 
            (directApiError instanceof Error ? directApiError.message : 'Unknown error'));
        }
      }
    } catch (error) {
      console.error('Error in callGroqApi:', error);
      
      // Show toast notification for API errors
      toast({
        title: "API Error",
        description: error instanceof Error ? error.message : "Failed to get response from Groq API",
        variant: "destructive"
      });
      
      throw error;
    }
  };

  return { callGroqApi, verifyGroqKey };
};
