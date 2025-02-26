import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '../types/chat';
import { generateGrok3Response } from './grok3Service';
import { generateOpenAIResponse } from './openaiService';
import { generateClaudeResponse } from './claudeService';
import { generateGeminiResponse } from './geminiService';
import { generateDeepSeekResponse } from './deepseekService';
import { generateFallbackResponse } from './fallbackService';
import { GrokSettings, ModelId } from '../types/GrokSettings';
import { toast } from '@/components/ui/use-toast';

// Create a properly formatted chat message
export const createChatMessage = (role: 'user' | 'assistant', content: string): ChatMessage => {
  const newMessage = {
    id: uuidv4(),
    role,
    content: content || "Error: Empty message content",
    timestamp: new Date(),
  };
  console.log(`Created new ${role} message:`, newMessage);
  return newMessage;
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

  // Keep track of which services we've tried
  const attemptedServices: string[] = [];

  try {
    // Attempt to generate a response based on the selected model
    let response: string | null = null;
    
    switch (settings.selectedModel) {
      case 'grok3':
        attemptedServices.push('grok3');
        if (isGrok3Available) {
          console.log('Attempting to generate Grok3 response...');
          try {
            response = await generateGrok3Response(inputMessage, conversationHistory, settings);
          } catch (grokError) {
            console.error('Grok3 service error:', grokError);
            toast({
              title: "Grok3 service unavailable",
              description: "Switching to backup AI service",
              duration: 3000,
            });
          }
        }
        
        if (!response) {
          console.log('Grok3 not available or failed, falling back to OpenAI...');
          attemptedServices.push('openai');
          // Fall back to OpenAI if Grok3 is not available
          response = await generateOpenAIResponse(inputMessage, conversationHistory, settings);
        }
        break;
        
      case 'gpt-4':
      case 'gpt-3.5-turbo':
      case 'openai':
        attemptedServices.push('openai');
        console.log(`Generating OpenAI response with ${settings.selectedModel}...`);
        response = await generateOpenAIResponse(inputMessage, conversationHistory, settings);
        break;
        
      case 'claude-3-haiku':
      case 'claude-3-sonnet':
      case 'claude-3-opus':
      case 'claude':
        attemptedServices.push('claude');
        console.log(`Generating Claude response with ${settings.selectedModel}...`);
        try {
          response = await generateClaudeResponse(inputMessage, conversationHistory, settings);
        } catch (claudeError) {
          console.error('Claude service error:', claudeError);
          toast({
            title: "Claude service unavailable",
            description: "Switching to backup AI service",
            duration: 3000,
          });
          // If Claude fails, try OpenAI
          attemptedServices.push('openai');
          response = await generateOpenAIResponse(inputMessage, conversationHistory, settings);
        }
        break;
        
      case 'gemini-pro':
      case 'gemini':
        attemptedServices.push('gemini');
        console.log('Generating Gemini response...');
        try {
          response = await generateGeminiResponse(inputMessage, conversationHistory, settings);
        } catch (geminiError) {
          console.error('Gemini service error:', geminiError);
          toast({
            title: "Gemini service unavailable",
            description: "Switching to backup AI service",
            duration: 3000,
          });
          // If Gemini fails, try OpenAI
          attemptedServices.push('openai');
          response = await generateOpenAIResponse(inputMessage, conversationHistory, settings);
        }
        break;
        
      case 'deepseek-chat':
      case 'deepseek':
        attemptedServices.push('deepseek');
        console.log('Generating DeepSeek response...');
        try {
          response = await generateDeepSeekResponse(inputMessage, conversationHistory, settings);
        } catch (deepseekError) {
          console.error('DeepSeek service error:', deepseekError);
          toast({
            title: "DeepSeek service unavailable",
            description: "Switching to backup AI service",
            duration: 3000,
          });
          // If DeepSeek fails, try OpenAI
          attemptedServices.push('openai');
          response = await generateOpenAIResponse(inputMessage, conversationHistory, settings);
        }
        break;
        
      default:
        console.log(`Unknown model ${settings.selectedModel}, falling back to OpenAI...`);
        attemptedServices.push('openai');
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
    console.log('Services attempted:', attemptedServices.join(', '));
    console.log('Using fallback response generation...');
    
    // If all services fail, use the fallback service
    try {
      const fallbackResponse = await generateFallbackResponse(inputMessage, conversationHistory);
      if (fallbackResponse && fallbackResponse.trim()) {
        console.log('Fallback response generated:', fallbackResponse.substring(0, 100) + '...');
        return fallbackResponse;
      } else {
        console.error('Empty fallback response');
        return "I'm sorry, but I'm unable to generate a meaningful response at this time. Please try again later.";
      }
    } catch (fallbackError) {
      console.error('Even fallback response generation failed:', fallbackError);
      return "I'm sorry, but I'm currently experiencing technical difficulties. Please try again later.";
    }
  }
};
