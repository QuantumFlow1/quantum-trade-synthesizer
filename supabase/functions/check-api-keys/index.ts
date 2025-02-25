
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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

  try {
    // Check for existence of API keys (not their values)
    const grok3ApiKey = Deno.env.get("GROK3_API_KEY");
    const openAiApiKey = Deno.env.get("OPENAI_API_KEY");
    const elevenLabsApiKey = Deno.env.get("ELEVEN_LABS_API_KEY") || Deno.env.get("ELEVENLABS_API_KEY");

    console.log(`API Keys check: 
      Grok3: ${grok3ApiKey ? "Set" : "Not set"}
      OpenAI: ${openAiApiKey ? "Set" : "Not set"}
      ElevenLabs: ${elevenLabsApiKey ? "Set" : "Not set"}`
    );

    return new Response(
      JSON.stringify({
        data: {
          grok3ApiKeySet: !!grok3ApiKey,
          openAiApiKeySet: !!openAiApiKey,
          elevenLabsApiKeySet: !!elevenLabsApiKey
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error checking API keys:", error.message);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({
        error: "Failed to check API keys",
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
