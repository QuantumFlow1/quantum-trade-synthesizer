
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

// Handle CORS and implement retries with exponential backoff
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Grok3 API availability check started');
    
    let reqData;
    try {
      reqData = await req.json().catch(() => ({}));
    } catch (e) {
      reqData = {};
    }
    
    console.log('Request data:', JSON.stringify({
      isAvailabilityCheck: reqData.isAvailabilityCheck,
      timestamp: reqData.timestamp,
      retry: reqData.retry || 0
    }));
    
    // Check if the environment has the Grok3 API key set
    const GROK3_API_KEY = Deno.env.get('GROK3_API_KEY');
    
    if (!GROK3_API_KEY) {
      console.log('No Grok3 API key found in environment variables');
      return new Response(
        JSON.stringify({ 
          status: 'unavailable', 
          message: 'Grok3 API key not configured in server environment' 
        }),
        { headers: corsHeaders, status: 200 }
      );
    }
    
    // Basic validation of the API key format
    if (!GROK3_API_KEY.startsWith('gsk_') && !GROK3_API_KEY.startsWith('sk-')) {
      console.error('Invalid Grok3 API key format');
      return new Response(
        JSON.stringify({ 
          status: 'unavailable', 
          message: 'Invalid API key format. Grok3 API keys should start with "gsk_" or "sk-"' 
        }),
        { headers: corsHeaders, status: 200 }
      );
    }
    
    // Get request parameters
    const { isAvailabilityCheck = true, testApiCall = false, retry = 0 } = reqData;
    
    console.log(`Grok3 ping: availability check=${isAvailabilityCheck}, test API call=${testApiCall}, retry=${retry}`);
    
    // If testApiCall is true, we'll explicitly test the API key
    if (testApiCall || !isAvailabilityCheck) {
      console.log('Performing explicit API key validation test');
      
      // Implement retry logic with exponential backoff for API calls
      const MAX_RETRIES = 3;
      let currentRetry = 0;
      let lastError = null;
      
      while (currentRetry <= MAX_RETRIES) {
        try {
          // Add delay for retries (exponential backoff)
          if (currentRetry > 0) {
            const delay = Math.pow(2, currentRetry) * 500; // 500ms, 1s, 2s, 4s...
            console.log(`Retry ${currentRetry}/${MAX_RETRIES}, waiting ${delay}ms before retrying...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
          
          // Simple test request to Grok3 API
          const response = await fetch('https://api.xai.com/v1/models', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${GROK3_API_KEY}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            const errorText = await response.text().catch(() => 'Failed to read error response');
            console.error(`Grok3 API test request failed: ${response.status} ${response.statusText}`, errorText);
            
            // Check specifically for invalid API key (usually 401 Unauthorized)
            if (response.status === 401) {
              return new Response(
                JSON.stringify({ 
                  status: 'unavailable', 
                  message: 'Invalid API Key. Please check your Grok3 API key and update it in the settings.' 
                }),
                { headers: corsHeaders, status: 200 }
              );
            }
            
            lastError = `API test failed: ${response.status} ${response.statusText}`;
            currentRetry++;
            continue; // Try again if not 401
          }
          
          console.log('Grok3 API test request successful');
          return new Response(
            JSON.stringify({ 
              status: 'available', 
              message: 'Grok3 API connection successful' 
            }),
            { headers: corsHeaders, status: 200 }
          );
        } catch (fetchError) {
          console.error(`Attempt ${currentRetry + 1} failed:`, fetchError);
          lastError = fetchError.message;
          currentRetry++;
          
          if (currentRetry > MAX_RETRIES) {
            console.error('All retry attempts failed');
            break;
          }
        }
      }
      
      return new Response(
        JSON.stringify({ 
          status: 'unavailable', 
          message: `Failed to connect to Grok3 API after ${MAX_RETRIES} attempts: ${lastError}` 
        }),
        { headers: corsHeaders, status: 200 }
      );
    }
    
    // For simple availability checks, just verify the API key exists and has valid format
    console.log('Simple availability check - API key exists with valid format');
    return new Response(
      JSON.stringify({ 
        status: 'available', 
        message: 'Grok3 API key is configured with valid format',
        retryCount: retry 
      }),
      { headers: corsHeaders, status: 200 }
    );
  } catch (error) {
    console.error('Error in grok3-ping function:', error);
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error.message || 'An error occurred during API availability check' 
      }),
      { headers: corsHeaders, status: 500 }
    );
  }
});
