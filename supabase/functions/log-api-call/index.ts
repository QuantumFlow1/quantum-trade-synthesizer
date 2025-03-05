
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

    // Parse the log data from the request
    const { 
      endpoint, 
      source, 
      status, 
      error_message,
      timestamp
    } = await req.json();

    // Validate the status type
    if (!['success', 'error', 'pending'].includes(status)) {
      throw new Error(`Invalid status: ${status}. Must be 'success', 'error', or 'pending'`);
    }

    console.log("Logging API call:", {
      endpoint, 
      source, 
      status, 
      error_message,
      timestamp
    });

    try {
      // Try to insert the log entry
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
        
        // If the table doesn't exist yet, return a specific response
        if (error.code === '42P01') {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: "The api_logs table does not exist yet. Please run migrations first." 
            }),
            { 
              status: 503,
              headers: { 
                ...corsHeaders,
                'Content-Type': 'application/json'
              } 
            }
          );
        }
        
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
    } catch (dbError) {
      // If database operation fails, fallback to console logging only
      console.error("Database error:", dbError);
      console.log("Fallback: Logging to console only");
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Could not write to database. Logged to console only." 
        }),
        { 
          status: 207, // Partial success
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json'
          } 
        }
      );
    }
  } catch (error) {
    console.error('Error processing API log request:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
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
