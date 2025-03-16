
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
        await this.delay(this.retryDelay);
        return this.checkConnection(retryCount + 1);
      }
      
      // Handle the different types of errors
      if (error instanceof DOMException && error.name === 'AbortError') {
        return {
          success: false,
          message: 'Verbinding time-out. De server reageerde niet binnen 5 seconden.',
        };
      }
      
      let errorMessage = 'Onbekende fout';
      if (error instanceof Error) {
        errorMessage = error.message;
        // Special handling for CORS errors
        if (errorMessage.includes('CORS') || errorMessage.includes('cross-origin') || error instanceof TypeError && error.message.includes('Failed to fetch')) {
          this.corsError = true;
          errorMessage = 'Cross-origin (CORS) fout. Zorg ervoor dat de Ollama server is geconfigureerd om verzoeken van deze oorsprong toe te staan.';
        } else if (errorMessage.includes('NetworkError') || errorMessage.includes('Failed to fetch')) {
          errorMessage = 'Netwerkfout. Zorg ervoor dat de Docker-container toegankelijk is en de poort correct is blootgesteld.';
        }
      }
      
      return {
        success: false,
        message: `Kon geen verbinding maken met Ollama: ${errorMessage}. Zorg ervoor dat Ollama draait en bereikbaar is.`,
      };
    }
  }

  // Try to determine if Ollama is available but blocked by CORS
  async probeCorsError(): Promise<boolean> {
    try {
      // This will intentionally cause a CORS error if Ollama is running but not configured for CORS
      const img = new Image();
      img.src = `${this.baseUrl}/favicon.ico?_=${Date.now()}`;
      
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
    
    // If we failed and a CORS error is suspected, run the probe to confirm
    if (!connectionStatus.success && connectionStatus.message.includes('CORS')) {
      const possibleCorsIssue = await ollamaApi.probeCorsError();
      if (possibleCorsIssue) {
        console.log('CORS issue confirmed through probe');
        return {
          success: false,
          message: 'CORS fout bevestigd: Je Ollama server accepteert geen verzoeken van deze oorsprong. Probeer Ollama te starten met de OLLAMA_ORIGINS omgevingsvariabele ingesteld op je huidige oorsprong.',
        };
      }
    }
    
    return connectionStatus;
  } catch (error) {
    console.error('Error in testOllamaConnection:', error);
    return {
      success: false,
      message: `Fout bij testen van Ollama-verbinding: ${error instanceof Error ? error.message : 'Onbekende fout'}`,
    };
  }
};

// Export the client for use elsewhere
export default ollamaApi;
