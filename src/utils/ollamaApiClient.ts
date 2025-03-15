
// OllamaApiClient.ts
export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details?: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

interface OllamaConnectionStatus {
  success: boolean;
  message: string;
  models?: OllamaModel[];
}

class OllamaApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
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

  async checkConnection(): Promise<OllamaConnectionStatus> {
    try {
      console.log(`Checking connection to Ollama at ${this.baseUrl}`);
      const response = await fetch(`${this.baseUrl}/api/tags`);
      
      if (!response.ok) {
        console.error(`Connection failed with status: ${response.status} ${response.statusText}`);
        return {
          success: false,
          message: `Ollama server responded with an error: ${response.statusText}`,
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
      
      return {
        success: false,
        message: `Could not connect to Ollama: ${error instanceof Error ? error.message : 'Unknown error'}. Make sure Ollama is running.`,
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
