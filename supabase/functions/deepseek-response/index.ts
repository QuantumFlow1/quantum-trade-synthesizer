
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
    const { message, context = [], model = 'deepseek-chat', maxTokens = 1000, temperature = 0.7, apiKey } = await req.json();
    
    console.log(`DeepSeek API request with message length: ${message?.length}, context messages: ${context?.length}`);
    console.log(`Using model: ${model}, temperature: ${temperature}, maxTokens: ${maxTokens}`);
    
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
    const formattedMessages = [...context];
    
    // Add current message if provided
    if (message) {
      formattedMessages.push({
        role: 'user',
        content: message
      });
    }
    
    // Ensure we handle empty messages array
    if (formattedMessages.length === 0) {
      formattedMessages.push({
        role: 'user',
        content: 'Hello'
      });
    }
    
    console.log('Sending to DeepSeek API with formatted messages:', JSON.stringify(formattedMessages.slice(0, 2) + (formattedMessages.length > 2 ? '...' : '')));
    
    try {
      // Make request to DeepSeek API
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
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
        let errorText = '';
        try {
          const errorJson = await response.json();
          errorText = JSON.stringify(errorJson);
        } catch (e) {
          errorText = await response.text();
        }
        
        console.error(`DeepSeek API error (${response.status} ${response.statusText}):`, errorText);
        
        return new Response(
          JSON.stringify({ 
            error: `DeepSeek API error: ${response.status} ${response.statusText}`, 
            details: errorText
          }),
          { 
            status: 500, 
            headers: corsHeaders 
          }
        );
      }
      
      const data = await response.json();
      console.log('DeepSeek API response received:', {
        status: response.status,
        choices: data.choices ? data.choices.length : 0
      });
      
      // Verify that the response contains the expected structure
      if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Unexpected response format from DeepSeek API:', data);
        return new Response(
          JSON.stringify({ 
            error: 'Invalid response format from DeepSeek API' 
          }),
          { 
            status: 500, 
            headers: corsHeaders 
          }
        );
      }
      
      return new Response(
        JSON.stringify({
          response: data.choices[0].message.content,
          id: data.id,
          model: data.model
        }),
        { headers: corsHeaders }
      );
    } catch (apiError) {
      console.error('API call error in deepseek-response function:', apiError);
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
    console.error('Error in deepseek-response function:', error);
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
