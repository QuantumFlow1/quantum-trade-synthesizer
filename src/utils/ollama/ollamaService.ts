
import { OllamaConnectionStatus } from './types';
import { ollamaApi } from './OllamaApiClient';
import { probeCorsError } from './connectionUtils';

/**
 * Helper function to test connection and get models
 */
export const testOllamaConnection = async (): Promise<OllamaConnectionStatus> => {
  try {
    console.log('Testing Ollama connection...');
    const connectionStatus = await ollamaApi.checkConnection();
    console.log('Connection status:', connectionStatus);
    
    // If we failed and a CORS error is suspected, run the probe to confirm
    if (!connectionStatus.success && connectionStatus.message.includes('CORS')) {
      const possibleCorsIssue = await probeCorsError(ollamaApi.getBaseUrl());
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
