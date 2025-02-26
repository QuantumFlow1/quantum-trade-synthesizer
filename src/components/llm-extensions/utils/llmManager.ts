
// Global state to track which LLM is currently active
let activeLLM: 'claude' | 'openai' | 'grok' | 'deepseek' | null = null;

/**
 * Sets the active LLM and deactivates all others
 * @param llm The LLM to activate
 * @returns The newly activated LLM
 */
export const setActiveLLM = (llm: 'claude' | 'openai' | 'grok' | 'deepseek' | null): string | null => {
  console.log(`Setting active LLM to: ${llm}`);
  
  // Broadcast to all components that a new LLM is active
  const event = new CustomEvent('llm-changed', { detail: { active: llm } });
  window.dispatchEvent(event);
  
  // Update global state
  activeLLM = llm;
  
  // Store in localStorage for persistence across refreshes
  if (llm) {
    localStorage.setItem('activeLLM', llm);
  } else {
    localStorage.removeItem('activeLLM');
  }
  
  return llm;
};

/**
 * Gets the currently active LLM
 * @returns The active LLM or null if none is active
 */
export const getActiveLLM = (): string | null => {
  // If not initialized yet, check localStorage
  if (activeLLM === null && typeof window !== 'undefined') {
    const stored = localStorage.getItem('activeLLM');
    if (stored) {
      activeLLM = stored as 'claude' | 'openai' | 'grok' | 'deepseek';
    }
  }
  
  return activeLLM;
};

/**
 * Checks if a specific LLM is currently active
 * @param llm The LLM to check
 * @returns True if this LLM is active
 */
export const isLLMActive = (llm: 'claude' | 'openai' | 'grok' | 'deepseek'): boolean => {
  return getActiveLLM() === llm;
};

/**
 * Hook to listen for LLM changes
 * @param callback Function to call when active LLM changes
 */
export const useLLMChangeListener = (
  callback: (activeLLM: string | null) => void
) => {
  useEffect(() => {
    const handleLLMChange = (event: CustomEvent) => {
      callback(event.detail.active);
    };
    
    // Add event listener
    window.addEventListener('llm-changed', handleLLMChange as EventListener);
    
    // Initialize with current value
    callback(getActiveLLM());
    
    // Clean up
    return () => {
      window.removeEventListener('llm-changed', handleLLMChange as EventListener);
    };
  }, [callback]);
};
