
import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CryptoMessage } from '../../types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { useApiKeyManagement } from './useApiKeyManagement';
import { useMessagesState } from './useMessagesState';
import { useModelManagement } from './useModelManagement';
import { useToolCallsProcessor } from './useToolCallsProcessor';

export function useCryptoAssistant() {
  const { getApiKey, hasApiKey } = useApiKeyManagement();
  const { messages, inputMessage, setInputMessage, addMessage, resetChat } = useMessagesState();
  const { currentModel, switchModel, availableModels } = useModelManagement();
  const { processToolCalls } = useToolCallsProcessor();
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Send a message to the assistant
  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;
    
    // Add user message to the conversation
    const userMessage: CryptoMessage = {
      id: uuidv4(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    addMessage(userMessage);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Prepare API call
      const apiKey = getApiKey();
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('crypto-groq-assistant', {
        body: {
          messages: messages.concat(userMessage).map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          model: currentModel,
          temperature: 0.7,
          max_tokens: 1024,
          function_calling: "auto"
        },
        headers: apiKey ? { 'x-groq-api-key': apiKey } : undefined
      });
      
      if (error) {
        console.error('Error from crypto assistant edge function:', error);
        throw new Error(error.message || 'Failed to get response from AI');
      }
      
      if (!data || data.status === 'error') {
        throw new Error(data?.error || 'Invalid response from AI service');
      }
      
      // Add assistant response to the conversation
      const assistantMessage: CryptoMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        model: data.model,
        toolCalls: data.tool_calls
      };
      
      addMessage(assistantMessage);
      
      // Process any tool calls from the AI response
      // Using the updated processToolCalls which accepts addMessage directly
      if (data.tool_calls && data.tool_calls.length > 0) {
        await processToolCalls(data.tool_calls, addMessage);
      }
      
    } catch (error) {
      console.error('Error in crypto assistant:', error);
      
      // Add error message to conversation
      const errorMessage: CryptoMessage = {
        id: uuidv4(),
        role: 'system',
        content: `Sorry, I encountered an error: ${error.message || 'Unknown error'}. Please try again or check your API key settings.`,
        timestamp: new Date()
      };
      
      addMessage(errorMessage);
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to get AI response',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, messages, currentModel, getApiKey, addMessage, processToolCalls]);
  
  return {
    messages,
    isLoading,
    inputMessage,
    setInputMessage,
    sendMessage,
    resetChat,
    currentModel,
    switchModel,
    availableModels,
    hasApiKey
  };
}
