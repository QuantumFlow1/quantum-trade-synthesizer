
import { useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { ChatMessage } from '../types/chat';
import { createChatMessage, generateResponse } from '../services/messageService';
import { GrokSettings, ModelId } from '../types/GrokSettings';

interface UseSendMessageProps {
  isAdminContext: boolean;
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  inputMessage: string;
  setInputMessage: (input: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  apiAvailable: boolean | null;
  checkGrokAvailability: () => Promise<boolean>;
  grokSettings: GrokSettings;
}

export function useSendMessage({
  isAdminContext,
  messages,
  setMessages,
  inputMessage,
  setInputMessage,
  setIsProcessing,
  apiAvailable,
  checkGrokAvailability,
  grokSettings
}: UseSendMessageProps) {
  
  const sendMessage = useCallback(async (messageContent = inputMessage) => {
    if (!messageContent.trim()) return;
    
    if (isAdminContext) {
      console.log('sendMessage blocked in admin context');
      return;
    }
    
    console.log('sendMessage called with content:', messageContent);
    setIsProcessing(true);

    try {
      // Create and add user message
      const userMessage = createChatMessage('user', messageContent);
      console.log('Adding user message:', userMessage);
      
      const updatedMessages = [...messages, userMessage];
      
      // Immediately update messages state with user message
      setMessages(updatedMessages);
      console.log('Updated messages after adding user message:', updatedMessages);
      
      setInputMessage('');

      // If Grok3 API availability is unknown or was previously unavailable, check it
      if (apiAvailable === null || apiAvailable === false) {
        const isAvailable = await checkGrokAvailability();
        if (!isAvailable) {
          setIsProcessing(false);
          const errorMessage = createChatMessage(
            'assistant',
            'Sorry, the AI service is currently unavailable. Please try again later.'
          );
          setMessages([...updatedMessages, errorMessage]);
          return;
        }
      }
      
      console.log('Generating AI response with model:', grokSettings.selectedModel);
      
      // Create conversation history in the format expected by API
      const conversationHistory = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      console.log('Conversation history for API:', conversationHistory);
      
      try {
        // Get the API key for the selected model
        const apiKey = getApiKeyForModel(grokSettings);
        
        // Use generateResponse instead of generateAIResponse
        const response = await generateResponse(
          conversationHistory, 
          grokSettings.selectedModel,
          apiKey,
          grokSettings.temperature,
          grokSettings.maxTokens
        );
        
        console.log('Received AI response:', response ? response.substring(0, 50) + '...' : 'undefined');
        
        if (!response) {
          console.error('Empty response received from AI');
          throw new Error('Empty response received from AI');
        }
        
        // Add assistant response to chat
        const assistantMessage = createChatMessage('assistant', response);
        console.log('Adding assistant message:', assistantMessage);
        
        // Update messages state with both user and assistant messages
        const finalMessages = [...updatedMessages, assistantMessage];
        console.log('Final messages state:', finalMessages);
        setMessages(finalMessages);
        
        toast({
          title: "Response received",
          description: "The AI has responded to your message.",
          duration: 3000
        });
      } catch (apiError) {
        console.error('Error getting AI response:', apiError);
        
        // Add error message to chat
        const errorMessage = createChatMessage(
          'assistant',
          `Error: ${apiError instanceof Error ? apiError.message : "Failed to generate a response"}`
        );
        
        setMessages([...updatedMessages, errorMessage]);
        
        toast({
          title: "Error generating response",
          description: apiError instanceof Error ? apiError.message : "Failed to generate a response",
          variant: "destructive",
          duration: 5000
        });
      }
      
    } catch (error) {
      console.error('Error in chat process:', error);
      
      // Add error message
      const errorMessage = createChatMessage(
        'assistant',
        `Error: ${error instanceof Error ? error.message : "An unexpected error occurred"}`
      );
      
      console.log('Adding error message to chat:', errorMessage);
      
      setMessages([...messages, errorMessage]);
      
      // Show error toast
      toast({
        title: "Error occurred",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setIsProcessing(false);
    }
  }, [inputMessage, messages, apiAvailable, checkGrokAvailability, grokSettings, isAdminContext, setInputMessage, setIsProcessing, setMessages]);

  return { sendMessage };
}

// Helper function to get the appropriate API key based on the selected model
function getApiKeyForModel(settings: GrokSettings): string {
  switch (true) {
    case settings.selectedModel.startsWith('grok'):
      // Grok doesn't need a client-side API key
      return '';
    case settings.selectedModel.startsWith('claude'):
      return settings.apiKeys.claudeApiKey || '';
    case settings.selectedModel.startsWith('gemini'):
      return settings.apiKeys.geminiApiKey || '';
    case settings.selectedModel.startsWith('deepseek'):
      return settings.apiKeys.deepseekApiKey || '';
    case settings.selectedModel.startsWith('gpt'):
      return settings.apiKeys.openaiApiKey || '';
    default:
      return '';
  }
}
