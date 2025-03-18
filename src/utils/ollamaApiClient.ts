
import { OllamaModel, OllamaConnectionStatus } from './ollama/types';
import { delay, getConnectionErrorMessage, normalizeOllamaUrl } from './ollama/connectionUtils';

class OllamaApiClient {
  private baseUrl: string;
  private maxRetries: number = 2;
  private retryDelay: number = 1000;
  private corsError: boolean = false;
  private localOnly: boolean = true;
  
  // Track the connection status to avoid multiple simultaneous connection attempts
  private connectionInProgress: boolean = false;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  hasCorsError(): boolean {
    return this.corsError;
  }

  setBaseUrl(url: string) {
    // Validate this is a local URL if localOnly is enabled
    if (this.localOnly && 
        !url.includes('localhost') && 
        !url.includes('127.0.0.1') && 
        !url.includes('host.docker.internal') &&
        !url.includes('ollama:11434')) {
      console.warn(`Rejected non-local URL: ${url} - only local Ollama connections are allowed`);
      return;
    }
    
    const normalizedUrl = normalizeOllamaUrl(url);
    console.log(`Setting Ollama base URL to: ${normalizedUrl} (from: ${url})`);
    this.baseUrl = normalizedUrl;
    this.corsError = false; // Reset CORS error status when changing URL
  }

  // Alias for backward compatibility
  setHost(url: string) {
    this.setBaseUrl(url);
  }

  enableLocalOnly(enabled: boolean = true) {
    this.localOnly = enabled;
    console.log(`Local-only mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  async listModels(): Promise<OllamaModel[]> {
    try {
      console.log(`Fetching models from ${this.baseUrl}/api/tags`);
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        // Add CORS mode to help debug issues
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to list models: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Models fetched successfully:', data);
      return data.models || [];
    } catch (error) {
      console.error('Error listing models:', error);
      
      // Check if this is likely a CORS error
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        this.corsError = true;
        console.warn('Possible CORS error detected when listing models');
      }
      
      throw error;
    }
  }

  async checkConnection(retryCount = 0): Promise<OllamaConnectionStatus> {
    // Prevent multiple simultaneous connection attempts
    if (this.connectionInProgress) {
      console.log('Connection check already in progress, skipping duplicate request');
      return {
        success: false,
        message: 'Connection check already in progress',
      };
    }
    
    this.connectionInProgress = true;
    
    try {
      console.log(`Checking connection to Ollama at ${this.baseUrl} (attempt ${retryCount + 1}/${this.maxRetries + 1})`);
      
      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: controller.signal,
        // Add CORS mode to help debug issues
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).finally(() => {
        clearTimeout(timeoutId);
      });
      
      if (!response.ok) {
        const statusCode = response.status;
        console.error(`Connection failed with status: ${statusCode} ${response.statusText}`);
        
        if (statusCode === 403) {
          this.corsError = true;
          return {
            success: false,
            message: `CORS error (403 Forbidden): Your local Ollama server is blocking cross-origin requests. Start Ollama with OLLAMA_ORIGINS=${typeof window !== 'undefined' ? window.location.origin : '*'} to fix this issue.`,
          };
        }
        
        return {
          success: false,
          message: `Ollama server responded with an error: ${response.status} ${response.statusText}`,
        };
      }
      
      const data = await response.json();
      console.log('Connection successful, models:', data.models);
      this.corsError = false;
      
      return {
        success: true,
        message: 'Successfully connected to Ollama',
        models: data.models || [],
      };
    } catch (error) {
      console.error('Error checking Ollama connection:', error);
      
      // Retry logic
      if (retryCount < this.maxRetries) {
        console.log(`Retrying connection after ${this.retryDelay}ms...`);
        await delay(this.retryDelay);
        this.connectionInProgress = false;
        return this.checkConnection(retryCount + 1);
      }
      
      // Detect CORS errors
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        this.corsError = true;
        console.warn('CORS error detected during connection check');
        
        return {
          success: false,
          message: `CORS Error: Your browser is blocking the connection to your local Ollama. Start Ollama with OLLAMA_ORIGINS=${typeof window !== 'undefined' ? window.location.origin : '*'} to fix this issue.`,
        };
      }
      
      // Handle different types of errors
      return {
        success: false,
        message: getConnectionErrorMessage(error),
      };
    } finally {
      this.connectionInProgress = false;
    }
  }
}

// Create a singleton instance with default Ollama URL
export const ollamaApi = new OllamaApiClient('http://localhost:11434');
// Enable local-only mode by default
ollamaApi.enableLocalOnly(true);

export default ollamaApi;

// Export the testOllamaConnection function for convenience
export const testOllamaConnection = async (): Promise<OllamaConnectionStatus> => {
  return ollamaApi.checkConnection();
};
