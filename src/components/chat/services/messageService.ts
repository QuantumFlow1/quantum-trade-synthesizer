
import { AIModelType } from '../types/GrokSettings';
import { generateDeepSeekResponse } from './deepseekService';
import { generateOpenAIResponse } from './openaiService';

// Import other service functions as needed

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
    
    // Build settings object if needed
    const settings = {
      selectedModel,
      temperature: temperature || 0.7,
      maxTokens: maxTokens || 1024,
      apiKeys: {
        openaiApiKey: selectedModel.startsWith('gpt') || selectedModel === 'openai' ? apiKey : undefined,
        claudeApiKey: selectedModel.startsWith('claude') ? apiKey : undefined,
        geminiApiKey: selectedModel.startsWith('gemini') ? apiKey : undefined,
        deepseekApiKey: selectedModel.startsWith('deepseek') ? apiKey : undefined
      }
    };
    
    // Choose the appropriate service based on the model
    if (selectedModel.startsWith('gpt') || selectedModel === 'openai') {
      console.log('Using OpenAI service');
      return await generateOpenAIResponse(userMessage, conversationHistory, settings);
    } 
    else if (selectedModel.startsWith('deepseek')) {
      console.log('Using DeepSeek service');
      return await generateDeepSeekResponse(userMessage, conversationHistory, settings);
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
  // Placeholder implementation - replace with actual API call
  return "I'm an AI assistant. How can I help you today?";
};
