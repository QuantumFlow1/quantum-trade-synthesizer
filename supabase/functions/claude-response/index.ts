
// Import necessary modules for Deno
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// CORS headers to allow cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// Main function to handle requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error("Error parsing request body:", e);
      return new Response(
        JSON.stringify({ error: 'Invalid request body format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Extract parameters and validate
    const { messages, model, temperature, max_tokens, apiKey, useMCP = false, systemPrompt } = body;

    // Validate required parameters
    if (!apiKey) {
      console.error("Missing API key");
      return new Response(
        JSON.stringify({ error: 'API key is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("Invalid or missing messages array");
      return new Response(
        JSON.stringify({ error: 'A valid messages array is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Logging for debugging
    console.log(`Claude API request for model: ${model || 'claude-3-haiku-20240307'}`);
    console.log(`Messages count: ${messages.length}`);
    console.log(`Using MCP: ${useMCP}`);

    // Ensure all messages have the required role and content properties
    const validMessages = messages.filter(msg => 
      msg && typeof msg === 'object' && 
      'role' in msg && 
      'content' in msg && 
      typeof msg.content === 'string' &&
      ['user', 'assistant', 'system'].includes(msg.role)
    );

    if (validMessages.length === 0) {
      console.error("No valid messages with proper format found");
      return new Response(
        JSON.stringify({ error: 'No valid messages with proper format were provided' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Determine which Claude API model to use
    const claudeModel = model || 'claude-3-haiku-20240307';

    console.log(`Using Claude model: ${claudeModel}`);
    
    // For security, don't log the full messages with potentially sensitive data
    console.log(`Making request to Claude API with ${validMessages.length} messages`);

    try {
      let response;
      
      if (useMCP) {
        // Use the Model Control Protocol (MCP) for Claude
        console.log("Using Claude MCP API");
        
        // Prepare payload with system prompt if provided
        const payload = {
          model: claudeModel,
          messages: validMessages,
          max_tokens: max_tokens || 1024,
          temperature: temperature || 0.7,
        };
        
        // Add control object for MCP
        payload.control = {
          prompt: systemPrompt || "You are an AI assistant providing helpful responses.",
          format: { type: "text" } // Default to text format
        };
        
        // MCP requires a specific endpoint and headers
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-beta': 'model-control-protocol-v1' // Enable MCP
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Use the standard Claude API
        console.log("Using standard Claude API");
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: claudeModel,
            messages: validMessages,
            max_tokens: max_tokens || 1024,
            temperature: temperature || 0.7
          })
        });
      }

      // Get the raw response text first for error handling
      const responseText = await response.text();
      
      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Error parsing Claude API response:", e);
        console.error("Raw response:", responseText);
        return new Response(
          JSON.stringify({ 
            error: `Failed to parse Claude API response: ${e.message}`,
            rawResponse: responseText.substring(0, 200) // Include part of the raw response for debugging
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Check if the response is successful
      if (!response.ok) {
        console.error('Claude API error:', data);
        
        return new Response(
          JSON.stringify({ 
            error: `Claude API returned error: ${response.status} ${response.statusText}`,
            details: data
          }),
          { 
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Verify the response contains the necessary fields
      if (!data || !data.content || !Array.isArray(data.content) || data.content.length === 0) {
        console.error('Invalid response structure from Claude API:', data);
        return new Response(
          JSON.stringify({ 
            error: 'Invalid response structure from Claude API',
            details: data
          }),
          {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Extract the text from the response - handle both standard and MCP responses
      let text = '';
      let contentType = 'text';
      
      // Special handling for different content types in MCP
      if (useMCP) {
        // Process MCP content appropriately based on type
        if (data.content[0]?.type === 'tool_use') {
          // Handle MCP tool_use response format
          contentType = 'tool_use';
          text = JSON.stringify(data.content[0].input);
          console.log('Claude MCP tool response received');
        } else if (data.content[0]?.type === 'json' || 
                  (data.content[0]?.type === 'text' && 
                   data.content[0]?.text?.startsWith('{'))) {
          // Handle JSON format responses (explicit or detected)
          contentType = 'json';
          text = data.content[0]?.text || '';
          console.log('Claude MCP JSON response received');
        } else {
          // Handle standard text response
          contentType = 'text';
          text = data.content[0]?.text || '';
          console.log('Claude MCP text response received');
        }
      } else {
        // Handle standard text response
        text = data.content[0]?.text || '';
        console.log('Claude standard response received');
      }
      
      console.log('Response length:', text.length);

      // Return the Claude API response
      return new Response(JSON.stringify({ 
        response: text,
        model: claudeModel,
        usedMCP: useMCP,
        contentType: contentType,
        rawContent: useMCP ? data.content : null
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (fetchError) {
      console.error('Error in Claude API request:', fetchError);
      return new Response(
        JSON.stringify({ 
          error: `Error making request to Claude API: ${fetchError.message}` 
        }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Unexpected error in Claude function:', error.message);
    
    // Return an error response
    return new Response(JSON.stringify({ 
      error: `Unexpected error: ${error.message}` 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
