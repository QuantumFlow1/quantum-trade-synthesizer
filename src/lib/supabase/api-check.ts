
import { supabase } from './client';
import { withTimeout } from './utils';

// Function to check if the Grok3 API is properly configured and working
export const checkGrok3APIConfig = async () => {
  try {
    console.log('Checking Grok3 API configuration...');
    
    const grokApiPromise = supabase.functions.invoke('grok3-ping', {
      body: { 
        isAvailabilityCheck: true,
        timestamp: new Date().toISOString(), // Add timestamp to prevent caching
        retryAttempt: Math.floor(Math.random() * 1000) // Add random value to prevent caching
      }
    });
    
    const { data, error } = await withTimeout(
      grokApiPromise,
      5000,
      'Grok3 API configuration check timed out after 5 seconds'
    );
    
    if (error) {
      console.error('Grok3 API configuration error:', error);
      return { 
        isConfigured: false, 
        error: error 
      };
    }
    
    console.log('Grok3 API configuration check result:', data);
    
    return { 
      isConfigured: data?.status === "available",
      data: data
    };
  } catch (error) {
    console.error('Failed to check Grok3 API configuration:', error);
    return { 
      isConfigured: false, 
      error: error 
    };
  }
}
