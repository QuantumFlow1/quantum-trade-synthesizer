
import { supabase } from "@/lib/supabase";
import { ApiKeyAvailability } from "./api-key-types";

// Key checking channel for cross-tab communication
let keyCheckChannel: BroadcastChannel | null = null;

if (typeof window !== 'undefined') {
  try {
    keyCheckChannel = new BroadcastChannel('api-key-updates');
  } catch (e) {
    console.error("BroadcastChannel not supported:", e);
  }
}

/**
 * Check availability of API keys - returns detailed information
 */
export const checkApiKeysAvailability = async (
  serviceName?: string,
  checkSecret: boolean = false
): Promise<ApiKeyAvailability> => {
  try {
    console.log(`Checking API availability for ${serviceName || 'all services'}`);
    
    const { data, error } = await supabase.functions.invoke('check-api-keys', {
      body: {
        service: serviceName || 'any',
        checkSecret
      }
    });
    
    if (error) {
      console.error("API key check error:", error);
      return { available: false, message: error.message };
    }
    
    const result = data as {
      status: string;
      secretSet?: boolean;
      service?: string;
      allKeys: Record<string, boolean>;
      available?: boolean;
      message?: string;
    };
    
    // Log result
    console.log(`API key check result for ${serviceName || 'all services'}:`, result);
    
    // If checking a specific service with its secret, use the secretSet flag
    if (serviceName && checkSecret && result.secretSet !== undefined) {
      return {
        available: !!result.secretSet,
        allKeys: result.allKeys,
        provider: serviceName
      };
    }
    
    // Otherwise return the general availability
    const isAvailable = result.available !== undefined 
      ? result.available 
      : Object.values(result.allKeys).some(value => value);
    
    return {
      available: isAvailable,
      allKeys: result.allKeys,
      provider: serviceName
    };
  } catch (error) {
    console.error("Error checking API keys:", error);
    return { available: false, message: "Error checking API keys" };
  }
};

/**
 * Simple API check that returns just a boolean value
 */
export const getSimpleApiAvailability = async (
  serviceName?: string,
  checkSecret: boolean = false
): Promise<boolean> => {
  const result = await checkApiKeysAvailability(serviceName, checkSecret);
  return result.available;
};

/**
 * For backward compatibility
 */
export const checkAPIKeyStatus = async () => {
  const result = await getSimpleApiAvailability();
  return { available: result, status: result ? 'available' : 'unavailable' };
};

/**
 * Broadcast API key status changes to other tabs
 */
export const broadcastApiKeyUpdate = (keyType: string, isAvailable: boolean) => {
  if (keyCheckChannel) {
    try {
      keyCheckChannel.postMessage({
        type: 'api-key-update',
        keyType,
        isAvailable
      });
    } catch (e) {
      console.error("Error broadcasting API key update:", e);
    }
  }
};

/**
 * Listen for API key status changes from other tabs
 * @alias setupApiKeyListener
 */
export const subscribeToApiKeyUpdates = (callback: (keyType: string, isAvailable: boolean) => void) => {
  if (keyCheckChannel) {
    const handler = (event: MessageEvent) => {
      const { type, keyType, isAvailable } = event.data;
      if (type === 'api-key-update') {
        callback(keyType, isAvailable);
      }
    };
    
    keyCheckChannel.addEventListener('message', handler);
    return () => keyCheckChannel?.removeEventListener('message', handler);
  }
  
  return () => {}; // Empty cleanup function if no channel
};

// Alias for backward compatibility
export const setupApiKeyListener = subscribeToApiKeyUpdates;
export { broadcastApiKeyUpdate as broadcastApiKeyChange };
