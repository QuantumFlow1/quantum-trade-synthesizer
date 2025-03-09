
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

// Create a broadcast channel for cross-tab communication
const apiKeyChannel = typeof window !== 'undefined' ? new BroadcastChannel('api-key-status') : null;

/**
 * Checks if any API keys are available, either in localStorage or Supabase
 */
export const checkApiKeysAvailability = async (serviceName = 'any', checkSecret = true) => {
  try {
    console.log(`Checking API availability for ${serviceName}`);
    
    // First check localStorage for user-provided keys
    const localGroqKey = localStorage.getItem('groqApiKey');
    const localOpenAIKey = localStorage.getItem('openaiApiKey');
    const localClaudeKey = localStorage.getItem('claudeApiKey');
    
    // If we have a local key for the requested service, return immediately
    if (serviceName !== 'any') {
      if (
        (serviceName === 'groq' && localGroqKey) || 
        (serviceName === 'openai' && localOpenAIKey) || 
        (serviceName === 'claude' && localClaudeKey)
      ) {
        console.log(`Found local API key for ${serviceName}`);
        
        // Broadcast the status to other tabs
        if (apiKeyChannel) {
          apiKeyChannel.postMessage({
            type: 'api-key-found',
            service: serviceName,
            source: 'localStorage',
            timestamp: Date.now()
          });
        }
        
        return { 
          available: true, 
          service: serviceName,
          source: 'localStorage',
          allKeys: {
            openai: !!localOpenAIKey,
            claude: !!localClaudeKey,
            groq: !!localGroqKey,
            gemini: false,
            grok3: false,
            deepseek: false
          }
        };
      }
    } else if (localGroqKey || localOpenAIKey || localClaudeKey) {
      // If checking 'any' service and we have any local key
      console.log('Found local API key');
      
      // Broadcast the status to other tabs
      if (apiKeyChannel) {
        apiKeyChannel.postMessage({
          type: 'api-key-found',
          service: 'any',
          source: 'localStorage',
          timestamp: Date.now()
        });
      }
      
      return { 
        available: true, 
        service: 'any',
        source: 'localStorage',
        allKeys: {
          openai: !!localOpenAIKey,
          claude: !!localClaudeKey,
          groq: !!localGroqKey,
          gemini: false,
          grok3: false,
          deepseek: false
        }
      };
    }
    
    // If no local key found, check Supabase Edge Function
    try {
      const { data, error } = await supabase.functions.invoke('check-api-keys', {
        body: { 
          service: serviceName,
          checkSecret 
        }
      });
      
      if (error) {
        console.error('Error checking API keys:', error);
        throw new Error(`Failed to check API keys: ${error.message}`);
      }
      
      // Extract and normalize the response
      const isAvailable = serviceName === 'any' 
        ? data?.available || false
        : data?.secretSet || false;
      
      console.log(`API key check result for ${serviceName}:`, { 
        available: isAvailable,
        allKeys: data?.allKeys || {}
      });
      
      // Broadcast the status to other tabs
      if (apiKeyChannel && isAvailable) {
        apiKeyChannel.postMessage({
          type: 'api-key-found',
          service: serviceName,
          source: 'supabase',
          timestamp: Date.now(),
          allKeys: data?.allKeys || {}
        });
      }
      
      return {
        available: isAvailable,
        service: serviceName,
        source: 'supabase',
        allKeys: data?.allKeys || {},
        data
      };
    } catch (error) {
      console.error('Error in check-api-keys function:', error);
      
      // In case of error, fall back to checking localStorage again
      if (serviceName === 'any' && (localGroqKey || localOpenAIKey || localClaudeKey)) {
        return { 
          available: true, 
          service: 'any',
          source: 'localStorage-fallback',
          allKeys: {
            openai: !!localOpenAIKey,
            claude: !!localClaudeKey,
            groq: !!localGroqKey,
            gemini: false,
            grok3: false,
            deepseek: false
          }
        };
      }
      
      // If specific service was requested, check localStorage as fallback
      if (
        (serviceName === 'groq' && localGroqKey) || 
        (serviceName === 'openai' && localOpenAIKey) || 
        (serviceName === 'claude' && localClaudeKey)
      ) {
        return { 
          available: true, 
          service: serviceName,
          source: 'localStorage-fallback',
          allKeys: {
            openai: !!localOpenAIKey,
            claude: !!localClaudeKey,
            groq: !!localGroqKey,
            gemini: false,
            grok3: false,
            deepseek: false
          }
        };
      }
      
      // If all else fails, show error and return not available
      toast({
        title: "API Check Failed",
        description: `Could not verify API key availability: ${error.message}`,
        variant: "destructive"
      });
      
      return { available: false, error: error.message };
    }
  } catch (error) {
    console.error('Error checking API availability:', error);
    
    toast({
      title: "API Check Failed",
      description: `Could not verify API key availability: ${error.message}`,
      variant: "destructive"
    });
    
    return { available: false, error: error.message };
  }
};

/**
 * Sets up a listener for API key changes from other tabs
 */
export const setupApiKeyListener = (callback) => {
  if (!apiKeyChannel) return () => {};
  
  const handleMessage = (event) => {
    console.log('Received API key broadcast:', event.data);
    if (event.data.type === 'api-key-found' || 
        event.data.type === 'api-key-updated' ||
        event.data.type === 'api-key-removed') {
      callback(event.data);
    }
  };
  
  apiKeyChannel.addEventListener('message', handleMessage);
  
  // Return cleanup function
  return () => {
    apiKeyChannel.removeEventListener('message', handleMessage);
  };
};

/**
 * Broadcasts API key changes to other tabs
 */
export const broadcastApiKeyChange = (type, service, source = 'localStorage') => {
  if (!apiKeyChannel) return;
  
  apiKeyChannel.postMessage({
    type,
    service,
    source,
    timestamp: Date.now()
  });
  
  // Also dispatch a regular event for components on the same page
  window.dispatchEvent(new CustomEvent('api-key-changed', {
    detail: { type, service, source }
  }));
};

// Expose the channel for direct use
export const getApiKeyChannel = () => apiKeyChannel;
