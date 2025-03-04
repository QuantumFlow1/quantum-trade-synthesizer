
import { supabase } from "@/lib/supabase";

/**
 * Logs API calls to the api_logs table in Supabase and the console
 * 
 * @param endpoint The API endpoint or service name
 * @param source The source of the API call (component/function name)
 * @param status The status of the API call (success/error)
 * @param error_message Optional error message if the API call failed
 */
export const logApiCall = async (
  endpoint: string,
  source: string,
  status: 'success' | 'error',
  error_message?: string
) => {
  const timestamp = new Date().toISOString();
  
  // First log to console for immediate feedback
  console.log(`[API Call] ${endpoint} from ${source}: ${status}${error_message ? ' - ' + error_message : ''}`);
  
  try {
    // Log to Supabase using the log-api-call edge function
    await supabase.functions.invoke('log-api-call', {
      body: {
        endpoint,
        source,
        status,
        error_message,
        timestamp
      }
    });
  } catch (error) {
    // Don't let logging errors affect the application
    console.error('Failed to log API call to Supabase:', error);
  }
};

/**
 * Creates a wrapper function that automatically logs API calls
 * 
 * @param apiCall The API call function to wrap
 * @param endpoint The API endpoint or service name
 * @param source The source of the API call (component/function name)
 */
export const withApiLogging = <T, Args extends any[]>(
  apiCall: (...args: Args) => Promise<T>,
  endpoint: string,
  source: string
) => {
  return async (...args: Args): Promise<T> => {
    try {
      const result = await apiCall(...args);
      await logApiCall(endpoint, source, 'success');
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await logApiCall(endpoint, source, 'error', errorMessage);
      throw error;
    }
  };
};
