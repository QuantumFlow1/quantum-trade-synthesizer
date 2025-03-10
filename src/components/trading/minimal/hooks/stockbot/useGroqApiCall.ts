
import { ChatMessage, StockbotToolCall } from "./types";
import { supabase } from "@/lib/supabase";

export const useGroqApiCall = () => {
  const callGroqApi = async (userMessage: string, messages: ChatMessage[]): Promise<{message: ChatMessage, toolCalls?: StockbotToolCall[]}> => {
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
      
      // Handle function calls in the response
      // Check if the response contains a function call pattern
      const functionMatch = responseContent.match(/<function=(\w+)(\{.*\})>/);
      if (functionMatch) {
        console.log("Function call detected in Groq response:", functionMatch[0]);
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
    } catch (error) {
      console.error('Error in callGroqApi:', error);
      throw error;
    }
  };

  return { callGroqApi };
};
