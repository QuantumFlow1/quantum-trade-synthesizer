// OllamaApiClient.ts
import { OllamaModel } from '@/components/llm-extensions/ollama/types/ollamaTypes';

interface OllamaConnectionStatus {
  success: boolean;
  message: string;
  models?: OllamaModel[];
}

class OllamaApiClient {
  private baseUrl: string;
  private maxRetries: number = 2;
  private retryDelay: number = 1000;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  setBaseUrl(url: string) {
    // Normalize URL
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
    
    console.log(`Setting Ollama API base URL to: ${normalizedUrl}`);
    this.baseUrl = normalizedUrl;
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
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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
          return {
            success: false,
            message: `CORS error (403 Forbidden): The Ollama server is rejecting cross-origin requests. Check that your Ollama server has the correct ORIGINS settings. The current application origin might not be in the allowed list.`,
          };
        }
        
        return {
          success: false,
          message: `Ollama server responded with an error: ${response.status} ${response.statusText}`,
        };
      }
      
      const data = await response.json();
      console.log('Connection successful, models:', data.models);
      
      return {
        success: true,
        message: 'Connected to Ollama successfully',
        models: data.models || [],
      };
    } catch (error) {
      console.error('Error checking Ollama connection:', error);
      
      // Retry logic
      if (retryCount < this.maxRetries) {
        console.log(`Retrying connection after ${this.retryDelay}ms...`);
        await this.delay(this.retryDelay);
        return this.checkConnection(retryCount + 1);
      }
      
      // Handle the different types of errors
      if (error instanceof DOMException && error.name === 'AbortError') {
        return {
          success: false,
          message: 'Connection timed out. The server did not respond within 5 seconds.',
        };
      }
      
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
        // Special handling for CORS errors
        if (errorMessage.includes('CORS') || errorMessage.includes('cross-origin')) {
          errorMessage = 'Cross-origin (CORS) error. Make sure the Ollama server is configured to allow requests from this origin.';
        } else if (errorMessage.includes('NetworkError') || errorMessage.includes('Failed to fetch')) {
          errorMessage = 'Network error. Make sure the Docker container is accessible and the port is correctly exposed.';
        }
      }
      
      return {
        success: false,
        message: `Could not connect to Ollama: ${errorMessage}. Make sure Ollama is running and reachable.`,
      };
    }
  }
}

// Create a singleton instance with default Ollama URL
export const ollamaApi = new OllamaApiClient('http://localhost:11434');

// Helper function to test connection and get models
export const testOllamaConnection = async (): Promise<OllamaConnectionStatus> => {
  try {
    console.log('Testing Ollama connection...');
    const connectionStatus = await ollamaApi.checkConnection();
    console.log('Connection status:', connectionStatus);
    return connectionStatus;
  } catch (error) {
    console.error('Error in testOllamaConnection:', error);
    return {
      success: false,
      message: `Failed to test Ollama connection: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

// Export the client for use elsewhere
export default ollamaApi;
