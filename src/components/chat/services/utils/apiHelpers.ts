import { supabase } from '@/lib/supabase';

/**
 * Fetches an API key from the admin database (if the user has admin access),
 * or returns null if the user doesn't have access or the key doesn't exist.
 * 
 * @param provider The AI provider (openai, deepseek, claude, gemini, groq)
 * @returns The API key or null if not available
 */
export async function fetchAdminApiKey(provider: 'openai' | 'deepseek' | 'claude' | 'gemini' | 'groq'): Promise<string | null> {
  try {
    // Check if in offline mode
    if (navigator.onLine === false) {
      console.log('Running in offline mode, cannot fetch admin API key');
      return null;
    }
    
    // Call the Supabase edge function to get the admin API key
    const { data, error } = await supabase.functions.invoke('get-admin-key', {
      body: { provider }
    });
    
    if (error) {
      console.error(`Error fetching admin key for ${provider}:`, error);
      return null;
    }
    
    if (data && data.key) {
      console.log(`Admin API key for ${provider} retrieved successfully`);
      return data.key;
    }
    
    console.log(`No admin API key found for ${provider}`);
    return null;
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
  provider: 'openai' | 'deepseek' | 'claude' | 'gemini' | 'groq',
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
    case 'groq':
      localStorageKey = localStorage.getItem('groqApiKey');
      break;
  }
  
  if (localStorageKey) {
    return localStorageKey;
  }
  
  // Check if we're offline before trying to access admin API
  if (navigator.onLine === false) {
    console.log('Running in offline mode, cannot fetch admin API key');
    return null;
  }
  
  // If no local key, try to get the admin API key
  return await fetchAdminApiKey(provider);
}

/**
 * Detects whether the application is currently running in offline mode
 * 
 * @returns Boolean indicating whether the app is offline
 */
export function isOfflineMode(): boolean {
  return navigator.onLine === false;
}

/**
 * Generates fallback text for when the application is in offline mode
 * 
 * @param prompt The user's prompt or question
 * @returns A helpful offline response
 */
export function generateOfflineResponse(prompt: string): string {
  // Simple responses for offline mode
  const responses = [
    "U bent momenteel offline. Uw vraag is opgeslagen en zal worden verwerkt zodra de verbinding is hersteld.",
    "Het systeem werkt nu in offline modus. Uw bericht is bewaard.",
    "Internet connectie is momenteel niet beschikbaar. We hebben uw vraag opgeslagen voor later.",
    "Offline modus geactiveerd. Uw vraag wordt verwerkt zodra er weer verbinding is."
  ];
  
  // Simple keyword-based response for specific questions
  if (prompt.toLowerCase().includes("koers") || prompt.toLowerCase().includes("prijs")) {
    return "U bent offline. Koersinformatie is alleen beschikbaar met een actieve internetverbinding. Uw vraag is opgeslagen.";
  }
  
  if (prompt.toLowerCase().includes("advies") || prompt.toLowerCase().includes("strategie")) {
    return "U bent offline. Handelssadvies vereist toegang tot actuele marktgegevens. Uw verzoek is opgeslagen voor wanneer u weer online bent.";
  }
  
  // Return a random general response if no keywords match
  return responses[Math.floor(Math.random() * responses.length)];
}
