
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export const generateFallbackResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
) => {
  console.log('Using fallback AI service with message:', inputMessage);
  console.log('Conversation history:', conversationHistory);
  
  try {
    // First try to use the simple edge function if available
    console.log('Attempting to call supabase edge function...');
    const fallbackResult = await supabase.functions.invoke('generate-ai-response', {
      body: { 
        message: inputMessage,
        history: conversationHistory
      }
    });
    
    console.log('Edge function response:', fallbackResult);
    
    if (!fallbackResult.error && fallbackResult.data?.response) {
      console.log('Successfully received response from edge function:', fallbackResult.data.response);
      // Show a toast to indicate we're using fallback
      toast({
        title: "Using fallback AI service",
        description: "Primary AI services unavailable. Using backup service.",
        duration: 3000,
      });
      return fallbackResult.data.response;
    }
    
    // If that fails, generate a simple response locally
    console.log('Edge function failed or returned no data, using local fallback response generator');
    const localResponse = generateBasicResponse(inputMessage);
    console.log('Generated local fallback response:', localResponse);
    
    // Show a toast to indicate we're using local fallback
    toast({
      title: "Using local fallback response",
      description: "All AI services unavailable. Using simple responses.",
      variant: "warning",
      duration: 5000,
    });
    
    return localResponse;
    
  } catch (error) {
    console.error('Fallback AI error:', error);
    // Return a very basic response as last resort
    const errorResponse = generateBasicResponse(inputMessage);
    console.log('Error occurred, generated basic response:', errorResponse);
    
    // Show error toast
    toast({
      title: "AI Service Error",
      description: "Unable to connect to any AI services. Using simple responses.",
      variant: "destructive",
      duration: 5000,
    });
    
    return errorResponse;
  }
};

// Very simple local response generator as a last resort
function generateBasicResponse(message: string): string {
  console.log('Generating basic response for:', message);
  
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
  
  if (message.trim().length < 10) {
    return `I received your message "${message}", but I'm currently operating with limited capabilities and cannot generate a detailed response.`;
  }
  
  // Return a random generic response
  return responses[Math.floor(Math.random() * responses.length)];
}
