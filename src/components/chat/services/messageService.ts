
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

// Check if we're in admin context
const isAdminContext = () => {
  return typeof window !== 'undefined' && 
    (window.location.pathname.includes('/admin') || 
     window.sessionStorage.getItem('disable-chat-services') === 'true');
};

// Create a properly formatted chat message
export const createChatMessage = (role: 'user' | 'assistant', content: string): ChatMessage => {
  // Skip intensive operations in admin context
  if (isAdminContext()) {
    return {
      id: 'admin-context-disabled',
      role,
      content: content || "Chat disabled in admin context",
      timestamp: new Date(),
    };
  }

  const newMessage = {
    id: uuidv4(),
    role,
    content: content || "Error: Empty message content",
    timestamp: new Date(),
  };
  console.log(`Created new ${role} message:`, newMessage);
  return newMessage;
};

// Check if the required API key is available for a given model
const hasRequiredApiKey = (modelId: ModelId, settings: GrokSettings): boolean => {
  // Early return if in admin context
  if (isAdminContext()) {
    return false;
  }

  const { apiKeys } = settings;
  
  // Log the available API keys (masked for security)
  console.log('Checking for required API key:', {
    model: modelId,
    openaiKeyAvailable: apiKeys.openaiApiKey ? 'Yes' : 'No',
    claudeKeyAvailable: apiKeys.claudeApiKey ? 'Yes' : 'No',
    geminiKeyAvailable: apiKeys.geminiApiKey ? 'Yes' : 'No',
    deepseekKeyAvailable: apiKeys.deepseekApiKey ? 'Yes' : 'No'
  });
  
  // Also check localStorage directly as a backup
  const openaiKeyInStorage = localStorage.getItem('openaiApiKey');
  const claudeKeyInStorage = localStorage.getItem('claudeApiKey');
  const geminiKeyInStorage = localStorage.getItem('geminiApiKey');
  const deepseekKeyInStorage = localStorage.getItem('deepseekApiKey');
  
  console.log('API keys in localStorage:', {
    openai: openaiKeyInStorage ? 'present' : 'not found',
    claude: claudeKeyInStorage ? 'present' : 'not found',
    gemini: geminiKeyInStorage ? 'present' : 'not found',
    deepseek: deepseekKeyInStorage ? 'present' : 'not found'
  });
  
  // Use either the settings object or localStorage as a fallback
  switch (modelId) {
    case 'openai':
    case 'gpt-4':
    case 'gpt-3.5-turbo':
      return !!(apiKeys.openaiApiKey || openaiKeyInStorage);
    case 'claude':
    case 'claude-3-haiku':
    case 'claude-3-sonnet':
    case 'claude-3-opus':
      return !!(apiKeys.claudeApiKey || claudeKeyInStorage);
    case 'gemini':
    case 'gemini-pro':
      return !!(apiKeys.geminiApiKey || geminiKeyInStorage);
    case 'deepseek':
    case 'deepseek-chat':
      return !!(apiKeys.deepseekApiKey || deepseekKeyInStorage);
    case 'grok3':
      return true; // Grok3 doesn't require an API key in this implementation
    default:
      return false;
  }
};

// Main function to generate AI response based on available services and selected model
export const generateAIResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  isGrok3Available: boolean,
  settings: GrokSettings
): Promise<string> => {
  // Early return if in admin context
  if (isAdminContext()) {
    console.log('Skipping AI response generation in admin context');
    return "Chat functionality is disabled in admin context";
  }

  console.log('Generating AI response with:', {
    model: settings.selectedModel,
    temperature: settings.temperature,
    maxTokens: settings.maxTokens,
    inputMessageLength: inputMessage.length,
    historyLength: conversationHistory.length,
    isGrok3Available,
    hasApiKey: hasRequiredApiKey(settings.selectedModel, settings)
  });

  // Keep track of which services we've tried
  const attemptedServices: string[] = [];

  try {
    // Check if the selected model requires an API key and if it's available
    if (!hasRequiredApiKey(settings.selectedModel, settings)) {
      console.warn(`Missing API key for ${settings.selectedModel}, showing warning`);
      toast({
        title: "API sleutel ontbreekt",
        description: "Stel een API sleutel in voor dit model in de instellingen.",
        variant: "destructive",
        duration: 5000
      });
      
      // Switch to Grok3 if it's available, otherwise tell the user to set an API key
      if (isGrok3Available) {
        settings.selectedModel = 'grok3';
        toast({
          title: "Overgeschakeld naar Grok3",
          description: "Grok3 wordt gebruikt omdat het geen API sleutel vereist.",
          duration: 3000
        });
      } else {
        return "Om dit model te gebruiken, moet u een API-sleutel instellen in de instellingen. Klik op het instellingenpictogram en voer uw API-sleutel in.";
      }
    }
    
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
          
          // Check if we have an OpenAI API key before falling back
          if (settings.apiKeys.openaiApiKey || localStorage.getItem('openaiApiKey')) {
            // Update apiKeys from localStorage if necessary
            if (!settings.apiKeys.openaiApiKey && localStorage.getItem('openaiApiKey')) {
              settings.apiKeys.openaiApiKey = localStorage.getItem('openaiApiKey');
            }
            
            attemptedServices.push('openai');
            response = await generateOpenAIResponse(inputMessage, conversationHistory, settings);
          } else {
            return "Grok3 is momenteel niet beschikbaar en er is geen OpenAI API-sleutel ingesteld als backup. Stel een API-sleutel in of probeer het later opnieuw.";
          }
        }
        break;
        
      case 'gpt-4':
      case 'gpt-3.5-turbo':
      case 'openai':
        attemptedServices.push('openai');
        console.log(`Generating OpenAI response with ${settings.selectedModel}...`);
        
        // Update apiKeys from localStorage if necessary
        if (!settings.apiKeys.openaiApiKey && localStorage.getItem('openaiApiKey')) {
          settings.apiKeys.openaiApiKey = localStorage.getItem('openaiApiKey');
        }
        
        response = await generateOpenAIResponse(inputMessage, conversationHistory, settings);
        break;
        
      case 'claude-3-haiku':
      case 'claude-3-sonnet':
      case 'claude-3-opus':
      case 'claude':
        attemptedServices.push('claude');
        console.log(`Generating Claude response with ${settings.selectedModel}...`);
        
        // Update apiKeys from localStorage if necessary
        if (!settings.apiKeys.claudeApiKey && localStorage.getItem('claudeApiKey')) {
          settings.apiKeys.claudeApiKey = localStorage.getItem('claudeApiKey');
        }
        
        try {
          response = await generateClaudeResponse(inputMessage, conversationHistory, settings);
        } catch (claudeError) {
          console.error('Claude service error:', claudeError);
          toast({
            title: "Claude service unavailable",
            description: "Switching to backup AI service",
            duration: 3000,
          });
          // If Claude fails and we have an OpenAI key, try OpenAI
          if (settings.apiKeys.openaiApiKey || localStorage.getItem('openaiApiKey')) {
            // Update apiKeys from localStorage if necessary
            if (!settings.apiKeys.openaiApiKey && localStorage.getItem('openaiApiKey')) {
              settings.apiKeys.openaiApiKey = localStorage.getItem('openaiApiKey');
            }
            
            attemptedServices.push('openai');
            response = await generateOpenAIResponse(inputMessage, conversationHistory, settings);
          } else {
            throw new Error("Claude service unavailable and no backup API key is set");
          }
        }
        break;
        
      case 'gemini-pro':
      case 'gemini':
        attemptedServices.push('gemini');
        console.log('Generating Gemini response...');
        
        // Update apiKeys from localStorage if necessary
        if (!settings.apiKeys.geminiApiKey && localStorage.getItem('geminiApiKey')) {
          settings.apiKeys.geminiApiKey = localStorage.getItem('geminiApiKey');
        }
        
        try {
          response = await generateGeminiResponse(inputMessage, conversationHistory, settings);
        } catch (geminiError) {
          console.error('Gemini service error:', geminiError);
          toast({
            title: "Gemini service unavailable",
            description: "Switching to backup AI service",
            duration: 3000,
          });
          // If Gemini fails and we have an OpenAI key, try OpenAI
          if (settings.apiKeys.openaiApiKey || localStorage.getItem('openaiApiKey')) {
            // Update apiKeys from localStorage if necessary
            if (!settings.apiKeys.openaiApiKey && localStorage.getItem('openaiApiKey')) {
              settings.apiKeys.openaiApiKey = localStorage.getItem('openaiApiKey');
            }
            
            attemptedServices.push('openai');
            response = await generateOpenAIResponse(inputMessage, conversationHistory, settings);
          } else {
            throw new Error("Gemini service unavailable and no backup API key is set");
          }
        }
        break;
        
      case 'deepseek-chat':
      case 'deepseek':
        attemptedServices.push('deepseek');
        console.log('Generating DeepSeek response...');
        
        // Update apiKeys from localStorage if necessary
        if (!settings.apiKeys.deepseekApiKey && localStorage.getItem('deepseekApiKey')) {
          settings.apiKeys.deepseekApiKey = localStorage.getItem('deepseekApiKey');
        }
        
        try {
          response = await generateDeepSeekResponse(inputMessage, conversationHistory, settings);
        } catch (deepseekError) {
          console.error('DeepSeek service error:', deepseekError);
          toast({
            title: "DeepSeek service unavailable",
            description: "Switching to backup AI service",
            duration: 3000,
          });
          // If DeepSeek fails and we have an OpenAI key, try OpenAI
          if (settings.apiKeys.openaiApiKey || localStorage.getItem('openaiApiKey')) {
            // Update apiKeys from localStorage if necessary
            if (!settings.apiKeys.openaiApiKey && localStorage.getItem('openaiApiKey')) {
              settings.apiKeys.openaiApiKey = localStorage.getItem('openaiApiKey');
            }
            
            attemptedServices.push('openai');
            response = await generateOpenAIResponse(inputMessage, conversationHistory, settings);
          } else {
            throw new Error("DeepSeek service unavailable and no backup API key is set");
          }
        }
        break;
        
      default:
        console.log(`Unknown model ${settings.selectedModel}, falling back to OpenAI...`);
        if (settings.apiKeys.openaiApiKey || localStorage.getItem('openaiApiKey')) {
          // Update apiKeys from localStorage if necessary
          if (!settings.apiKeys.openaiApiKey && localStorage.getItem('openaiApiKey')) {
            settings.apiKeys.openaiApiKey = localStorage.getItem('openaiApiKey');
          }
          
          attemptedServices.push('openai');
          response = await generateOpenAIResponse(inputMessage, conversationHistory, settings);
        } else if (isGrok3Available) {
          attemptedServices.push('grok3');
          response = await generateGrok3Response(inputMessage, conversationHistory, settings);
        } else {
          return "Onbekend model geselecteerd en er is geen API-sleutel ingesteld voor OpenAI als backup.";
        }
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
        return "Het spijt me, maar ik kan momenteel geen zinvol antwoord genereren. Controleer uw API-sleutels of probeer het later opnieuw.";
      }
    } catch (fallbackError) {
      console.error('Even fallback response generation failed:', fallbackError);
      return "Het spijt me, maar er zijn technische problemen. Controleer of uw API-sleutels correct zijn en probeer het later opnieuw.";
    }
  }
};
