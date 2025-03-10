
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useStockbotSettings } from './useStockbotSettings';
import { hasApiKey, getApiKey, broadcastApiKeyChange } from '@/utils/apiKeyManager';
import { checkApiKeysAvailability } from '@/hooks/trading-chart/api-key-manager';
import { fetchAdminApiKey } from '@/components/chat/services/utils/apiHelpers';

/**
 * Hook to monitor API key status and provide key verification functionality
 */
export const useApiKeyMonitor = (
  isSimulationMode: boolean,
  setIsSimulationMode: (mode: boolean) => void
) => {
  // State for API key status
  const [hasGroqKey, setHasGroqKey] = useState<boolean>(false);
  const [isCheckingAdminKey, setIsCheckingAdminKey] = useState<boolean>(false);
  const [isAdminKeyAvailable, setIsAdminKeyAvailable] = useState<boolean>(false);
  
  // Keep track of manual mode setting
  const manuallySetMode = useRef<boolean>(false);
  
  // Function to explicitly set manual mode
  const setManuallySetMode = useCallback((isManual: boolean) => {
    manuallySetMode.current = isManual;
  }, []);
  
  // Function to check for a valid Groq API key
  const checkGroqApiKey = useCallback(async (): Promise<boolean> => {
    try {
      // First check for a local key in localStorage
      const keyExists = hasApiKey('groq');
      const groqKeyValue = getApiKey('groq');
      
      console.log('Checking local Groq API key:', { 
        exists: keyExists, 
        keyLength: groqKeyValue ? groqKeyValue.length : 0 
      });
      
      if (keyExists && groqKeyValue && groqKeyValue.length > 0) {
        // Test the API key with a simple request
        // This is a placeholder - in a real implementation, you would make an actual API call
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setHasGroqKey(true);
        console.log('Valid local Groq API key found');
        return true;
      }
      
      // If no personal key, check for admin-managed key directly from the API
      setIsCheckingAdminKey(true);
      
      // First try the apiKeysAvailability function
      const { available } = await checkApiKeysAvailability('groq');
      setIsAdminKeyAvailable(available);
      
      // If not available through the first method, try the direct edge function call
      if (!available) {
        const adminKey = await fetchAdminApiKey('groq');
        console.log('Direct admin Groq API key check:', !!adminKey);
        
        if (adminKey) {
          setIsAdminKeyAvailable(true);
          setHasGroqKey(true);
          setIsCheckingAdminKey(false);
          console.log('Admin-managed Groq API key is available via direct check');
          return true;
        }
      } else {
        setHasGroqKey(true);
        setIsCheckingAdminKey(false);
        console.log('Admin-managed Groq API key is available');
        return true;
      }
      
      setHasGroqKey(false);
      setIsCheckingAdminKey(false);
      console.log('No valid Groq API key found (local or admin)');
      return false;
    } catch (error) {
      console.error('Error checking Groq API key:', error);
      setHasGroqKey(false);
      setIsCheckingAdminKey(false);
      return false;
    }
  }, []);
  
  // Effect to check API key status on mount and when local storage changes
  useEffect(() => {
    const checkApiKeyStatus = async () => {
      setIsCheckingAdminKey(true);
      await checkGroqApiKey();
      setIsCheckingAdminKey(false);
    };
    
    // Check API key status immediately
    checkApiKeyStatus();
    
    // Set up event listeners for API key changes
    const handleStorageChange = () => {
      checkApiKeyStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('apikey-updated', handleStorageChange);
    window.addEventListener('localStorage-changed', handleStorageChange);
    
    // Clean up
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('apikey-updated', handleStorageChange);
      window.removeEventListener('localStorage-changed', handleStorageChange);
    };
  }, [checkGroqApiKey]);
  
  // Effect to update simulation mode based on API key status and manual mode setting
  useEffect(() => {
    // Only change simulation mode if user hasn't manually set it
    if (!manuallySetMode.current) {
      if (!hasGroqKey && !isAdminKeyAvailable && !isSimulationMode) {
        console.log('No API key available, enabling simulation mode automatically');
        setIsSimulationMode(true);
      } else if ((hasGroqKey || isAdminKeyAvailable) && isSimulationMode && !isCheckingAdminKey) {
        console.log('API key available, disabling simulation mode automatically');
        setIsSimulationMode(false);
      }
    }
  }, [hasGroqKey, isAdminKeyAvailable, isSimulationMode, setIsSimulationMode, isCheckingAdminKey]);
  
  // Function to reload API keys status
  const reloadApiKeys = useCallback(async () => {
    try {
      console.log('Reloading API key status...');
      setIsCheckingAdminKey(true);
      
      // Clear any existing key in localStorage
      const keyExists = await checkGroqApiKey();
      setHasGroqKey(keyExists);
      
      console.log('API key status reloaded:', {
        hasGroqKey: keyExists,
        isAdminKeyAvailable
      });
      
      // Broadcast the change to all components
      broadcastApiKeyChange();
      
      // Show toast notification
      if (keyExists) {
        toast({
          title: 'API Key Available',
          description: 'Groq API key is available for use',
          duration: 3000
        });
      } else {
        toast({
          title: 'API Key Unavailable',
          description: 'No Groq API key is currently available',
          variant: 'warning',
          duration: 3000
        });
      }
      
      setIsCheckingAdminKey(false);
      return keyExists;
    } catch (error) {
      console.error('Error reloading API keys:', error);
      setIsCheckingAdminKey(false);
      return false;
    }
  }, [checkGroqApiKey, isAdminKeyAvailable]);
  
  return {
    hasGroqKey,
    isAdminKeyAvailable,
    checkGroqApiKey,
    isCheckingAdminKey,
    reloadApiKeys,
    setManuallySetMode,
    manuallySetMode
  };
};

// Alias for backward compatibility
export const useAPIKeyMonitor = useApiKeyMonitor;
