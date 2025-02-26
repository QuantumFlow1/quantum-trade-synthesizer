
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '../types/chat';
import { generateGrok3Response } from './grok3Service';
import { generateOpenAIResponse } from './openaiService';
import { generateClaudeResponse } from './claudeService';
import { generateGeminiResponse } from './geminiService';
import { generateDeepSeekResponse } from './deepseekService';
import { generateFallbackResponse } from './fallbackService';
import { GrokSettings, ModelId } from '../types/GrokSettings';

// Create a properly formatted chat message
export const createChatMessage = (role: 'user' | 'assistant', content: string): ChatMessage => {
  return {
    id: uuidv4(),
    role,
    content: content || "Error: Empty message content",
    timestamp: new Date(),
  };
};

// Main function to generate AI response based on available services and selected model
export const generateAIResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  isGrok3Available: boolean,
  settings: GrokSettings
): Promise<string> => {
  console.log('Generating AI response with:', {
    model: settings.selectedModel,
    temperature: settings.temperature,
    maxTokens: settings.maxTokens,
    inputMessageLength: inputMessage.length,
    historyLength: conversationHistory.length,
    isGrok3Available,
  });

  try {
    // Attempt to generate a response based on the selected model
    let response: string | null = null;
    
    switch (settings.selectedModel) {
      case 'grok3':
        if (isGrok3Available) {
          console.log('Attempting to generate Grok3 response...');
          response = await generateGrok3Response(inputMessage, conversationHistory, settings);
        } else {
          console.log('Grok3 not available, falling back to OpenAI...');
          // Fall back to OpenAI if Grok3 is not available
          response = await generateOpenAIResponse(inputMessage, conversationHistory, settings);
        }
        break;
        
      case 'gpt-4':
      case 'gpt-3.5-turbo':
      case 'openai':
        console.log(`Generating OpenAI response with ${settings.selectedModel}...`);
        response = await generateOpenAIResponse(inputMessage, conversationHistory, settings);
        break;
        
      case 'claude-3-haiku':
      case 'claude-3-sonnet':
      case 'claude-3-opus':
      case 'claude':
        console.log(`Generating Claude response with ${settings.selectedModel}...`);
        response = await generateClaudeResponse(inputMessage, conversationHistory, settings);
        break;
        
      case 'gemini-pro':
      case 'gemini':
        console.log('Generating Gemini response...');
        response = await generateGeminiResponse(inputMessage, conversationHistory, settings);
        break;
        
      case 'deepseek-chat':
      case 'deepseek':
        console.log('Generating DeepSeek response...');
        response = await generateDeepSeekResponse(inputMessage, conversationHistory, settings);
        break;
        
      default:
        console.log(`Unknown model ${settings.selectedModel}, falling back to OpenAI...`);
        response = await generateOpenAIResponse(inputMessage, conversationHistory, settings);
    }
    
    // Check if we got a valid response
    if (response && response.trim()) {
      console.log('Successfully generated AI response:', response.substring(0, 100) + '...');
      return response;
    } else {
      console.warn('Empty response received from service. Trying fallback...');
      throw new Error('Empty response received from service');
    }
  } catch (error) {
    console.error('Error generating AI response:', error);
    console.log('Using fallback response generation...');
    
    // If all services fail, use the fallback service
    try {
      const fallbackResponse = await generateFallbackResponse(inputMessage, conversationHistory);
      console.log('Fallback response generated:', fallbackResponse);
      return fallbackResponse;
    } catch (fallbackError) {
      console.error('Even fallback response generation failed:', fallbackError);
      return "I'm sorry, but I'm unable to generate a response at this time. Please try again later.";
    }
  }
};
