
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const {
      endpoint,
      source,
      status,
      error_message,
      timestamp
    } = await req.json();

    console.log("Logging API call:", {
      endpoint,
      source,
      status,
      error_message,
      timestamp
    });

    // Log the API call
    const { data, error } = await supabase
      .from('api_logs')
      .insert({
        endpoint,
        source,
        status,
        error_message,
        timestamp: timestamp || new Date().toISOString(),
        request_ip: req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown'
      });

    if (error) {
      console.error("Error logging API call:", error);
      throw error;
    }

    console.log("API call logged successfully");

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  } catch (error) {
    console.error('Error in log-api-call function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
