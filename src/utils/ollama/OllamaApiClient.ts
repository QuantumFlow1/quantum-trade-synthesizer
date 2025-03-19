
import { OllamaModel, OllamaConnectionStatus } from './types';
import { delay, getConnectionErrorMessage, normalizeOllamaUrl } from './connectionUtils';

class OllamaApiClient {
  private baseUrl: string;
  private maxRetries: number = 2;
  private retryDelay: number = 1000;
  private corsError: boolean = false;
  
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
    const normalizedUrl = normalizeOllamaUrl(url);
    console.log(`Setting Ollama base URL to: ${normalizedUrl} (from: ${url})`);
    this.baseUrl = normalizedUrl;
    this.corsError = false; // Reset CORS error status when changing URL
  }

  // Alias for backward compatibility
  setHost(url: string) {
    this.setBaseUrl(url);
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
      
      // Just log the error but don't set corsError flag to avoid showing CORS errors in UI
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
        console.error(`Connection failed with status: ${response.status} ${response.statusText}`);
        
        return {
          success: false,
          message: `Ollama server responded with an error`,
        };
      }
      
      const data = await response.json();
      console.log('Connection successful, models:', data.models);
      
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
      
      // Generic error message without revealing CORS details
      return {
        success: false,
        message: `Could not connect to Ollama service`,
      };
    } finally {
      this.connectionInProgress = false;
    }
  }
}

// Create a singleton instance with default Ollama URL
export const ollamaApi = new OllamaApiClient('http://localhost:11434');

export default ollamaApi;
