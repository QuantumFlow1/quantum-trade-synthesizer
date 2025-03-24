
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export function useClaudeApiKey() {
  const [apiKey, setApiKey] = useState('');
  
  // Load saved API key from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('claudeApiKey');
    if (savedApiKey) {
      console.log('Found saved Claude API key in localStorage');
      setApiKey(savedApiKey);
    } else {
      console.log('No Claude API key found in localStorage');
    }
  }, []);

  // Save API key
  const saveApiKey = useCallback((newApiKey: string) => {
    try {
      if (!newApiKey || newApiKey.trim() === '') {
        toast({
          title: "API key cannot be empty",
          description: "Please enter a valid Claude API key.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
      
      // Basic validation - Claude API keys should start with a certain format
      if (!newApiKey.startsWith('sk-ant-')) {
        toast({
          title: "Invalid API key format",
          description: "Claude API keys typically start with 'sk-ant-'",
          variant: "warning",
          duration: 5000,
        });
        // Continue anyway as this is just a warning
      }
      
      const trimmedKey = newApiKey.trim();
      setApiKey(trimmedKey);
      localStorage.setItem('claudeApiKey', trimmedKey);
      
      toast({
        title: "API key saved",
        description: "Your Claude API key has been saved.",
        duration: 3000,
      });
      
      // Trigger custom event for other components
      window.dispatchEvent(new Event('apikey-updated'));
      window.dispatchEvent(new Event('localStorage-changed'));
      window.dispatchEvent(new Event('storage'));
      
      // Update connection status
      window.dispatchEvent(new CustomEvent('connection-status-changed', {
        detail: { provider: 'claude', status: 'connected' }
      }));
      
      console.log('Claude API key saved successfully');
    } catch (e) {
      console.error('Error saving Claude API key:', e);
      toast({
        title: "Error saving API key",
        description: "Failed to save your Claude API key.",
        variant: "destructive",
        duration: 3000,
      });
    }
  }, []);

  return { apiKey, saveApiKey };
}
