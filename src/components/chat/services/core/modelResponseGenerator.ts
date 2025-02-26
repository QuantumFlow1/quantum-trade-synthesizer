
import { toast } from '@/components/ui/use-toast';
import { GrokSettings, ModelId } from '../../types/GrokSettings';
import { generateGrok3Response } from '../grok3Service';
import { generateOpenAIResponse } from '../openaiService';
import { generateClaudeResponse } from '../claudeService';
import { generateGeminiResponse } from '../geminiService';
import { generateDeepSeekResponse } from '../deepseekService';
import { generateFallbackResponse } from '../fallbackService';

export async function generateAIResponseByModel(
  modelId: ModelId,
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  settings: GrokSettings,
  isGrok3Available: boolean,
  attemptedServices: string[]
): Promise<string> {
  let response: string | null = null;
  
  switch (modelId) {
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
        
        if (settings.apiKeys.openaiApiKey || localStorage.getItem('openaiApiKey')) {
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
        
        if (settings.apiKeys.openaiApiKey || localStorage.getItem('openaiApiKey')) {
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
        
        if (settings.apiKeys.openaiApiKey || localStorage.getItem('openaiApiKey')) {
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
        
        if (deepseekError instanceof Error && 
            deepseekError.message.includes('non-2xx status code')) {
          localStorage.setItem('deepseekServiceUnavailable', 'true');
        }
        
        if (settings.apiKeys.openaiApiKey || localStorage.getItem('openaiApiKey')) {
          if (!settings.apiKeys.openaiApiKey && localStorage.getItem('openaiApiKey')) {
            settings.apiKeys.openaiApiKey = localStorage.getItem('openaiApiKey');
          }
          
          attemptedServices.push('openai');
          response = await generateOpenAIResponse(inputMessage, conversationHistory, settings);
        } else if (isGrok3Available) {
          attemptedServices.push('grok3');
          response = await generateGrok3Response(inputMessage, conversationHistory, settings);
        } else {
          throw new Error("DeepSeek service unavailable and no backup API key is set");
        }
      }
      break;
      
    default:
      console.log(`Unknown model ${settings.selectedModel}, falling back to OpenAI...`);
      if (settings.apiKeys.openaiApiKey || localStorage.getItem('openaiApiKey')) {
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
  
  if (response && response.trim()) {
    console.log('Successfully generated AI response:', response.substring(0, 100) + '...');
    return response;
  } else {
    console.warn('Empty response received from service. Trying fallback...');
    throw new Error('Empty response received from service');
  }
}
