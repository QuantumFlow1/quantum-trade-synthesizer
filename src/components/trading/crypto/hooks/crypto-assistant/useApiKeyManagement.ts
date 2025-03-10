
import { useState, useCallback, useEffect } from 'react';

export function useApiKeyManagement() {
  // Load API key from localStorage
  const getApiKey = useCallback(() => {
    const apiKey = localStorage.getItem('groqApiKey');
    return apiKey || '';
  }, []);
  
  // Detect if API key is available
  const [hasApiKey, setHasApiKey] = useState(false);
  
  useEffect(() => {
    const checkApiKey = () => {
      const key = getApiKey();
      setHasApiKey(!!key && key.length > 5);
    };
    
    checkApiKey();
    
    // Listen for API key changes
    window.addEventListener('storage', checkApiKey);
    window.addEventListener('apikey-updated', checkApiKey);
    
    return () => {
      window.removeEventListener('storage', checkApiKey);
      window.removeEventListener('apikey-updated', checkApiKey);
    };
  }, [getApiKey]);

  return {
    getApiKey,
    hasApiKey
  };
}
