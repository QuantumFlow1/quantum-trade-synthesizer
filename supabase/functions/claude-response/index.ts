
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.5.0';
import { corsHeaders } from '../_shared/cors.ts';

// Required for accessing Supabase services from within the function
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client for accessing other Supabase services if needed
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get request body
    const { 
      message, 
      context, 
      model = 'claude-3-haiku-20240307', 
      maxTokens = 1024, 
      temperature = 0.7, 
      apiKey 
    } = await req.json();

    console.log('Claude API request received:', { 
      model,
      contextLength: context?.length || 0,
      temperature,
      maxTokens,
      hasApiKey: !!apiKey
    });
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Claude API key is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

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
    
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: maxTokens,
        temperature: temperature
      })
    });
    
    // Check for API errors
    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error('Claude API error:', claudeResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: `Claude API returned ${claudeResponse.status}: ${errorText}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 502 }
      );
    }
    
    const responseData = await claudeResponse.json();
    console.log('Claude API response received:', JSON.stringify(responseData).substring(0, 150) + '...');
    
    // Extract the response content
    const responseContent = responseData.content && responseData.content[0]?.text;
    
    return new Response(
      JSON.stringify({ response: responseContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in Claude function:', error.message);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
