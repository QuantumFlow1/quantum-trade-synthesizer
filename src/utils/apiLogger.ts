
/**
 * Log API calls to Supabase
 */
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

export type ApiCallStatus = 'success' | 'error' | 'pending';

/**
 * Log an API call to the server
 * 
 * @param endpoint The API endpoint or service name
 * @param source The source of the API call (e.g., component name)
 * @param status The status of the API call (success, error, or pending)
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
    console.log(`Logging API call: ${endpoint} from ${source} with status ${status}`);
    
    // First try to use the edge function
    try {
      const { data, error } = await supabase.functions.invoke('log-api-call', {
        body: {
          endpoint,
          source,
          status,
          error_message,
          timestamp: new Date().toISOString()
        }
      });
      
      if (!error) {
        console.log('API call logged successfully via edge function');
        return true;
      }
      
      console.warn('Edge function logging failed, falling back to local logging:', error);
    } catch (e) {
      console.warn('Edge function call failed:', e);
    }
    
    // Create fallback logging to console if edge function fails
    console.info('API Log Fallback:', {
      endpoint,
      source,
      status,
      error_message,
      timestamp: new Date().toISOString()
    });
    
    return true;
  } catch (e) {
    // If all logging fails, at least log to console
    console.error('Failed to log API call:', e);
    
    // Create fallback logging to console
    console.info('API Log Fallback:', {
      endpoint,
      source,
      status,
      error_message,
      timestamp: new Date().toISOString()
    });
    
    return false;
  }
};

/**
 * Create a simple console-only logger that doesn't require the edge function
 * Use this as a fallback when the main logger isn't working
 */
export const logApiCallLocal = (
  endpoint: string,
  source: string,
  status: ApiCallStatus,
  error_message?: string
): void => {
  console.info('API Call (Local):', {
    endpoint,
    source,
    status,
    error_message,
    timestamp: new Date().toISOString()
  });
};

/**
 * Show a toast notification for API errors
 */
export const showApiErrorToast = (message: string): void => {
  toast({
    title: "API Error",
    description: message,
    variant: "destructive",
  });
};
