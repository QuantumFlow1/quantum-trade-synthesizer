
/**
 * Log API calls to Supabase
 */
import { supabase } from "@/lib/supabase";

export type ApiCallStatus = 'success' | 'error' | 'pending';

/**
 * Log an API call to the server
 * 
 * @param endpoint The API endpoint or service name
 * @param source The source of the API call (e.g., component name)
 * @param status The status of the API call (success or error)
 * @param error_message Optional error message
 * @returns 
 */
export const logApiCall = async (
  endpoint: string, 
  source: string, 
  status: ApiCallStatus, 
  error_message?: string
): Promise<boolean> => {
  try {
    // Try to use the log-api-call edge function
    const { error } = await supabase.functions.invoke('log-api-call', {
      body: {
        endpoint,
        source,
        status,
        error_message,
        timestamp: new Date().toISOString()
      }
    });
    
    if (error) {
      console.error('Error logging API call:', error.message);
      return false;
    }
    
    return true;
  } catch (e) {
    // If the function fails, log to console
    console.error('Failed to log API call:', e);
    return false;
  }
};
