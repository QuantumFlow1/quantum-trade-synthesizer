
import { useState, useEffect } from 'react';
import { GrokSettings, DEFAULT_SETTINGS } from '../types/GrokSettings';

export function useGrokSettings(isAdminContext = false) {
  const [grokSettings, setGrokSettings] = useState<GrokSettings>(DEFAULT_SETTINGS);
  
  // Load saved Grok settings if available
  useEffect(() => {
    if (isAdminContext) {
      console.log('Skip loading settings in admin context');
      return;
    }
    
    const savedSettings = localStorage.getItem('grokSettings');
    if (savedSettings) {
      try {
        setGrokSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Error parsing saved Grok settings:', e);
      }
    }
  }, [isAdminContext]);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    if (isAdminContext) {
      return;
    }
    
    localStorage.setItem('grokSettings', JSON.stringify(grokSettings));
  }, [grokSettings, isAdminContext]);

  return { grokSettings, setGrokSettings };
}
