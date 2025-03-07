
/**
 * Utility functions to handle fallbacks when services are unavailable
 */

/**
 * Generate mock agent connection data when the real agent network is unavailable
 */
export const generateMockAgentConnection = () => {
  return {
    status: "connected",
    message: "Simulated agent network connection (fallback)",
    activeAgents: Math.floor(Math.random() * 5) + 2, // Random number between 2-6
    timestamp: new Date().toISOString()
  };
};

/**
 * Check if we should enter fallback mode
 * This is used when the backend services are unavailable
 */
export const shouldUseFallbackMode = (): boolean => {
  // Check if we're in fallback mode via local storage
  const fallbackMode = localStorage.getItem('fallbackMode');
  return fallbackMode === 'true';
};

/**
 * Set fallback mode on or off
 */
export const setFallbackMode = (enabled: boolean): void => {
  localStorage.setItem('fallbackMode', enabled ? 'true' : 'false');
  
  // Notify any listeners that fallback mode has changed
  window.dispatchEvent(new CustomEvent('fallback-mode-changed', {
    detail: { enabled }
  }));
};

/**
 * Toggle fallback mode
 */
export const toggleFallbackMode = (): boolean => {
  const newState = !shouldUseFallbackMode();
  setFallbackMode(newState);
  return newState;
};
