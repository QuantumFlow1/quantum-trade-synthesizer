
import { supabase } from '@/lib/supabase';

export const generateFallbackResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
) => {
  console.log('Using fallback AI service...');
  
  try {
    // First try to use the simple edge function if available
    const fallbackResult = await supabase.functions.invoke('generate-ai-response', {
      body: { 
        message: inputMessage,
        history: conversationHistory
      }
    });
    
    if (!fallbackResult.error && fallbackResult.data?.response) {
      return fallbackResult.data.response;
    }
    
    // If that fails, generate a simple response locally
    console.log('Using local fallback response generator');
    return generateBasicResponse(inputMessage);
    
  } catch (error) {
    console.error('Fallback AI error:', error);
    // Return a very basic response as last resort
    return generateBasicResponse(inputMessage);
  }
};

// Very simple local response generator as a last resort
function generateBasicResponse(message: string): string {
  const responses = [
    "I'm sorry, but I'm having trouble connecting to the AI services right now. Please try again later.",
    "It seems all our AI models are currently unavailable. Your message has been received, but I cannot generate a proper response at this time.",
    "I've received your message, but I'm unable to provide a detailed response right now due to connectivity issues.",
    "Thank you for your message. Our AI services are experiencing difficulties at the moment. Please try again in a few minutes."
  ];
  
  // Simple question detection
  if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
    return "Hello! I'm operating in fallback mode right now with limited capabilities. How can I assist you?";
  }
  
  if (message.toLowerCase().includes("help")) {
    return "I'd like to help, but I'm currently in fallback mode with limited functionality. Please try again later when our AI services are fully operational.";
  }
  
  // Return a random generic response
  return responses[Math.floor(Math.random() * responses.length)];
}
