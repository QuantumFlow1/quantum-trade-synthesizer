
/**
 * A client for interacting with the locally hosted Ollama API
 */
import { toast } from "@/components/ui/use-toast";
import { logApiCall } from "./apiLogger";

// Default Ollama host - should be configured based on where Ollama is running
const DEFAULT_OLLAMA_HOST = "http://localhost:11434";

export type OllamaModel = {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
};

export class OllamaApiClient {
  private host: string;
  
  constructor(host?: string) {
    this.host = host || DEFAULT_OLLAMA_HOST;
  }
  
  /**
   * Set the host for the Ollama API
   */
  setHost(host: string) {
    this.host = host;
  }
  
  /**
   * Get the configured host
   */
  getHost(): string {
    return this.host;
  }
  
  /**
   * Check if Ollama is available
   */
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.host}/api/tags`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking Ollama connection:', error);
      return false;
    }
  }
  
  /**
   * List all available models from Ollama
   */
  async listModels(): Promise<OllamaModel[]> {
    try {
      await logApiCall('ollama/list-models', 'OllamaApiClient', 'pending');
      
      const response = await fetch(`${this.host}/api/tags`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to list models: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      await logApiCall('ollama/list-models', 'OllamaApiClient', 'success');
      
      return data.models || [];
    } catch (error) {
      console.error('Error listing Ollama models:', error);
      await logApiCall('ollama/list-models', 'OllamaApiClient', 'error', error.message);
      throw error;
    }
  }
  
  /**
   * Generate chat completions using Ollama
   */
  async createChatCompletion(
    messages: Array<{ role: 'system' | 'user' | 'assistant', content: string }>,
    model: string,
    options?: {
      temperature?: number;
      top_p?: number;
      max_tokens?: number;
    }
  ): Promise<string> {
    try {
      await logApiCall('ollama/chat', 'OllamaApiClient', 'pending');
      
      const response = await fetch(`${this.host}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          options: {
            temperature: options?.temperature || 0.7,
            top_p: options?.top_p || 0.9,
            num_predict: options?.max_tokens || 1024,
          },
          stream: false,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      await logApiCall('ollama/chat', 'OllamaApiClient', 'success');
      
      return data.message?.content || '';
    } catch (error) {
      console.error('Error calling Ollama chat API:', error);
      await logApiCall('ollama/chat', 'OllamaApiClient', 'error', error.message);
      throw error;
    }
  }
}

// Create a singleton instance for easy imports
export const ollamaApi = new OllamaApiClient();

// Function to test if Ollama is available
export async function testOllamaConnection(host?: string): Promise<{ success: boolean; message: string }> {
  try {
    if (host) {
      ollamaApi.setHost(host);
    }
    
    const isAvailable = await ollamaApi.checkConnection();
    
    if (isAvailable) {
      return { 
        success: true, 
        message: 'Successfully connected to Ollama' 
      };
    } else {
      return { 
        success: false, 
        message: 'Could not connect to Ollama API. Make sure Ollama is running.' 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to connect to Ollama' 
    };
  }
}
