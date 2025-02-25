
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const grok3ApiKey = Deno.env.get("GROK3_API_KEY");

// Set up CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  // Check if API key is available
  if (!grok3ApiKey || grok3ApiKey.trim() === "") {
    console.error("GROK3_API_KEY is not set in environment variables");
    return new Response(
      JSON.stringify({
        error: "API key not configured",
        message: "GROK3_API_KEY is not set in the Supabase Edge Function secrets",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Parse request body
    const { message, context = [] } = await req.json();
    
    console.log(`Processing Grok3 request with message: ${message.slice(0, 50)}${message.length > 50 ? '...' : ''}`);
    
    // System ping test for availability check
    if (message === "system: ping test") {
      console.log("Received ping test request");
      return new Response(
        JSON.stringify({
          response: "pong",
          status: "available",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Prepare request to Grok3 API
    const requestData = {
      message,
      context,
      options: {
        max_tokens: 1024,
        temperature: 0.7,
      },
    };

    console.log("Sending request to Grok3 API");

    // Make request to Grok3 API with proper error handling
    const response = await fetch("https://api.grok-3.com/v1/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${grok3ApiKey}`,
      },
      body: JSON.stringify(requestData),
    });

    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Grok3 API error: ${response.status} ${response.statusText}`);
      console.error(`Error details: ${errorText}`);
      
      return new Response(
        JSON.stringify({
          error: `Grok3 API error: ${response.status}`,
          details: errorText,
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse response
    const data = await response.json();
    console.log("Received successful response from Grok3 API");
    
    return new Response(
      JSON.stringify({
        response: data.response || data.message || "No response content",
        raw: data,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing Grok3 request:", error.message);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        message: error.message,
        stack: error.stack,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
