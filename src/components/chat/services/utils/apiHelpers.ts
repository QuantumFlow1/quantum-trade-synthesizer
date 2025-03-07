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
    // Check if in offline mode
    if (navigator.onLine === false) {
      console.log('Running in offline mode, cannot fetch admin API key');
      return null;
    }
    
    // For now, we'll skip admin API key checking - this should be implemented
    // once the proper database table and columns are set up
    console.log(`Admin API keys for ${provider} are not yet configured in the database`);
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
  
  // Check if we're offline before trying to access admin API
  if (navigator.onLine === false) {
    console.log('Running in offline mode, cannot fetch admin API key');
    return null;
  }
  
  // Skip admin API key access for now
  return null;
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
