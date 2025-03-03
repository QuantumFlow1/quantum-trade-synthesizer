
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get environment variables
const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');

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
    const { messages, apiKey } = await req.json();
    
    console.log(`DeepSeek API request with ${messages.length} messages`);
    
    // Use API key from request or fall back to environment variable
    const key = apiKey || DEEPSEEK_API_KEY;
    
    if (!key) {
      console.error('No DeepSeek API key provided');
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
    
    // Format the messages for DeepSeek API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Make request to DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: formattedMessages,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', errorText);
      return new Response(
        JSON.stringify({ 
          error: `API error: ${errorText}` 
        }),
        { 
          status: response.status, 
          headers: corsHeaders 
        }
      );
    }
    
    const data = await response.json();
    console.log('DeepSeek API response received');
    
    return new Response(
      JSON.stringify({
        content: data.choices[0].message.content
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error in deepseek-response function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
