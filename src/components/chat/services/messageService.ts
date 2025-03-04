
import { AIModelType } from '../types/GrokSettings';
import { generateDeepSeekResponse } from './deepseekService';
import { generateOpenAIResponse } from './openaiService';
import { processMessageText } from './utils/messageUtils';
import { supabase } from '@/lib/supabase';

// Create a new chat message
export const createChatMessage = (role: 'user' | 'assistant', content: string) => {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date()
  };
};

// Generate AI response based on the selected model
export const generateResponse = async (
  conversationHistory: Array<{ role: string; content: string }>,
  selectedModel: AIModelType,
  apiKey?: string,
  temperature?: number,
  maxTokens?: number
): Promise<string> => {
  try {
    console.log('Generating response with model:', selectedModel);
    console.log('Conversation history length:', conversationHistory.length);
    
    // Get the latest user message
    const userMessage = conversationHistory[conversationHistory.length - 1].content;
    
    // Process the message text for better formatting
    const processedMessage = processMessageText(userMessage);
    
    // Choose the appropriate service based on the model
    if (selectedModel.startsWith('gpt') || selectedModel === 'openai') {
      console.log('Using OpenAI service');
      
      // Build complete settings object with all required properties
      const settings = {
        selectedModel,
        temperature: temperature || 0.7,
        maxTokens: maxTokens || 1024,
        deepSearchEnabled: false, // Required property for GrokSettings
        thinkEnabled: false,      // Required property for GrokSettings
        apiKeys: {
          openaiApiKey: apiKey || undefined,
          claudeApiKey: undefined,
          geminiApiKey: undefined,
          deepseekApiKey: undefined
        }
      };
      
      return await generateOpenAIResponse(processedMessage, conversationHistory, settings);
    } 
    else if (selectedModel.startsWith('deepseek')) {
      console.log('Using DeepSeek service');
      
      // Build complete settings object with all required properties
      const settings = {
        selectedModel,
        temperature: temperature || 0.7,
        maxTokens: maxTokens || 1024,
        deepSearchEnabled: false, // Required property for GrokSettings
        thinkEnabled: false,      // Required property for GrokSettings
        apiKeys: {
          openaiApiKey: undefined,
          claudeApiKey: undefined,
          geminiApiKey: undefined,
          deepseekApiKey: apiKey || undefined
        }
      };
      
      return await generateDeepSeekResponse(processedMessage, conversationHistory, settings);
    } 
    else if (selectedModel.startsWith('claude')) {
      console.log('Using Claude service (not implemented)');
      throw new Error('Claude API service not implemented yet');
    } 
    else if (selectedModel.startsWith('gemini')) {
      console.log('Using Gemini service (not implemented)');
      throw new Error('Gemini API service not implemented yet');
    } 
    else if (selectedModel.startsWith('grok')) {
      console.log('Using Grok service via Edge Function');
      // Format messages for Groq API
      const response = await callGrokEdgeFunction(conversationHistory);
      return response;
    } 
    else {
      throw new Error(`Unsupported model: ${selectedModel}`);
    }
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};

// Helper function to call the Grok Edge Function
const callGrokEdgeFunction = async (
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string> => {
  try {
    console.log('Calling Grok3 edge function with conversation history:', 
      conversationHistory.length > 0 ? `${conversationHistory.length} messages` : 'empty history');
    
    const { data, error } = await supabase.functions.invoke('grok3-response', {
      body: { 
        context: conversationHistory.slice(0, -1),
        message: conversationHistory[conversationHistory.length - 1].content
      }
    });
    
    if (error) {
      console.error('Error calling Grok3 API:', error);
      throw new Error(error.message || 'Failed to get response from Grok service');
    }
    
    if (!data || !data.response) {
      console.error('Invalid response from Grok API:', data);
      if (data?.error) {
        throw new Error(data.error);
      }
      throw new Error('Invalid response from Grok API');
    }
    
    console.log('Received response from Grok3 edge function:', 
      data.response ? `${data.response.substring(0, 50)}...` : 'empty response');
    
    return data.response;
  } catch (error) {
    console.error('Exception in callGrokEdgeFunction:', error);
    throw error;
  }
};
