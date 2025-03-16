import { OllamaConnectionStatus } from './types';

/**
 * Helper function to delay execution
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Try to determine if Ollama is available but blocked by CORS
 */
export const probeCorsError = async (baseUrl: string): Promise<boolean> => {
  try {
    // This will intentionally cause a CORS error if Ollama is running but not configured for CORS
    const img = new Image();
    img.src = `${baseUrl}/favicon.ico?_=${Date.now()}`;
    
    return new Promise(resolve => {
      // If the image loads, Ollama is probably running with CORS headers
      img.onload = () => {
        console.log('Image loaded successfully, CORS might be configured correctly');
        resolve(false);
      };
      
      // If there's an error, it could be due to CORS or Ollama not running
      img.onerror = () => {
        console.log('Image failed to load, possible CORS issue');
        // We can't really differentiate between CORS and service unavailable just from the image load
        // But we'll assume CORS might be the issue
        resolve(true);
      };
      
      // Set a timeout to ensure we get a response one way or another
      setTimeout(() => resolve(false), 2000);
    });
  } catch (e) {
    console.error('Error in CORS probe:', e);
    return false;
  }
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
    return 'Verbinding time-out. De server reageerde niet binnen 5 seconden.';
  }
  
  let errorMessage = 'Onbekende fout';
  if (error instanceof Error) {
    errorMessage = error.message;
    // Special handling for CORS errors
    if (errorMessage.includes('CORS') || errorMessage.includes('cross-origin') || error instanceof TypeError && error.message.includes('Failed to fetch')) {
      errorMessage = 'Cross-origin (CORS) fout. Zorg ervoor dat de Ollama server is geconfigureerd om verzoeken van deze oorsprong toe te staan.';
    } else if (errorMessage.includes('NetworkError') || errorMessage.includes('Failed to fetch')) {
      errorMessage = 'Netwerkfout. Zorg ervoor dat de Docker-container toegankelijk is en de poort correct is blootgesteld.';
    }
  }
  
  return `Kon geen verbinding maken met Ollama: ${errorMessage}. Zorg ervoor dat Ollama draait en bereikbaar is.`;
}
