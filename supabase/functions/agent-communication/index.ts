
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-groq-api-key, x-openai-api-key',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API keys from request headers
    const groqApiKey = req.headers.get('x-groq-api-key');
    const openaiApiKey = req.headers.get('x-openai-api-key');
    
    // Check if we have at least one API key
    if (!groqApiKey && !openaiApiKey) {
      return new Response(
        JSON.stringify({ status: 'error', error: 'Missing API key. Please provide either a Groq or OpenAI API key.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Parse request body
    const { agentId, agentType, message, systemPrompt, history } = await req.json();
    
    // Validate required fields
    if (!message) {
      return new Response(
        JSON.stringify({ status: 'error', error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Processing agent communication for agent ${agentId} (${agentType})`);
    
    // Prepare messages for the API
    const messages = [
      { role: 'system', content: systemPrompt || `You are a ${agentType} trading agent.` },
      ...(history || []),
      { role: 'user', content: message }
    ];
    
    try {
      let response;
      
      // Try Groq first if we have a key
      if (groqApiKey) {
        console.log("Using Groq API for agent response");
        response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama3-70b-8192',
            messages: messages,
            temperature: 0.7,
            max_tokens: 1024
          })
        });
      } 
      // Fallback to OpenAI if no Groq key or if Groq fails
      else if (openaiApiKey) {
        console.log("Using OpenAI API for agent response");
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: messages,
            temperature: 0.7,
            max_tokens: 1024
          })
        });
      }
      
      if (!response?.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      const agentResponse = data.choices[0].message.content.trim();
      
      console.log(`Agent ${agentId} response generated successfully`);
      
      return new Response(
        JSON.stringify({ status: 'success', response: agentResponse }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error("Error getting agent response:", error);
      
      // Return error response
      return new Response(
        JSON.stringify({ status: 'error', error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Error in agent-communication function:", error);
    
    return new Response(
      JSON.stringify({ status: 'error', error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
