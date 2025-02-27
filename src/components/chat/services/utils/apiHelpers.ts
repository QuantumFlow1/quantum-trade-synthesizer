
import { toast } from '@/components/ui/use-toast';
import { GrokSettings, ModelId } from '../../types/GrokSettings';
import { supabase } from '@/lib/supabase';

// Check if we're in admin context
export const isAdminContext = () => {
  return typeof window !== 'undefined' && 
    (window.location.pathname.includes('/admin') || 
     window.sessionStorage.getItem('disable-chat-services') === 'true');
};

// Fetch an admin-managed API key of a given type
export const fetchAdminApiKey = async (keyType: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('admin_api_keys')
      .select('api_key')
      .eq('key_type', keyType)
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.log('No admin API key found or error fetching:', error.message);
      return null;
    }
    
    return data?.api_key || null;
  } catch (error) {
    console.error('Error fetching admin API key:', error);
    return null;
  }
};

// Check if the required API key is available for a given model
export const hasRequiredApiKey = async (modelId: ModelId, settings: GrokSettings): Promise<boolean> => {
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
  
  // Check for admin-managed API keys
  let adminOpenaiKey = null;
  let adminClaudeKey = null;
  let adminGeminiKey = null;
  let adminDeepseekKey = null;
  
  try {
    // Only fetch admin keys for the needed model to reduce database calls
    switch (modelId) {
      case 'openai':
      case 'gpt-4':
      case 'gpt-3.5-turbo':
        adminOpenaiKey = await fetchAdminApiKey('openai');
        break;
      case 'claude':
      case 'claude-3-haiku':
      case 'claude-3-sonnet':
      case 'claude-3-opus':
        adminClaudeKey = await fetchAdminApiKey('claude');
        break;
      case 'gemini':
      case 'gemini-pro':
        adminGeminiKey = await fetchAdminApiKey('gemini');
        break;
      case 'deepseek':
      case 'deepseek-chat':
        adminDeepseekKey = await fetchAdminApiKey('deepseek');
        break;
    }
    
    console.log('Admin API keys available:', {
      openai: adminOpenaiKey ? 'present' : 'not found',
      claude: adminClaudeKey ? 'present' : 'not found',
      gemini: adminGeminiKey ? 'present' : 'not found',
      deepseek: adminDeepseekKey ? 'present' : 'not found'
    });
  } catch (error) {
    console.error('Error checking admin API keys:', error);
  }
  
  // Use either the settings object, localStorage, or admin key as a fallback
  switch (modelId) {
    case 'openai':
    case 'gpt-4':
    case 'gpt-3.5-turbo':
      return !!(apiKeys.openaiApiKey || openaiKeyInStorage || adminOpenaiKey);
    case 'claude':
    case 'claude-3-haiku':
    case 'claude-3-sonnet':
    case 'claude-3-opus':
      return !!(apiKeys.claudeApiKey || claudeKeyInStorage || adminClaudeKey);
    case 'gemini':
    case 'gemini-pro':
      return !!(apiKeys.geminiApiKey || geminiKeyInStorage || adminGeminiKey);
    case 'deepseek':
    case 'deepseek-chat':
      return !!(apiKeys.deepseekApiKey || deepseekKeyInStorage || adminDeepseekKey);
    case 'grok3':
      return true; // Grok3 doesn't require an API key in this implementation
    default:
      return false;
  }
};

// Get the best available API key for a given model type
export const getApiKey = async (keyType: string, userKey?: string): Promise<string | null> => {
  // Priority:
  // 1. User provided key in the function call (from settings)
  // 2. User's localStorage key
  // 3. Admin-managed key
  
  // Check user-provided key first
  if (userKey) {
    return userKey;
  }
  
  // Then check localStorage
  const localStorageKey = localStorage.getItem(`${keyType}ApiKey`);
  if (localStorageKey) {
    return localStorageKey;
  }
  
  // Finally, check for admin-managed key
  return await fetchAdminApiKey(keyType);
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
