
import { toast } from '@/components/ui/use-toast';
import { GrokSettings, ModelId } from '../../types/GrokSettings';
import { supabase } from '@/lib/supabase';

// Check if we're in admin context
export const isAdminContext = () => {
  return typeof window !== 'undefined' && 
    (window.location.pathname.includes('/admin') || 
     window.sessionStorage.getItem('disable-chat-services') === 'true');
};

// Check if the required API key is available for a given model
export const hasRequiredApiKey = (modelId: ModelId, settings: GrokSettings): boolean => {
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

// Helper function to check if a service might be temporarily unavailable
export const checkServiceAvailability = async (serviceName: string): Promise<boolean> => {
  if (serviceName === 'deepseek') {
    try {
      const { error } = await supabase.functions.invoke('deepseek-response', {
        body: { 
          message: "system: ping test",
          context: [],
          model: "deepseek-chat",
          maxTokens: 10,
          temperature: 0.7,
          apiKey: "test-key" // Just for checking if the function exists
        }
      });
      
      // We expect an API key error, but not a function unavailable error
      return !error || error.message.includes('API key');
    } catch {
      return false;
    }
  }
  
  // Default to assuming the service is available for other services
  return true;
};
