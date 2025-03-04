
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get environment variables
const GROK3_API_KEY = Deno.env.get('GROK3_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const requestData = await req.json().catch((e) => {
      console.error('Error parsing request JSON:', e);
      return {};
    });
    
    const { message, context = [], isAvailabilityCheck = false } = requestData;
    
    console.log(`Grok3 API request received${isAvailabilityCheck ? ' (availability check)' : ''}`);
    console.log(`Message length: ${message?.length || 0}, context messages: ${context?.length || 0}`);
    
    // If this is just an availability check, return success
    if (isAvailabilityCheck) {
      console.log('Grok3 availability check - responding with pong');
      return new Response(
        JSON.stringify({ 
          status: 'available', 
          response: 'pong' 
        }),
        { headers: corsHeaders }
      );
    }
    
    // Verify API key is set
    if (!GROK3_API_KEY) {
      console.error('No Grok3 API key provided in environment');
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured on server',
          status: 'unavailable' 
        }),
        { 
          status: 400, 
          headers: corsHeaders 
        }
      );
    }
    
    // Validate API key format (basic check)
    if (!GROK3_API_KEY.startsWith('gsk_') && !GROK3_API_KEY.startsWith('sk-')) {
      console.error('Invalid Grok3 API key format');
      return new Response(
        JSON.stringify({ 
          error: 'Invalid API key format. Grok3 API keys should start with "gsk_" or "sk-"',
          status: 'unavailable' 
        }),
        { 
          status: 400, 
          headers: corsHeaders 
        }
      );
    }
    
    // Format the messages for Grok3 API
    const formattedMessages = [...context];
    
    // Add current message if provided
    if (message) {
      if (typeof message === 'string') {
        formattedMessages.push({
          role: 'user',
          content: message
        });
      } else {
        console.warn('Message is not a string:', message);
      }
    }
    
    try {
      // Make request to Grok3 API
      console.log('Calling Grok3 API with formatted messages:', JSON.stringify(formattedMessages).substring(0, 200) + '...');
      
      const response = await fetch('https://api.xai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROK3_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: formattedMessages,
          model: 'grok-3',
          max_tokens: 4096,
          temperature: 0.7
        })
      });
      
      // Enhanced error handling for response
      if (!response.ok) {
        let errorMessage, errorDetails;
        
        try {
          const errorData = await response.json();
          console.error('Grok3 API error:', JSON.stringify(errorData));
          
          // Check specifically for invalid API key errors
          if (response.status === 401 || 
              (errorData?.error?.message && errorData.error.message.includes("API key"))) {
            return new Response(
              JSON.stringify({ 
                error: "Invalid API Key. Please check your Grok3 API key and update it in the settings.",
                details: errorData,
                status: 'unauthorized'
              }),
              { 
                status: 401, 
                headers: corsHeaders 
              }
            );
          }
          
          errorMessage = errorData.error?.message || `Grok3 API error: ${response.status} ${response.statusText}`;
          errorDetails = errorData;
        } catch (e) {
          const errorText = await response.text().catch(() => 'Failed to read error response');
          console.error(`Grok3 API error (${response.status} ${response.statusText}):`, errorText);
          errorMessage = `Grok3 API error: ${response.status} ${response.statusText}`;
          errorDetails = errorText;
        }
        
        // Provide user-friendly error message based on status code
        if (response.status === 401 || response.status === 403) {
          errorMessage = 'Authentication failed. Please check your API key.';
        } else if (response.status === 429) {
          errorMessage = 'Rate limit exceeded. Please try again later.';
        } else if (response.status >= 500) {
          errorMessage = 'Grok3 API service is currently unavailable. Please try again later.';
        }
        
        return new Response(
          JSON.stringify({ 
            error: errorMessage, 
            details: errorDetails,
            status: 'error'
          }),
          { 
            status: 500, 
            headers: corsHeaders 
          }
        );
      }
      
      const data = await response.json();
      console.log('Grok3 API response received:', JSON.stringify(data).substring(0, 200) + '...');
      
      // Verify that the response contains the expected structure
      if (!data || !data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        console.error('Unexpected response format from Grok3 API:', data);
        return new Response(
          JSON.stringify({ 
            error: 'Invalid response format from Grok3 API',
            status: 'error'
          }),
          { 
            status: 500, 
            headers: corsHeaders 
          }
        );
      }
      
      // Return successful response
      return new Response(
        JSON.stringify({
          response: data.choices[0].message.content,
          status: 'success'
        }),
        { headers: corsHeaders }
      );
    } catch (apiError) {
      console.error('API call error in grok3-response function:', apiError);
      return new Response(
        JSON.stringify({ 
          error: `API call error: ${apiError.message}`,
          status: 'error'
        }),
        { 
          status: 500, 
          headers: corsHeaders 
        }
      );
    }
  } catch (error) {
    console.error('Error in grok3-response function:', error);
    return new Response(
      JSON.stringify({ 
        error: `Server error: ${error.message}`,
        status: 'error'
      }),
      { 
        status: 500, 
        headers: corsHeaders 
      }
    );
  }
});
