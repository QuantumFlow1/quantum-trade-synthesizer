
import { useState, useEffect } from "react";
import { showApiKeyDetectedToast, showApiKeyErrorToast } from "@/components/chat/api-keys/ApiKeyToastNotification";

export interface ApiKeyStatus {
  exists: boolean;
  keyLength: number;
}

export const useApiKeyStatus = (
  initialHasApiKey: boolean = false,
  reloadApiKeys: () => void
) => {
  const [apiKeyStatus, setApiKeyStatus] = useState<ApiKeyStatus>({ 
    exists: initialHasApiKey, 
    keyLength: 0 
  });
  const [keyRecheckCount, setKeyRecheckCount] = useState(0);

  const checkApiKey = () => {
    const actualApiKey = localStorage.getItem("groqApiKey");
    const keyExists = !!actualApiKey && actualApiKey.trim().length > 0;
    
    setApiKeyStatus({
      exists: keyExists,
      keyLength: actualApiKey ? actualApiKey.trim().length : 0
    });
    
    console.log("API Key Status Check #" + keyRecheckCount, { 
      exists: keyExists, 
      keyLength: actualApiKey ? actualApiKey.trim().length : 0,
      key: actualApiKey ? `${actualApiKey.substring(0, 4)}...${actualApiKey.substring(actualApiKey.length - 4)}` : 'none'
    });
    
    setKeyRecheckCount(prev => prev + 1);
    return keyExists;
  };

  const handleForceReload = () => {
    console.log("Forcing API key reload");
    reloadApiKeys();
    
    // Also check again right now
    const actualApiKey = localStorage.getItem("groqApiKey");
    const keyExists = !!actualApiKey && actualApiKey.trim().length > 0;
    
    setApiKeyStatus({
      exists: keyExists,
      keyLength: actualApiKey ? actualApiKey.trim().length : 0
    });
    
    // Use our custom toast component
    if (keyExists) {
      showApiKeyDetectedToast('Groq');
    } else {
      showApiKeyErrorToast('Groq', "No Groq API key found in storage");
    }
  };

  useEffect(() => {
    checkApiKey();

    const handleStorageChange = () => {
      console.log("Storage change detected");
      checkApiKey();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('apikey-updated', handleStorageChange);
    window.addEventListener('localStorage-changed', handleStorageChange);

    const intervalId = setInterval(checkApiKey, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('apikey-updated', handleStorageChange);
      window.removeEventListener('localStorage-changed', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [keyRecheckCount]);

  return {
    apiKeyStatus,
    setApiKeyStatus,
    checkApiKey,
    handleForceReload
  };
};
