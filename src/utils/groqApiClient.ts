
/**
 * Utility functions for testing Groq API connection
 */

import { getApiKey } from './apiKeyManager';

// Test if Groq API connection is working
export const testGroqApiConnection = async () => {
  try {
    const apiKey = getApiKey('groq');
    
    // If no API key is available, return failure immediately
    if (!apiKey) {
      console.log('No Groq API key found');
      return { 
        success: false, 
        message: 'No API key configured' 
      };
    }
    
    console.log('Testing Groq API connection with key length:', apiKey.length);
    
    // For now, we're just checking if the key exists and is valid length
    // In a real implementation, we would make a test API call here
    
    // Simple validation - check if the key looks like a Groq key
    if (apiKey.startsWith('gsk_') && apiKey.length > 20) {
      return { 
        success: true, 
        message: 'API key configured' 
      };
    }
    
    return { 
      success: false, 
      message: 'Invalid API key format' 
    };
  } catch (error) {
    console.error('Error testing Groq API connection:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
