import { OllamaConnectionStatus } from './types';

/**
 * Helper function to delay execution
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Try to determine if Ollama is available but blocked by CORS
 * This is disabled to avoid showing CORS errors
 */
export const probeCorsError = async (baseUrl: string): Promise<boolean> => {
  return false; // Disable CORS probing to avoid showing CORS errors
};

/**
 * Normalizes a URL string to ensure proper formatting for Ollama API
 */
export const normalizeOllamaUrl = (url: string): string => {
  let normalizedUrl = url;
  
  // Check if this might be a Docker container ID/name
  if (url.match(/^[a-zA-Z0-9_-]+$/) && !url.includes('.') && !url.includes(':')) {
    console.log(`Detected Docker container ID/name format: ${url}`);
    normalizedUrl = `http://${url}:11434`;
  } else {
    // Otherwise, use standard URL normalization
    // Add protocol if missing
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `http://${normalizedUrl}`;
    }
    
    // Add port if missing (unless it's a specific alternative port like 11435 or 37321)
    if (!normalizedUrl.includes(':')) {
      normalizedUrl = `${normalizedUrl}:11434`;
    }
  }
  
  console.log(`Normalized Ollama URL: ${normalizedUrl}`);
  return normalizedUrl;
};

/**
 * Handles error messages from connection attempts
 */
export const getConnectionErrorMessage = (error: unknown): string => {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return 'Connection timeout. Server did not respond within 5 seconds.';
  }
  
  // Generic error message without revealing CORS details
  return 'Could not connect to Ollama. Ensure Ollama is running and accessible.';
}
