
import { corsHeaders } from '../_shared/cors.ts';

// Define constants
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_API_VERSION = '2023-06-01';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Claude edge function invoked');
    
    // Parse the request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid request body format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    const { 
      message, 
      context, 
      model = 'claude-3-haiku-20240307', 
      maxTokens = 1024, 
      temperature = 0.7, 
      apiKey 
    } = requestBody;

    // Validate required parameters
    if (!message) {
      console.error('Missing required parameter: message');
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!apiKey) {
      console.error('Missing required parameter: apiKey');
      return new Response(
        JSON.stringify({ error: 'Claude API key is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Claude API request configuration:', { 
      model,
      messageLength: message.length,
      contextLength: Array.isArray(context) ? context.length : 0,
      temperature,
      maxTokens,
      apiKeyProvided: !!apiKey
    });
    
    // Prepare system prompt
    const systemPrompt = "You are Claude, an AI assistant by Anthropic. You are helpful, harmless, and honest.";
    
    // Create Claude API messages format
    const messages = [
      { role: "system", content: systemPrompt },
    ];
    
    // Add context messages if available
    if (context && Array.isArray(context)) {
      context.forEach(msg => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: msg.content
          });
        }
      });
    }
    
    // Add the current message
    messages.push({ role: "user", content: message });
    
    console.log('Sending request to Claude API...');
    
    try {
      const claudeResponse = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': CLAUDE_API_VERSION
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          max_tokens: maxTokens,
          temperature: temperature
        })
      });
      
      // Log the response status
      console.log('Claude API response status:', claudeResponse.status);
      
      // Check for API errors
      if (!claudeResponse.ok) {
        const errorData = await claudeResponse.text();
        console.error('Claude API error response:', claudeResponse.status, errorData);
        
        let errorMessage = `Claude API returned status ${claudeResponse.status}`;
        
        try {
          // Try to parse the error as JSON
          const parsedError = JSON.parse(errorData);
          if (parsedError.error) {
            errorMessage = `Claude API error: ${parsedError.error.message || parsedError.error.type || JSON.stringify(parsedError.error)}`;
          }
        } catch (e) {
          // If parsing fails, use the raw error text
          errorMessage = `Claude API error (${claudeResponse.status}): ${errorData.substring(0, 200)}`;
        }
        
        return new Response(
          JSON.stringify({ error: errorMessage }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: claudeResponse.status }
        );
      }
      
      const responseData = await claudeResponse.json();
      console.log('Claude API response received, content length:', 
        responseData.content?.[0]?.text?.length || 0);
      
      // Extract the response content
      const responseContent = responseData.content?.[0]?.text;
      
      if (!responseContent) {
        console.error('No content in Claude response:', JSON.stringify(responseData).substring(0, 200));
        return new Response(
          JSON.stringify({ error: 'No content in Claude response' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      return new Response(
        JSON.stringify({ response: responseContent }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } catch (fetchError) {
      console.error('Error fetching from Claude API:', fetchError);
      return new Response(
        JSON.stringify({ error: `Failed to connect to Claude API: ${fetchError.message}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 502 }
      );
    }
    
  } catch (error) {
    console.error('Unhandled error in Claude edge function:', error);
    
    return new Response(
      JSON.stringify({ error: `Unhandled error: ${error.message}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
