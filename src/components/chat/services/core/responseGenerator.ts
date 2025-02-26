
import { toast } from '@/components/ui/use-toast';
import { ChatMessage } from '../../types/chat';
import { createChatMessage } from '../utils/messageUtils';
import { generateGrok3Response } from '../grok3Service';
import { generateOpenAIResponse } from '../openaiService';
import { generateClaudeResponse } from '../claudeService';
import { generateGeminiResponse } from '../geminiService';
import { generateDeepSeekResponse } from '../deepseekService';
import { generateFallbackResponse } from '../fallbackService';
import { GrokSettings, ModelId } from '../../types/GrokSettings';
import { supabase } from '@/lib/supabase';
import { isAdminContext, hasRequiredApiKey, checkServiceAvailability } from '../utils/apiHelpers';

export const generateAIResponse = async (
  inputMessage: string,
  conversationHistory: Array<{ role: string; content: string }>,
  isGrok3Available: boolean,
  settings: GrokSettings
): Promise<string> => {
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

  const attemptedServices: string[] = [];

  try {
    if (!hasRequiredApiKey(settings.selectedModel, settings)) {
      console.warn(`Missing API key for ${settings.selectedModel}, showing warning`);
      toast({
        title: "API sleutel ontbreekt",
        description: "Stel een API sleutel in voor dit model in de instellingen.",
        variant: "destructive",
        duration: 5000
      });

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

    if (settings.selectedModel === 'deepseek' || settings.selectedModel === 'deepseek-chat') {
      const isDeepSeekAvailable = await checkServiceAvailability('deepseek');
      
      if (!isDeepSeekAvailable) {
        console.warn('DeepSeek service is unavailable, switching to fallback model');
        toast({
          title: "DeepSeek Service Unavailable",
          description: "Switching to OpenAI model as fallback.",
          variant: "warning",
          duration: 5000
        });
        
        if (settings.apiKeys.openaiApiKey || localStorage.getItem('openaiApiKey')) {
          settings.selectedModel = 'openai';
        } 
        else if (isGrok3Available) {
          settings.selectedModel = 'grok3';
        } 
        else {
          return generateFallbackResponse(inputMessage, conversationHistory);
        }
      }
    }

    return await generateAIResponseByModel(
      settings.selectedModel,
      inputMessage,
      conversationHistory,
      settings,
      isGrok3Available,
      attemptedServices
    );
  } catch (error) {
    console.error('Error generating AI response:', error);
    console.log('Services attempted:', attemptedServices.join(', '));
    console.log('Using fallback response generation...');
    
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
