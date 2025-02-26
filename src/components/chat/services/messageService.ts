
import { ChatMessage } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';
import { generateGrok3Response } from './grok3Service';
import { generateOpenAIResponse } from './openaiService';
import { generateClaudeResponse } from './claudeService';
import { generateGeminiResponse } from './geminiService';
import { generateDeepSeekResponse } from './deepseekService';
import { generateFallbackResponse } from './fallbackService';
import { ModelId, GrokSettings } from '../types/GrokSettings';

export const generateAIResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  apiAvailable: boolean | null,
  settings?: GrokSettings
) => {
  let response;
  let error = null;
  const selectedModel = settings?.selectedModel || 'grok3';
  
  console.log(`Selected model: ${selectedModel}`);
  console.log(`API available: ${apiAvailable}`);
  
  // First try with the selected model
  try {
    console.log(`Attempting to generate response with ${selectedModel}`);
    response = await generateResponseWithModel(selectedModel, inputMessage, conversationHistory, settings);
    console.log(`${selectedModel} response:`, response ? "Success" : "Failed");
  } catch (primaryError) {
    console.error(`${selectedModel} service error:`, primaryError);
    error = primaryError;
  }
  
  // If the selected model fails, try other models in sequence
  if (!response) {
    console.log("Primary model failed, trying fallbacks");
    // Define fallback models with explicit ModelId values to satisfy TypeScript
    const fallbackModels: ModelId[] = (['openai', 'claude', 'gemini', 'deepseek', 'grok3'] as const)
      .filter(model => model !== selectedModel) as ModelId[];
    
    for (const model of fallbackModels) {
      if (response) break; // Stop if we got a response
      
      try {
        console.log(`Trying fallback model: ${model}`);
        response = await generateResponseWithModel(model, inputMessage, conversationHistory, settings);
        console.log(`Fallback ${model} response:`, response ? "Success" : "Failed");
      } catch (fallbackError) {
        console.error(`Fallback model ${model} error:`, fallbackError);
        // Continue to the next model
      }
    }
  }
  
  // If all models fail, use the simple fallback service
  if (!response) {
    try {
      console.log('All AI models failed, using simple fallback service');
      response = await generateFallbackResponse(inputMessage, conversationHistory);
    } catch (fallbackError) {
      console.error('Fallback service error:', fallbackError);
      if (!error) error = fallbackError;
    }
  }
  
  if (!response) {
    throw new Error(error?.message || 'Geen antwoord van AI services');
  }
  
  return response;
};

const generateResponseWithModel = async (
  model: ModelId,
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  settings?: GrokSettings
): Promise<string> => {
  switch (model) {
    case 'grok3':
      return await generateGrok3Response(inputMessage, conversationHistory, settings);
    case 'openai':
      return await generateOpenAIResponse(inputMessage, conversationHistory, {
        temperature: settings?.temperature,
        maxTokens: settings?.maxTokens
      });
    case 'claude':
      return await generateClaudeResponse(inputMessage, conversationHistory);
    case 'gemini':
      return await generateGeminiResponse(inputMessage, conversationHistory);
    case 'deepseek':
      return await generateDeepSeekResponse(inputMessage, conversationHistory);
    default:
      throw new Error(`Onbekend model: ${model}`);
  }
};

export const createChatMessage = (
  role: 'user' | 'assistant',
  content: string
): ChatMessage => ({
  id: uuidv4(),
  role,
  content,
  timestamp: new Date()
});
