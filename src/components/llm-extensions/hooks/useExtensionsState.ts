
import { useState, useEffect } from 'react';

export function useExtensionsState() {
  // Set default values for enabled LLMs
  const [enabledLLMs, setEnabledLLMs] = useState<Record<string, boolean>>(() => {
    try {
      // Try to load saved preferences
      const savedSettings = localStorage.getItem('enabledLLMs');
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (e) {
      console.error('Error loading LLM preferences:', e);
    }
    // Default values if nothing is saved
    return {
      deepseek: false,
      openai: false,
      grok: true,     // Enable Groq by default
      claude: false,
      ollama: true    // Enable Ollama by default
    };
  });
  
  // Initialize with Groq as the active tab if enabled, otherwise use the first enabled LLM
  const [activeTab, setActiveTab] = useState(() => {
    if (enabledLLMs.grok) return 'grok';
    if (enabledLLMs.ollama) return 'ollama';
    // Find first enabled LLM
    const firstEnabled = Object.entries(enabledLLMs).find(([_, enabled]) => enabled);
    return firstEnabled ? firstEnabled[0] : 'ollama';
  });
  
  // Save enabled LLMs to localStorage when changed
  useEffect(() => {
    localStorage.setItem('enabledLLMs', JSON.stringify(enabledLLMs));
  }, [enabledLLMs]);
  
  return { enabledLLMs, setEnabledLLMs, activeTab, setActiveTab };
}
