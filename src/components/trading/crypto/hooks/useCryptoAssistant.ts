
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CryptoMessage, CryptoModel } from '../types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

// Available AI models
const AVAILABLE_MODELS: CryptoModel[] = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3 70B', providerName: 'Groq' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7b', providerName: 'Groq' },
  { id: 'gemini-pro', name: 'Gemini Pro', providerName: 'Google' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', providerName: 'Anthropic' },
];

export function useCryptoAssistant() {
  const [messages, setMessages] = useState<CryptoMessage[]>([
    {
      id: uuidv4(),
      role: 'assistant',
      content: 'Hello! I can help you analyze cryptocurrency markets, provide price information, and suggest trading strategies. What would you like to know about crypto today?',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState(AVAILABLE_MODELS[0].id);
  
  // Load API key from localStorage
  const getApiKey = useCallback(() => {
    const apiKey = localStorage.getItem('groqApiKey');
    return apiKey || '';
  }, []);
  
  // Detect if API key is available
  const [hasApiKey, setHasApiKey] = useState(false);
  
  useEffect(() => {
    const checkApiKey = () => {
      const key = getApiKey();
      setHasApiKey(!!key && key.length > 5);
    };
    
    checkApiKey();
    
    // Listen for API key changes
    window.addEventListener('storage', checkApiKey);
    window.addEventListener('apikey-updated', checkApiKey);
    
    return () => {
      window.removeEventListener('storage', checkApiKey);
      window.removeEventListener('apikey-updated', checkApiKey);
    };
  }, [getApiKey]);
  
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
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Prepare API call
      const apiKey = getApiKey();
      const headers: Record<string, string> = {};
      
      if (apiKey) {
        headers['x-groq-api-key'] = apiKey;
      }
      
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
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Process any tool calls from the AI response
      if (data.tool_calls && data.tool_calls.length > 0) {
        await processToolCalls(data.tool_calls);
      }
      
    } catch (error) {
      console.error('Error in crypto assistant:', error);
      
      // Add error message to conversation
      const errorMessage: CryptoMessage = {
        id: uuidv4(),
        role: 'error',
        content: `Sorry, I encountered an error: ${error.message || 'Unknown error'}. Please try again or check your API key settings.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to get AI response',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, messages, currentModel, getApiKey]);
  
  // Process tool calls from the AI
  const processToolCalls = async (toolCalls: any[]) => {
    if (!toolCalls || toolCalls.length === 0) return;
    
    for (const call of toolCalls) {
      try {
        if (call.function.name === 'getCryptoPrice') {
          const { symbol } = JSON.parse(call.function.arguments);
          
          // Call the crypto-price-data function
          const { data, error } = await supabase.functions.invoke('crypto-price-data', {
            body: { symbol }
          });
          
          if (error) {
            console.error('Error fetching crypto price data:', error);
            continue;
          }
          
          if (data.success && data.data) {
            // Format price data message
            const priceInfo = data.data;
            const priceMessage = `
### ${priceInfo.name} (${priceInfo.symbol}) Current Data
**Price:** $${priceInfo.price.toLocaleString()}
**24h Change:** ${priceInfo.price_change_percentage_24h > 0 ? '▲' : '▼'} ${Math.abs(priceInfo.price_change_percentage_24h).toFixed(2)}% ($${Math.abs(priceInfo.price_change_24h).toFixed(2)})
**Market Cap:** $${priceInfo.market_cap.toLocaleString()}
**24h Volume:** $${priceInfo.total_volume.toLocaleString()}
**Last Updated:** ${new Date(priceInfo.last_updated).toLocaleString()}

![${priceInfo.name} Logo](${priceInfo.image})
`;
            
            const dataMessage: CryptoMessage = {
              id: uuidv4(),
              role: 'system',
              content: priceMessage,
              timestamp: new Date()
            };
            
            setMessages(prev => [...prev, dataMessage]);
          }
        }
        // Additional tool handling can be added here
      } catch (error) {
        console.error(`Error processing tool call ${call.function.name}:`, error);
      }
    }
  };
  
  // Reset the chat history
  const resetChat = useCallback(() => {
    setMessages([
      {
        id: uuidv4(),
        role: 'assistant',
        content: 'Hello! I can help you analyze cryptocurrency markets, provide price information, and suggest trading strategies. What would you like to know about crypto today?',
        timestamp: new Date()
      }
    ]);
    
    toast({
      title: 'Chat Reset',
      description: 'Chat history has been cleared.',
      duration: 2000,
    });
  }, []);
  
  // Switch between different models
  const switchModel = useCallback((modelId: string) => {
    const model = AVAILABLE_MODELS.find(m => m.id === modelId);
    if (model) {
      setCurrentModel(model.id);
      toast({
        title: 'Model Changed',
        description: `Now using ${model.name} (${model.providerName})`,
        duration: 2000,
      });
    }
  }, []);
  
  return {
    messages,
    isLoading,
    inputMessage,
    setInputMessage,
    sendMessage,
    resetChat,
    currentModel,
    switchModel,
    availableModels: AVAILABLE_MODELS,
    hasApiKey
  };
}
