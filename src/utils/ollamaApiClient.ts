
// This file is a compatibility layer for existing imports
// It re-exports everything from the new modular structure

import { ollamaApi } from './ollama/OllamaApiClient';
import { testOllamaConnection } from './ollama/ollamaService';
import type { OllamaConnectionStatus, OllamaModel } from './ollama/types';

// Export the types
export type { OllamaConnectionStatus, OllamaModel };

// Export the main API client
export { ollamaApi, testOllamaConnection };

// Default export for backward compatibility
export default ollamaApi;
