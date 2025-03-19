
import { OllamaConnectionStatus } from './types';
import { ollamaApi } from './OllamaApiClient';

/**
 * Helper function to test connection and get models
 */
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
      message: `Error checking Ollama connection: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};
