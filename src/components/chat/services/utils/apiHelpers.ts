
import { supabase } from '@/lib/supabase';

/**
 * Fetches an API key from the admin database (if the user has admin access),
 * or returns null if the user doesn't have access or the key doesn't exist.
 * 
 * @param provider The AI provider (openai, deepseek, claude, gemini)
 * @returns The API key or null if not available
 */
export async function fetchAdminApiKey(provider: 'openai' | 'deepseek' | 'claude' | 'gemini'): Promise<string | null> {
  try {
    // Check if the user has admin access
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.log('User not authenticated or error fetching user data');
      return null;
    }
    
    // Query admin_api_keys table for the specified provider
    const { data, error } = await supabase
      .from('admin_api_keys')
      .select('key_value')
      .eq('provider', provider)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching admin ${provider} API key:`, error);
      return null;
    }
    
    if (!data || !data.key_value) {
      console.log(`No admin ${provider} API key found in database`);
      return null;
    }
    
    return data.key_value;
  } catch (error) {
    console.error(`Error in fetchAdminApiKey for ${provider}:`, error);
    return null;
  }
}

/**
 * Gets API key from various sources in priority order:
 * 1. Explicitly provided API key (passed in function call)
 * 2. User's localStorage key
 * 3. Admin API key (if user has access)
 * 
 * @param provider The AI provider
 * @param explicitApiKey API key passed directly to function
 * @returns The API key or null if not available
 */
export async function getApiKey(
  provider: 'openai' | 'deepseek' | 'claude' | 'gemini',
  explicitApiKey?: string
): Promise<string | null> {
  // If an explicit API key was provided, use that first
  if (explicitApiKey) {
    return explicitApiKey;
  }
  
  // Try to get the key from localStorage based on provider
  let localStorageKey: string | null = null;
  
  switch (provider) {
    case 'openai':
      localStorageKey = localStorage.getItem('openaiApiKey');
      break;
    case 'deepseek':
      localStorageKey = localStorage.getItem('deepseekApiKey');
      break;
    case 'claude':
      localStorageKey = localStorage.getItem('claudeApiKey');
      break;
    case 'gemini':
      localStorageKey = localStorage.getItem('geminiApiKey');
      break;
  }
  
  if (localStorageKey) {
    return localStorageKey;
  }
  
  // As a last resort, try to get the admin API key
  return await fetchAdminApiKey(provider);
}
