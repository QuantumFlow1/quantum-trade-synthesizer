
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get environment variables
const GROK3_API_KEY = Deno.env.get('GROK3_API_KEY');
const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-groq-api-key',
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
    
    console.log(`Grok3/Groq API request received${isAvailabilityCheck ? ' (availability check)' : ''}`);
    
    // If this is just an availability check, return success
    if (isAvailabilityCheck) {
      console.log('API availability check - responding with pong');
      return new Response(
        JSON.stringify({ 
          status: 'available', 
          response: 'pong' 
        }),
        { headers: corsHeaders }
      );
    }
    
    // Check for client-provided Groq API key in header
    const clientGroqKey = req.headers.get('x-groq-api-key');
    
    // Try to use client-provided key first, then fall back to environment variable
    const groqApiKey = clientGroqKey || GROQ_API_KEY;
    
    // Verify we have at least one API key available
    if (!GROK3_API_KEY && !groqApiKey) {
      console.error('No API key provided (neither Grok3 nor Groq)');
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured. Please set either a Grok3 or Groq API key.',
          status: 'unavailable' 
        }),
        { 
          status: 400, 
          headers: corsHeaders 
        }
      );
    }
    
    // If we have a Groq API key, use the Groq API
    if (groqApiKey) {
      console.log('Using Groq API with provided key');
      
      // Format the messages for Groq API
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
        // Make request to Groq API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: formattedMessages,
            model: 'llama3-70b-8192',
            max_tokens: 1024,
            temperature: 0.7
          })
        });
        
        // Handle non-OK responses
        if (!response.ok) {
          let errorMessage = `Groq API error: ${response.status} ${response.statusText}`;
          
          try {
            const errorData = await response.json();
            console.error('Groq API error:', errorData);
            errorMessage = errorData.error?.message || errorMessage;
          } catch (e) {
            console.error('Failed to parse error response');
          }
          
          return new Response(
            JSON.stringify({ 
              error: errorMessage,
              status: 'error'
            }),
            { 
              status: 500, 
              headers: corsHeaders 
            }
          );
        }
        
        const data = await response.json();
        console.log('Groq API response received');
        
        return new Response(
          JSON.stringify({
            response: data.choices[0].message.content,
            status: 'success'
          }),
          { headers: corsHeaders }
        );
      } catch (apiError) {
        console.error('Groq API call error:', apiError);
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
    }
    
    // Simulate a successful response for now (since we may not have actual Grok API access)
    console.log('Generating simulated response');
    const simulatedResponse = {
      response: "I'm a simulated Grok response. The actual Grok API is not connected at the moment, but you can use this simulated mode for testing.",
      status: 'success'
    };
    
    return new Response(
      JSON.stringify(simulatedResponse),
      { headers: corsHeaders }
    );
    
    // Note: The actual Grok3 API call code is commented out for now to ensure we don't get connection errors
    // Uncomment this when the actual API key is properly configured
    /*
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
      console.log('Calling Grok3 API with formatted messages');
      
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
      
      // Handle non-OK responses
      if (!response.ok) {
        let errorMessage = `Grok3 API error: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          console.error('Grok3 API error:', errorData);
          errorMessage = errorData.error?.message || errorMessage;
        } catch (e) {
          console.error('Failed to parse error response');
        }
        
        return new Response(
          JSON.stringify({ 
            error: errorMessage,
            status: 'error'
          }),
          { 
            status: 500, 
            headers: corsHeaders 
          }
        );
      }
      
      const data = await response.json();
      console.log('Grok3 API response received');
      
      return new Response(
        JSON.stringify({
          response: data.choices[0].message.content,
          status: 'success'
        }),
        { headers: corsHeaders }
      );
    } catch (apiError) {
      console.error('API call error:', apiError);
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
    */
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
