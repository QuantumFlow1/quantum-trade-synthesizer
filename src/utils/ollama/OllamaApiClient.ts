
import { OllamaModel, OllamaConnectionStatus } from './types';
import { delay, getConnectionErrorMessage, normalizeOllamaUrl } from './connectionUtils';

class OllamaApiClient {
  private baseUrl: string;
  private maxRetries: number = 2;
  private retryDelay: number = 1000;
  private corsError: boolean = false;

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
    this.baseUrl = normalizeOllamaUrl(url);
    this.corsError = false; // Reset CORS error status when changing URL
  }

  // Alias for backward compatibility
  setHost(url: string) {
    this.setBaseUrl(url);
  }

  async listModels(): Promise<OllamaModel[]> {
    try {
      console.log(`Fetching models from ${this.baseUrl}/api/tags`);
      const response = await fetch(`${this.baseUrl}/api/tags`);
      
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
        console.warn('Possible CORS error detected');
      }
      
      throw error;
    }
  }

  async checkConnection(retryCount = 0): Promise<OllamaConnectionStatus> {
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
            message: `CORS error (403 Forbidden): De Ollama server blokkeert cross-origin verzoeken. Controleer of je Ollama server de juiste ORIGINS instellingen heeft. De huidige applicatie-oorsprong staat mogelijk niet in de toegestane lijst.`,
          };
        }
        
        return {
          success: false,
          message: `Ollama server reageerde met een fout: ${response.status} ${response.statusText}`,
        };
      }
      
      const data = await response.json();
      console.log('Connection successful, models:', data.models);
      this.corsError = false;
      
      return {
        success: true,
        message: 'Succesvol verbonden met Ollama',
        models: data.models || [],
      };
    } catch (error) {
      console.error('Error checking Ollama connection:', error);
      
      // Retry logic
      if (retryCount < this.maxRetries) {
        console.log(`Retrying connection after ${this.retryDelay}ms...`);
        await delay(this.retryDelay);
        return this.checkConnection(retryCount + 1);
      }
      
      // Handle different types of errors
      return {
        success: false,
        message: getConnectionErrorMessage(error),
      };
    }
  }
}

// Create a singleton instance with default Ollama URL
export const ollamaApi = new OllamaApiClient('http://localhost:11434');

export default ollamaApi;
