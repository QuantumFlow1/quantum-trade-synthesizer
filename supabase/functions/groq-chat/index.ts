
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get the Groq API key from environment variables
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
    // Parse request data
    const requestData = await req.json();
    const { 
      messages, 
      model = "llama-3.3-70b-versatile", 
      temperature = 0.7, 
      max_tokens = 1024,
      response_format 
    } = requestData;
    
    console.log(`Received Groq chat request for model: ${model}`);
    
    // Check for client-provided API key in the header
    const clientApiKey = req.headers.get('x-groq-api-key');
    
    // Use client API key if provided, otherwise use the server's API key
    const apiKey = clientApiKey || GROQ_API_KEY;
    
    if (!apiKey) {
      console.error('No Groq API key available');
      return new Response(
        JSON.stringify({ 
          error: 'API key not configured. Please provide a Groq API key.',
          status: 'error' 
        }),
        { 
          status: 401, 
          headers: corsHeaders 
        }
      );
    }
    
    // Prepare the request body
    const requestBody: any = {
      messages,
      model,
      temperature,
      max_tokens
    };
    
    // Add JSON response format if requested
    if (response_format === 'json') {
      requestBody.response_format = { type: "json_object" };
    }
    
    // Make the API call to Groq
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    // Handle non-OK responses
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `HTTP error: ${response.status} ${response.statusText}` };
      }
      
      console.error('Groq API error:', errorData);
      
      return new Response(
        JSON.stringify({ 
          error: errorData.error?.message || `Groq API error: ${response.status}`,
          status: 'error'
        }),
        { 
          status: response.status, 
          headers: corsHeaders 
        }
      );
    }
    
    // Process successful response
    const data = await response.json();
    console.log('Groq API response received successfully');
    
    return new Response(
      JSON.stringify({
        response: data.choices[0].message.content,
        status: 'success',
        model: model,
        usage: data.usage,
        system_fingerprint: data.system_fingerprint || null
      }),
      { headers: corsHeaders }
    );
    
  } catch (error) {
    console.error('Error in groq-chat function:', error);
    
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
