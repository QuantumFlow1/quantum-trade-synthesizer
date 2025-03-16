
/**
 * Check if the current environment is localhost
 */
export function isLocalhostEnvironment(): boolean {
  return typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname.includes('gitpod') ||
     window.location.hostname.includes('lovableproject.com')); // Include this for easier testing
}

/**
 * Check if the current environment is Gitpod or other cloud IDE
 */
export function isGitpodEnvironment(): boolean {
  return typeof window !== 'undefined' && 
    (window.location.hostname.includes('gitpod.io') || 
     window.location.hostname.includes('lovableproject.com'));
}

/**
 * Get the current origin for CORS suggestions
 */
export function getCurrentOrigin(): string {
  return typeof window !== 'undefined' ? window.location.origin : '';
}

/**
 * Check if Ollama would be running on the local machine
 */
export function isOllamaLocal(): boolean {
  // In localhost environment, Ollama should be running locally
  // In Gitpod or other cloud environments, it's likely running in a container
  return isLocalhostEnvironment() && 
         !window.location.hostname.includes('gitpod') && 
         !window.location.hostname.includes('lovableproject.com');
}

/**
 * Suggest the best Ollama connection address based on the environment
 */
export function suggestOllamaAddress(): string {
  if (isOllamaLocal()) {
    return 'http://localhost:11434';
  } else if (isGitpodEnvironment()) {
    return 'http://ollama:11434';
  } else {
    // For other environments, localhost is still a reasonable default
    return 'http://localhost:11434';
  }
}

/**
 * Helper to delay execution
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
