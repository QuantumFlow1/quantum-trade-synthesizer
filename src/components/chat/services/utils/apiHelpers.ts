
import { supabase } from "@/lib/supabase";
import { ApiKeySettings, ModelId } from "../../types/GrokSettings";

/**
 * Check if the current execution context is an admin context
 */
export const isAdminContext = (): boolean => {
  // Check if we're in an admin context (e.g. a dashboard or admin page)
  // This is determined by checking the URL
  return window.location.pathname.includes('/admin') || 
         window.location.pathname.includes('/dashboard');
};

/**
 * Check if a service is available
 */
export const checkServiceAvailability = async (service: string): Promise<boolean> => {
  try {
    // Use a lightweight ping to check if the service is available
    const { data, error } = await supabase.functions.invoke(`${service}-ping`, {
      body: { test: true }
    });
    
    if (error) {
      console.error(`${service} service availability check failed:`, error);
      return false;
    }
    
    return data?.available === true;
  } catch (error) {
    console.error(`Error checking ${service} availability:`, error);
    return false;
  }
};

/**
 * Get API key with fallback to admin keys
 */
export const getApiKey = async (
  provider: 'openai' | 'claude' | 'gemini' | 'deepseek',
  userProvidedKey?: string
): Promise<string | null> => {
  // First try to use the user-provided key
  if (userProvidedKey) {
    return userProvidedKey;
  }
  
  // Then try localStorage
  const localStorageKey = localStorage.getItem(`${provider}ApiKey`);
  if (localStorageKey) {
    console.log(`Using ${provider} API key from localStorage`);
    return localStorageKey;
  }
  
  // Finally try to fetch an admin key
  return await fetchAdminApiKey(provider);
};

/**
 * Fetch an admin API key from Supabase
 */
export const fetchAdminApiKey = async (
  provider: 'openai' | 'claude' | 'gemini' | 'deepseek'
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-admin-key', {
      body: { provider }
    });
    
    if (error) {
      console.error(`Error fetching admin ${provider} API key:`, error);
      return null;
    }
    
    if (data?.key) {
      console.log(`Using admin ${provider} API key`);
      return data.key;
    }
    
    return null;
  } catch (error) {
    console.error(`Error in fetchAdminApiKey for ${provider}:`, error);
    return null;
  }
};

/**
 * Check if the required API key is available
 */
export const hasRequiredApiKey = (model: ModelId, settings: { apiKeys: ApiKeySettings }): boolean => {
  switch (model) {
    case 'openai':
    case 'gpt-4':
    case 'gpt-3.5-turbo':
      return !!settings.apiKeys.openaiApiKey || !!localStorage.getItem('openaiApiKey');
    case 'claude':
    case 'claude-3-haiku':
    case 'claude-3-sonnet':
    case 'claude-3-opus':
      return !!settings.apiKeys.claudeApiKey || !!localStorage.getItem('claudeApiKey');
    case 'gemini':
    case 'gemini-pro':
      return !!settings.apiKeys.geminiApiKey || !!localStorage.getItem('geminiApiKey');
    case 'deepseek':
    case 'deepseek-chat':
      return !!settings.apiKeys.deepseekApiKey || !!localStorage.getItem('deepseekApiKey');
    default:
      return true; // No key required for default model (grok3)
  }
};
