
import { OllamaConnectionStatus } from './types';
import { ollamaApi } from './OllamaApiClient';

/**
 * Helper function to test connection and get models
 * Now with simplified error handling that hides technical details
 */
export const testOllamaConnection = async (): Promise<OllamaConnectionStatus> => {
  try {
    console.log('Testing Ollama connection...');
    const connectionStatus = await ollamaApi.checkConnection();
    
    return connectionStatus;
  } catch (error) {
    console.error('Error in testOllamaConnection:', error);
    return {
      success: false,
      message: 'Unable to connect to Ollama service.',
    };
  }
};
