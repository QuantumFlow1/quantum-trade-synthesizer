
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get environment variables
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

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
    const { message, context = [], model = 'gpt-4o-mini', maxTokens = 1000, temperature = 0.7, apiKey } = await req.json();
    
    console.log(`OpenAI API request with message length: ${message?.length}, context messages: ${context?.length}`);
    console.log(`Using model: ${model}, temperature: ${temperature}, maxTokens: ${maxTokens}`);
    
    // Use API key from request or fall back to environment variable
    const key = apiKey || OPENAI_API_KEY;
    
    if (!key) {
      console.error('No OpenAI API key provided');
      return new Response(
        JSON.stringify({ 
          error: 'API key is required' 
        }),
        { 
          status: 400, 
          headers: corsHeaders 
        }
      );
    }
    
    // Format the messages for OpenAI API
    const formattedMessages = [...context];
    
    // Add current message if provided
    if (message) {
      formattedMessages.push({
        role: 'user',
        content: message
      });
    }
    
    try {
      // Make request to OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: formattedMessages,
          temperature: temperature,
          max_tokens: maxTokens
        })
      });
      
      // Enhanced error handling for response
      if (!response.ok) {
        const errorData = await response.text();
        let parsedError;
        
        try {
          parsedError = JSON.parse(errorData);
        } catch {
          parsedError = { error: errorData };
        }
        
        console.error(`OpenAI API error (${response.status} ${response.statusText}):`, parsedError);
        
        return new Response(
          JSON.stringify({ 
            error: `OpenAI API error: ${response.status} ${response.statusText}`, 
            details: parsedError
          }),
          { 
            status: 500, 
            headers: corsHeaders 
          }
        );
      }
      
      const data = await response.json();
      console.log('OpenAI API response received');
      
      // Verify that the response contains the expected structure
      if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Unexpected response format from OpenAI API:', data);
        return new Response(
          JSON.stringify({ 
            error: 'Invalid response format from OpenAI API' 
          }),
          { 
            status: 500, 
            headers: corsHeaders 
          }
        );
      }
      
      return new Response(
        JSON.stringify({
          response: data.choices[0].message.content
        }),
        { headers: corsHeaders }
      );
    } catch (apiError) {
      console.error('API call error in openai-response function:', apiError);
      return new Response(
        JSON.stringify({ 
          error: `API call error: ${apiError.message}` 
        }),
        { 
          status: 500, 
          headers: corsHeaders 
        }
      );
    }
  } catch (error) {
    console.error('Error in openai-response function:', error);
    return new Response(
      JSON.stringify({ 
        error: `Server error: ${error.message}` 
      }),
      { 
        status: 500, 
        headers: corsHeaders 
      }
    );
  }
});
